import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const r=spawnSync(process.execPath,[require.resolve('typescript/bin/tsc'),'--noEmit'],{stdio:'inherit'});
process.exit(r.status??1);
