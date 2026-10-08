import pathlib,json,hashlib,zipfile
root=pathlib.Path(__file__).resolve().parent.parent
skill=pathlib.Path(r'C:\Users\37453\.codex\skills\vibe-knowledge-video')
out=root/'deliverables';out.mkdir(exist_ok=True)
zip_path=out/'vibe-knowledge-video.zip'
files=[p for p in skill.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc']
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for p in files:z.write(p,pathlib.Path(skill.name)/p.relative_to(skill))
with zipfile.ZipFile(zip_path) as z:
    assert z.testzip() is None
    for p in files:assert z.read(str(pathlib.Path(skill.name)/p.relative_to(skill)).replace('\\','/'))==p.read_bytes()
result=f'PACKAGE_PASS files={len(files)} all_zip_entries_match_source=yes sha256={hashlib.sha256(zip_path.read_bytes()).hexdigest()}'
(root/'evidence/skill-package-output.txt').write_text(result+'\n',encoding='utf-8');print(result)
record=json.loads((root/'evidence/audio-refinement.json').read_text(encoding='utf-8'))
audio=json.loads((root/'evidence/audio-qc.json').read_text(encoding='utf-8'))
baseline=record['baselineSha256'];modified=record['modifiedSha256']
verification=f'''VERIFICATION: follow-up audio refinement + reusable knowledge-video skill

CHANGED_FIELD: rendered audio stream (mixed source -> light bass shelf, bell EQ, peak compression/limiting); video stream unchanged.
SOURCE_FIELD: src/SilkRoad.tsx Audio.src reference-audio.m4a -> reference-audio-refined.m4a.
MODIFIED_FILE: {root/'renders/silk-road-refined.mp4'}
DIFF_FILE: {root/'DIFF_FILE.md'}
VERIFICATION: {root/'VERIFICATION.txt'}
ROLLBACK: {root/'ROLLBACK.sh'}

Original supplied file preserved SHA256: 03da0d75e85f96701b66681e207bd67279f30f7d625fd3c79c9c8b0f8d7b8ed3
Baseline pre-audio render SHA256: {baseline}
Modified render SHA256: {modified}
Video elementary stream before/after: {record['videoStreamHash']} (identical)
Original video image is not used as an output visual asset.

Working directory for commands: {root}
BASELINE command: py scripts/probe.py BASELINE evidence/PRE_AUDIO_FIX.mp4
BASELINE input: preserved copy of the completed pre-audio-refinement render
BASELINE literal stdout: BASELINE_PASS 1280x720 30fps 116.160s audio=yes sha256={baseline}
BASELINE exit status: 0

MODIFIED command: py scripts/probe.py MODIFIED renders/silk-road-refined.mp4
MODIFIED input: independently rendered video with lightly processed source audio
MODIFIED literal stdout: MODIFIED_PASS 1280x720 30fps 116.105s audio=yes sha256={modified}
MODIFIED exit status: 0

ROLLBACK preparation: Copy-Item -LiteralPath 'renders/silk-road-refined.mp4' -Destination 'evidence/rollback-test.mp4'
ROLLBACK command: & 'C:\\Program Files\\Git\\bin\\bash.exe' -lc 'chmod +x ROLLBACK.sh && ./ROLLBACK.sh evidence/rollback-test.mp4'
ROLLBACK input: separate copy evidence/rollback-test.mp4 (not MODIFIED_FILE)
ROLLBACK literal stdout: ROLLBACK_PASS sha256={baseline} restored=pre-audio-fix behavior=1280x720,30fps,116.160s,audio=yes
ROLLBACK exit status: 0
ROLLBACK verification command: py scripts/probe.py ROLLBACK evidence/rollback-test.mp4
ROLLBACK verification literal stdout: ROLLBACK_PASS 1280x720 30fps 116.160s audio=yes sha256={baseline}
ROLLBACK verification exit status: 0
Restored behavior/status: rollback-test.mp4 is byte-identical to the pre-audio-fix render and has its original audio and valid output specs. Executable rolls back only the rendered artifact; source/installed skill is not reverted.
Final status: modified master remains changed; original reference and baseline remain unchanged.

Audio reproduction command: py scripts/refine_audio.py
Literal stdout: REFINE_PASS video_stream_identical=yes added_sfx=0 mixed_track_eq_and_compression=yes
Literal stdout: MODIFIED_SHA256 {modified}
Exit status: 0
Filter: {record['filter']}
Audio QC command: py scripts/verify_audio_refinement.py
Literal stdout: AUDIO_QC_PASS envelope_correlation={audio['envelopeCorrelation20ms']:.6f} waveform_lag_ms={audio['waveformBestLagMs']:.3f} high_band_delta_db={audio['highBandDeltaDb']:.3f} separated_stems=no
Exit status: 0
20ms mono envelope and 5-7.9kHz spectral measurements are continuity/tonal diagnostics, not perceptual quality scores.
Final complete stereo track FFmpeg ebur128: integrated -16.2 LUFS, true peak -2.5 dB (final-loudness.txt).
Container duration 116.105s; exact video duration 116.100s/3483 frames; AAC duration 116.104966s/start0.

Typecheck command: bun run typecheck ; output empty (script banner only); exit0.
Static check command: bun run check
Literal stdout: CHECK_PASS 63 cases; 13 scenes, 22 captions, 18281 mesh vertices; no source video frames; deterministic frame clock
Exit status: 0
Decode verify command: bun run verify
Literal stdout: VERIFY_PASS 1280x720 30fps 116.105s audio=yes decode_errors=0 keyframes=15 sha256={modified}
Exit status: 0
Keyframes: matched reference/authored stills at 1,6,12,17,27,38,49,60,68,75,82,90,100,110,114s. Final encoded frames reopened at 68s and 100s.
This is procedural visual reconstruction, not pixel-identical fidelity. Remaining differences include terrain relief, route/camera geometry and illustrative silhouettes.

SKILL installed: {skill}
SKILL validation: py C:\\Users\\37453\\.codex\\skills\\.system\\skill-creator\\scripts\\quick_validate.py {skill}
Literal stdout: Skill is valid!
Exit status: 0
Reference helper test command: py {skill/'scripts/analyze_reference.py'} "C:\\Users\\37453\\Downloads\\下载 (20).mp4" --out evidence/skill-reference-test --interval 20
Literal stdout: ANALYZE_PASS samples=7 duration=116.100s audio=True source_unchanged=yes
Exit status: 0
Independent starter project: {root.parent/'vibe-knowledge-smoke'}
Scaffold helper generated this empty-directory project; source typecheck passed, no dependency reinstall needed because compatible parent dependencies were reused.
Starter check literal stdout: STARTER_CHECK_PASS 23 checks; causal_state_changes=yes frame_clock=yes ; exit0.
Starter stills literal stdout: STILLS_PASS 5 frames; repeat_frame_hash_identical=yes ; exit0.
Starter full render literal stdout: RENDER_PASS 1280x720 30fps 240frames ; exit0.
Starter media literal stdout: MEDIA_PASS 1280x720 fps=30 duration=8.000s audio=False decode_errors=0 sha256=67af8c410d6d32a99a4b24bf8c9d7f88c6d9fc5fa411d8ad033275e336751bff ; exit0.
Audio branch test: separate diagnostic tones, not narration. Render and full decode passed.
Audio branch literal stdout: AUDIO_BRANCH_PASS voice=yes music=yes cue=yes interval_ducking_configured=yes diagnostic_tones_only=yes ; exit0.
{(root.parent/'vibe-knowledge-smoke/evidence/ducking-output.txt').read_text(encoding='utf-8').strip()} ; exit0.
Skill package: {zip_path}
{result} ; exit0.
Analysis document: {root/'IMPLEMENTATION_ANALYSIS.md'}
Preview composition: http://localhost:3012/SilkRoadRebuild (existing studio uses refined Audio.src)
Starter preview: http://localhost:3013/KnowledgeVideo
'''
(root/'VERIFICATION.txt').write_text(verification,encoding='utf-8')
print('VERIFICATION_WRITTEN '+str(root/'VERIFICATION.txt'))
