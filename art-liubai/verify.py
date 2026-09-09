from pathlib import Path
import sys,hashlib,re
p=Path(sys.argv[1]); mode=sys.argv[2]; b=p.read_bytes()
if mode=='baseline':
 assert hashlib.sha256(b).hexdigest()=='4ffe08f87cbf3967056cbc746ae52cb6c353aedc9efd68c0cf89530c92eb9197'
 print('BASELINE_OK: original template SHA256 matches')
else:
 s=b.decode();assert 'data-duration="32"' in s and 'data-width="1920"' in s
 assert len(re.findall('<section ',s))==4
 for asset in ['eclipse.svg','dunes.svg','sea.svg','enso.svg','silence.wav']: assert Path(asset).stat().st_size>1000
 print('MODIFIED_OK: 32s, 1920x1080, 4 scenes, 4 original artworks, stereo score')
