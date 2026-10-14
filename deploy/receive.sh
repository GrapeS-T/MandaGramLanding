#!/bin/bash
set -euo pipefail
umask 022

# This root-owned script is the only command permitted by the deployment key.
if [[ ! ${SSH_ORIGINAL_COMMAND:-} =~ ^deploy\ ([0-9a-f]{40})$ ]]; then
    echo 'Expected: deploy <commit SHA>' >&2
    exit 1
fi
sha=${BASH_REMATCH[1]}
base=/srv/mandagram
exec 9>"$base/.deploy.lock"
flock -x 9
stage=$(mktemp -d "$base/releases/.incoming.XXXXXXXX")
trap 'rm -rf -- "$stage"; rm -f -- "$base/.current-next"' EXIT

tar --extract --gzip --file=- --directory="$stage" --no-same-owner --no-same-permissions
test -f "$stage/index.html"
test "$(cat "$stage/deployment.txt")" = "$sha"
# Never expose uploaded symlinks through the web root.
if find "$stage" -type l -print -quit | read -r _; then
    echo 'Symlinks are not allowed in the static artifact' >&2
    exit 1
fi
chmod -R u=rwX,go=rX "$stage"
release="$base/releases/$sha"
if [[ -e $release ]]; then
    rm -rf -- "$stage"
else
    mv -- "$stage" "$release"
fi
ln -s "releases/$sha" "$base/.current-next"
mv -Tf -- "$base/.current-next" "$base/current"
printf 'Published %s\n' "$sha"
