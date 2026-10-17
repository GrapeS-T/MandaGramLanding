import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = JSON.parse(await readFile(path.join(root, 'scripts/plugin-sdk-source.json'), 'utf8'));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const normalize = (bytes) => Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));
const load = async (name) => normalize(await readFile(path.join(root, name)));
const headers = new Map();
for (const header of source.headers) {
  const bytes = await load(`public/include/${header.file}`);
  if (sha256(bytes) !== header.sha256) {
    throw new Error(`Pinned source mismatch: public/include/${header.file}. Audit the engine revision and source manifest; do not silently refresh hashes.`);
  }
  headers.set(header.file, bytes);
}

const args = process.argv.slice(2);
if (args[0] === '--verify-source' && args.length === 2) {
  const engineRoot = path.resolve(args[1]);
  for (const header of source.headers) {
    const committed = execFileSync('git', ['-C', engineRoot, 'show', `${source.engine.commit}:${header.enginePath}`]);
    if (sha256(committed) !== header.sha256) throw new Error(`Committed engine header mismatch: ${header.enginePath}`);
    const working = await readFile(path.join(engineRoot, header.enginePath));
    if (!normalize(working).equals(committed)) throw new Error(`Engine working header differs from pinned revision: ${header.enginePath}`);
    console.log(`${header.file}: committed SHA256 ${header.sha256}; working copy ${working.equals(committed) ? 'byte-identical' : 'identical after CRLF normalization'}`);
  }
  const changes = execFileSync('git', ['-C', engineRoot, 'status', '--short', '--', ...source.headers.map((h) => h.enginePath)], { encoding: 'utf8' }).trim();
  console.log(changes ? `Header working-tree status:\n${changes}` : 'No engine header working-tree changes.');
  process.exit(0);
}
if (args.length) throw new Error('Usage: npm run sdk OR npm run sdk:verify-source -- <engine-checkout>');

// Explicit inputs exclude compiler outputs, caches, lockfiles and local data.
const examplePaths = [
  'cpp/plugin.cpp',
  'cpp/hello.cpp',
  'rust/Cargo.toml',
  'rust/src/lib.rs',
  'zig/build.zig',
  'zig/plugin.zig',
  'd/dub.json',
  'd/mandagram_plugin.d',
  'recipes/chat_counter.cpp',
  'recipes/config.txt',
];
const entries = new Map();
for (const [name, bytes] of headers) {
  entries.set(`include/${name}`, bytes);
  entries.set(`examples/include/${name}`, bytes);
}
for (const name of examplePaths) entries.set(`examples/${name}`, await load(`public/examples/${name}`));
entries.set('BUILDING.txt', await load('scripts/SDK-BUILDING.txt'));
const compareNames = ([a], [b]) => a < b ? -1 : a > b ? 1 : 0;
const manifest = {
  ...source,
  archive: { format: 'ZIP STORE', timestamps: '1980-01-01T00:00:00', paths: 'sorted UTF-8', contents: 'Source only; no precompiled plugins. Manifest excludes its own hash.' },
  files: Object.fromEntries([...entries].sort(compareNames).map(([name, bytes]) => [name, { sha256: sha256(bytes), bytes: bytes.length }])),
};
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
entries.set('manifest.json', manifestBytes);

// Minimal ZIP32 STORE writer: no compression/runtime version variability or dependencies.
// All inputs are fixed, small UTF-8 source files, never user-supplied archive paths.
const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}
function zip(files) {
  const local = [];
  const central = [];
  let offset = 0;
  let centralSize = 0;
  for (const [name, bytes] of [...files].sort(compareNames)) {
    const filename = Buffer.from(name);
    if (bytes.length > 0xffffffff || filename.length > 0xffff) throw new Error('ZIP32 input limit exceeded');
    const checksum = crc32(bytes);
    const record = Buffer.alloc(30);
    record.writeUInt32LE(0x04034b50, 0);
    record.writeUInt16LE(20, 4);
    record.writeUInt16LE(0x0800, 6); // UTF-8; stored, no descriptor.
    record.writeUInt16LE(0x0021, 12); // DOS date 1980-01-01; time zero.
    record.writeUInt32LE(checksum, 14);
    record.writeUInt32LE(bytes.length, 18);
    record.writeUInt32LE(bytes.length, 22);
    record.writeUInt16LE(filename.length, 26);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4); // Platform-independent DOS creator.
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(0x0800, 8);
    directory.writeUInt16LE(0x0021, 14);
    directory.writeUInt32LE(checksum, 16);
    directory.writeUInt32LE(bytes.length, 20);
    directory.writeUInt32LE(bytes.length, 24);
    directory.writeUInt16LE(filename.length, 28);
    directory.writeUInt32LE(offset, 42);
    local.push(record, filename, bytes);
    central.push(directory, filename);
    offset += record.length + filename.length + bytes.length;
    centralSize += directory.length + filename.length;
  }
  if (files.size > 0xffff || offset + centralSize > 0xffffffff) throw new Error('ZIP32 archive limit exceeded');
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.size, 8);
  end.writeUInt16LE(files.size, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

const bundle = zip(entries);
const output = path.join(root, 'public/sdk');
await mkdir(output, { recursive: true });
await mkdir(path.join(root, 'public/examples/include'), { recursive: true });
for (const [name, bytes] of headers) {
  const destination = path.join(root, 'public/examples/include', name);
  await writeFile(destination, bytes);
  if (sha256(await readFile(destination)) !== sha256(bytes)) throw new Error(`Derived include mismatch: ${name}`);
}
await writeFile(path.join(output, 'manifest.json'), manifestBytes);
await writeFile(path.join(output, 'BUILDING.txt'), entries.get('BUILDING.txt'));
await writeFile(path.join(output, 'mandagram-plugin-sdk.zip'), bundle);
await writeFile(path.join(output, 'mandagram-plugin-sdk.zip.sha256'), `${sha256(bundle)}  mandagram-plugin-sdk.zip\n`);
console.log(`SDK: ${entries.size} entries; SHA256 ${sha256(bundle)}. Source hashes checked; no compiler or client executed.`);
