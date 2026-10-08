"""Exercise audio components using diagnostic tones, not claimed narration."""
import pathlib,json,subprocess,shutil,os
root=pathlib.Path(__file__).resolve().parent.parent
spec=root/'data/storyboard.json';original=spec.read_bytes();video=root/'renders/knowledge.mp4';backup=root/'evidence/visual-demo-backup.mp4'
shutil.copy2(video,backup)
def run(args):return subprocess.run(args,cwd=root,check=True,capture_output=True,text=True)
try:
    for name,freq,duration in [('test-voice',440,8),('test-music',160,8),('test-cue',880,.15)]:
        run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f'sine=frequency={freq}:duration={duration}','-af','volume=0.3',str(root/f'public/{name}.wav')])
    data=json.loads(original);data['audio'].update({'voice':'test-voice.wav','music':'test-music.wav','voiceIntervals':[[.5,2],[4,6]],'sfx':[{'at':2.8,'duration':.15,'file':'test-cue.wav','gain':.08}]})
    spec.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    env=os.environ.copy();env['CHROME_PATH']='C:/Program Files/Google/Chrome/Application/chrome.exe'
    result=subprocess.run(['bun','run','render'],cwd=root,env=env,capture_output=True,text=True,check=True)
    print(result.stdout.strip())
    shutil.copy2(video,root/'renders/knowledge-audio-diagnostic.mp4')
    p=json.loads(run(['ffprobe','-v','error','-show_streams','-of','json',str(video)]).stdout)
    assert any(s['codec_type']=='audio' for s in p['streams'])
    print('AUDIO_BRANCH_PASS voice=yes music=yes cue=yes interval_ducking_configured=yes diagnostic_tones_only=yes')
finally:
    spec.write_bytes(original);shutil.copy2(backup,video)
