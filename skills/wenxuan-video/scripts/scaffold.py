import argparse,pathlib,shutil
p=argparse.ArgumentParser();p.add_argument('target',type=pathlib.Path);a=p.parse_args();target=a.target.resolve()
if target.exists() and any(target.iterdir()):p.error('target must be an empty or new directory')
starter=pathlib.Path(__file__).resolve().parent.parent/'assets/starter'
shutil.copytree(starter,target,dirs_exist_ok=True)
print(f'SCAFFOLD_PASS {target}; next: bun install, bun run typecheck, bun run check, bun run stills, bun run render')
