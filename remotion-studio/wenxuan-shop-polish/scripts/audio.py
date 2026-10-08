import wave,math,struct,random,json,pathlib
root=pathlib.Path(r'D:\path-to-wealth-freedom\remotion-studio\wenxuan-shop-polish');sr=22050;dur=40;bpm=116;beat=60/bpm;data=[0.0]*(sr*dur);rng=random.Random(15);events=[]
for n in range(int(dur/beat)):
 t=n*beat
 if 14.3<t<15.3:continue
 events.append({'time':round(t,6),'frame':round(t*30),'type':'kick' if n%2==0 else 'rim','status':'synthesized'})
 for j in range(int(.14*sr)):
  x=j/sr;i=round(t*sr)+j
  if i>=len(data):break
  if n%2==0:v=.19*math.exp(-x*32)*math.sin(2*math.pi*(64*x+3*(1-math.exp(-x*25))))
  else:v=.06*math.exp(-x*68)*(rng.random()*2-1)
  data[i]+=v
 for j in range(int(.025*sr)):
  i=round((t+beat/2)*sr)+j
  if i<len(data):data[i]+=.012*math.exp(-j/sr*140)*(rng.random()*2-1)
# warm quiet two-note pulse, no dense melody
for i in range(len(data)):
 t=i/sr;fade=min(1,t/1.5,(dur-t)/2);note=130.81 if int(t/(beat*8))%2==0 else 146.83
 data[i]=(data[i]+.016*math.sin(2*math.pi*note*t)+.008*math.sin(2*math.pi*note*1.5*t))*max(0,fade)
with wave.open(str(root/'public'/'rhythm.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,x))*32767))for x in data))
(root/'evidence'/'music-events.json').write_text(json.dumps({'source':'original algorithmic rhythm, seed=15','bpm':bpm,'duration':dur,'events':events,'note':'generated timing, not reference-audio analysis'},indent=2),encoding='utf8')
print('AUDIO_BUILT original rhythm 116bpm 40s')
