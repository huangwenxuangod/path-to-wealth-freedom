import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const cli=require.resolve('@remotion/cli/package.json').replace(/package\.json$/,'remotion-cli.js');
const r=spawnSync(process.execPath,[cli,'studio','src/index.ts','--no-open',...process.argv.slice(2)],{stdio:'inherit'});
process.exit(r.status??1);
