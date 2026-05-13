---
name: hyperframes-ai-video-builder
description: Build or iterate dynamic AI videos with HyperFrames + TypeScript + Bun for personal intros, capability showcases, workflow demonstrations, and knowledge-style brand videos. Use when the user wants a video that feels dynamic rather than PPT-like, needs a reusable production workflow, wants Swiss-style refined visual direction, or asks to generate, improve, render, validate, or standardize a HyperFrames-based AI video project.
---

# HyperFrames AI Video Builder

Use this skill to build or refine dynamic AI videos inside this project.

## Start Here

Read these project docs first:

1. `docs/01-requirements.md`
2. `docs/02-creative-direction.md`
3. `docs/05-execution-plan.md`
4. `docs/06-production-standard.md`

Then inspect the current implementation:

- `app/src/build.ts`
- `app/src/data.ts`
- `app/src/tts.ts`
- `app/src/captions.ts`

Do not start by improvising visuals from scratch if those files and docs already contain the current standard.

## Default Goal

Produce a video that:

- feels like a running system, not a slide deck
- is built end-to-end with TypeScript + Bun
- renders through HyperFrames
- keeps motion, subtitles, TTS, and output paths reproducible
- follows the project's Swiss-inspired refined visual standard

## Required Workflow

### 1. Collapse the brief

Extract or confirm:

1. display name
2. topic
3. aspect ratio
4. target duration
5. narration style
6. face/no-face constraint
7. content source
8. CTA
9. primary emphasis: identity / capability / workflow / result

If the user is already clear, proceed without asking extra open-ended questions.

### 2. Structure the script

Turn the content into short lines that map cleanly to scenes.

Default scene buckets:

1. identity
2. point of view
3. workflow
4. system composition
5. capability / acceleration
6. target / proof
7. CTA

Keep script lines concise enough to support motion design.

### 3. Design the visual system before coding

Default direction:

- Swiss-style restraint
- one accent color
- strong grid
- left/top alignment
- light-weight large typography
- rectilinear modules
- system diagrams instead of floating stickers

Avoid:

- PPT page-turn feeling
- random orbit circles as the main visual device
- rotated floating labels
- gradient-heavy tech wallpaper
- multiple accent colors
- decorative motion without information value

### 4. Implement in the existing app

Primary files:

- `app/src/build.ts`: composition generation
- `app/src/data.ts`: scene content and timeline text
- `app/src/tts.ts`: narration generation
- `app/src/captions.ts`: SRT generation

Keep the pipeline unified under Bun scripts.

### 5. Render and validate

Use this sequence:

```powershell
cd app
bun run build
bun run tts
bun run captions
npx --yes hyperframes@0.6.2 lint
npx --yes hyperframes@0.6.2 validate
npx --yes hyperframes@0.6.2 render --output output/wenxuan-dynamic.mp4
```

When needed, verify output structure with:

```powershell
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of json output/wenxuan-dynamic.mp4
```

Also extract 2-3 keyframes for visual inspection if the user cares about polish or reports visual issues.

## Quality Bar

Before considering the result acceptable, check:

1. Does it still feel like PPT?
2. Are there cheap floating elements or gimmicky motion patterns?
3. Does the Chinese title break awkwardly?
4. Is there a single, consistent accent color?
5. Are subtitles and analysis blocks visually aligned with the system?
6. Does the system scene look structured rather than decorative?

If the answer to any of these is "yes, there is a problem," keep iterating.

## Default Visual Rules

Use these as hard constraints unless the user explicitly wants a different style:

1. one accent color only
2. decoration retreats behind information
3. title hierarchy is stronger than ornament
4. every major block aligns to a visible grid logic
5. motion expresses state changes, not spectacle
6. Chinese typography is handled conservatively and manually

## Output Expectations

Default deliverables:

- MP4 render
- SRT subtitles
- updated source files
- concise summary of what changed
- mention of validation results

If the process itself improved, update:

- `docs/06-production-standard.md`

If the creative or execution standard changed materially, also update the relevant docs under `docs/`.

## When Iterating

When the user says things like:

- "还是有 bug"
- "高级感不够"
- "像 PPT"
- "重新尝试生成"
- "继续优化"

Interpret that as a request to:

1. inspect current frames
2. identify the exact visual failure mode
3. revise the composition, not just the copy
4. rerender and compare

Do not respond with abstract advice only.

## Project-Specific Note

This project has already validated one strong direction:

> Swiss-inspired dynamic system film for AI personal intro and workflow storytelling.

Prefer extending that direction before inventing a different one.
