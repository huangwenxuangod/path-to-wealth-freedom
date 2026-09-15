#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
[ "$#" -eq 1 ] || { echo 'Usage: ROLLBACK.sh NEW_DIRECTORY' >&2; exit 2; }
python3 - "$root" "$1" <<'PYTHON'
import sys,pathlib,shutil,json,hashlib
root,target=map(pathlib.Path,sys.argv[1:])
target.mkdir(parents=True,exist_ok=False)
shutil.copyfile(root/'evidence/baseline-README.md',target/'README.md')
shutil.copytree(root/'evidence/baseline-docs',target/'docs')
expected=json.loads((root/'evidence/baseline-hashes.json').read_text())
for name,digest in expected.items():
    assert hashlib.sha256((target/name).read_bytes()).hexdigest()==digest,name
print('ROLLBACK_PASS 3 original document hashes; live project unchanged')
PYTHON
