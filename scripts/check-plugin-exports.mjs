import { execFileSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';

const files = process.argv.slice(2);
if (!files.length) throw new Error('Usage: npm run examples:exports -- <plugin.dll|plugin.so> [...]');
const required = ['mandagram_plugin_metadata', 'mandagram_plugin_init'];
for (const name of files) {
  const filename = path.resolve(name);
  await access(filename);
  let text;
  let symbols;
  if (process.platform === 'win32') {
    text = execFileSync('dumpbin.exe', ['/nologo', '/exports', filename], { encoding: 'utf8' });
    symbols = new Set([...text.matchAll(/^\s*\d+\s+[0-9a-f]+\s+[0-9a-f]+\s+(\S+)/gim)].map((match) => match[1]));
  } else if (process.platform === 'linux') {
    text = execFileSync('nm', ['-D', '--defined-only', filename], { encoding: 'utf8' });
    symbols = new Set(text.split(/\r?\n/).map((line) => line.trim().split(/\s+/).at(-1)));
  } else {
    throw new Error('Export inspection supports Windows/Linux x64 CI hosts only.');
  }
  for (const symbol of required) {
    if (!symbols.has(symbol)) throw new Error(`${filename}: missing undecorated export ${symbol}\n${text}`);
  }
  console.log(`${name}: both required exports present (static inspection, no library loading).`);
}
