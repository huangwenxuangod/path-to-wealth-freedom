from pathlib import Path
import math, random, wave, array
P=Path('.')
def save(name,body):
 P.joinpath(name+'.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">'+body+'</svg>')
def grain(color,opacity,seed):
 r=random.Random(seed)
 return '<g fill="'+color+'" opacity="'+str(opacity)+'">'+''.join(f'<circle cx="{r.uniform(0,1920):.1f}" cy="{r.uniform(0,1080):.1f}" r="{r.uniform(.25,1.15):.2f}"/>' for _ in range(5500))+'</g>'
# An etched sun: closely spaced, elliptical orbital lines surrounding a black lens.
a='<rect width="1920" height="1080" fill="#111b20"/><defs><radialGradient id="halo"><stop stop-color="#dfbb79" stop-opacity=".72"/><stop offset=".56" stop-color="#b88a54" stop-opacity=".16"/><stop offset="1" stop-color="#111b20" stop-opacity="0"/></radialGradient></defs><circle cx="1215" cy="523" r="625" fill="url(#halo)"/>'
for i in range(115):
 r=185+i*3.2
 a+=f'<ellipse cx="1215" cy="523" rx="{r:.1f}" ry="{r*.91:.1f}" fill="none" stroke="#d8b77d" stroke-opacity="{.08+.52*(1-i/115)**2:.3f}" stroke-width="{.65 if i%8 else 1.2}" transform="rotate(-23 1215 523)"/>'
a+='<circle cx="1215" cy="523" r="205" fill="#0c151a"/><circle cx="1212" cy="518" r="208" fill="none" stroke="#efd7a5" stroke-width="1.3"/><path d="M 1095 687 A 205 205 0 0 0 1397 430" fill="none" stroke="#ffe3b0" stroke-width="3"/>'
a+=grain('#ead2aa',.18,1)
save('eclipse',a)
# Topographic dunes: many continuous contours with varied curvature and density.
a='<rect width="1920" height="1080" fill="#efe5cf"/><circle cx="1420" cy="240" r="71" fill="#a54232"/>'
for i in range(132):
 pts=[]
 for x in range(-80,2001,16):
  y=405+i*6.5-210*math.exp(-((x-650-i*2)/460)**2)+105*math.sin(x/600+i*.011)+50*math.sin(x/1900*math.pi+i*.018)
  pts.append(f'{x},{y:.2f}')
 a+='<polyline points="'+' '.join(pts)+f'" fill="none" stroke="{ "#6e5237" if i%4==0 else "#b88a54"}" stroke-width="{1 if i%4 else 1.4}" opacity=".70"/>'
a+=grain('#553b28',.11,2)
save('dunes',a)
# Midnight sea: a red moon and its broken reflection in long engraved wavelets.
a='<rect width="1920" height="1080" fill="#111b20"/><circle cx="1280" cy="300" r="145" fill="#a54232"/><path d="M0 495H1920" stroke="#709596" stroke-width="1" opacity=".4"/>'
for i in range(112):
 y=495+(i/111)**1.55*630
 pts=[]
 for x in range(-80,2001,12):
  yy=y+(3+i*.11)*math.sin(x/95+i*.44)+3*math.sin(x/37-i*.22)
  pts.append(f'{x},{yy:.2f}')
 a+='<polyline points="'+' '.join(pts)+f'" fill="none" stroke="#759899" stroke-opacity="{.16+.35*i/112:.3f}" stroke-width=".9"/>'
 width=(160*(1-i/150)+50*math.sin(i*1.63))
 x=1280+30*math.sin(i*.65)
 a+=f'<path d="M{x-width:.1f} {y:.1f} q {width:.1f} {6*math.sin(i):.1f} {width*2:.1f} 0" fill="none" stroke="#ce7955" stroke-opacity="{.48*(1-i/130):.3f}" stroke-width="{1+i*.014:.2f}"/>'
a+=grain('#b2c5bc',.13,3)
save('sea',a)
# Enso: handmade copper contour, imperfect by construction, not a logo.
a='<rect width="1920" height="1080" fill="#efe5cf"/>'
for i in range(22):
 pts=[]
 for j in range(360):
  t=(j/359*1.86+.08)*math.pi
  r=236+i*1.45+3*math.sin(5*t)+1.5*math.sin(13*t+i*.2)
  pts.append(f'{1220+r*math.cos(t):.2f},{515+r*math.sin(t):.2f}')
 a+='<polyline points="'+' '.join(pts)+f'" fill="none" stroke="#a54232" stroke-width="1.8" opacity="{.25+.4*(1-i/22):.2f}"/>'
a+=grain('#553b28',.10,4)
save('enso',a)
# Original stereo ambient score; no reused music. D minor/add9, bowed air + struck partials.
sr=32000; dur=32; out=array.array('h'); rng=random.Random(82); air=0.
notes=[(1.2,293.665),(4.4,440),(8.5,349.228),(12,523.251),(16.5,261.626),(20,391.995),(24.5,293.665),(27,440)]
for n in range(sr*dur):
 t=n/sr; fade=min(1,t/2.5,max(0,(32-t)/4))
 air=.985*air+.015*rng.uniform(-1,1)
 pad=sum(math.sin(2*math.pi*f*t+.15*math.sin(t*.23)) for f in [73.416,110,146.832,220.12])/4
 l=.11*pad*(.8+.2*math.sin(t*.4))+.13*air; r=.11*pad*(.8+.2*math.cos(t*.31))+.13*air
 for start,f in notes:
  d=t-start
  if 0<d<9:
   env=(1-math.exp(-d*12))*math.exp(-d*.6)
   v=env*(math.sin(2*math.pi*f*d)+.22*math.sin(2*math.pi*f*2.003*d)+.09*math.sin(2*math.pi*f*3.99*d))*.14
   pan=.5+.32*math.sin(start)
   l+=v*pan; r+=v*(1-pan)
 out.extend((int(max(-1,min(1,l*fade))*30000),int(max(-1,min(1,r*fade))*30000)))
with wave.open('silence.wav','wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(out.tobytes())
print('ART_ASSETS_OK: four original engravings, original stereo score 32s')
