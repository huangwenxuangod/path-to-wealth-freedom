# Distribution package

This folder contains clean Agent Skills packages prepared for publishing or installation.

## Source Router

Skill path:

```text
skills/source-router/
```

Install examples:

```bash
# Claude Code project install
mkdir -p .claude/skills
cp -r skills/source-router .claude/skills/source-router

# Claude Code global install
cp -r skills/source-router ~/.claude/skills/source-router

# skills.sh / npx skills style after publishing this folder to GitHub
npx skills add https://github.com/<owner>/<repo>/tree/main/skills/source-router
```

Before publishing, confirm:

```text
- no .env
- no output/
- no __pycache__
- no private capture artifacts
```
