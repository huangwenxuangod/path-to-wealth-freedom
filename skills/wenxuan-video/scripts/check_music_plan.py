"""Validate declared sound/visual timing; never detect or certify musical taste."""
import argparse,json,math,pathlib,sys

def validate_music(plan,stage='storyboard'):
    def need(ok,msg):
        if not ok: raise ValueError(msg)
    def num(x,label):
        need(isinstance(x,(int,float)) and not isinstance(x,bool) and math.isfinite(x),label+': finite number required')
        return float(x)
    def txt(x,label):need(isinstance(x,str) and bool(x.strip()),label+': text required')
    mode=plan['brief'].get('rhythmMode','none')
    need(mode in ('none','music-driven'),'invalid rhythmMode')
    if mode=='none':return 0
    duration=num(plan['brief']['duration'],'duration');fps=num(plan['brief']['fps'],'fps');need(fps>0,'fps must be positive')
    music=plan['musicMap']
    for k in ('source','version'):txt(music[k],k)
    need(music['basis'] in ('synthetic','estimated','measured'),'invalid music basis')
    need(num(music['duration'],'music duration')>=duration,'music shorter than plan')
    events={};last=-1
    for e in music['events']:
        txt(e['id'],'event id');need(e['id'] not in events,'duplicate music event id')
        t=num(e['time'],'event time');need(0<=t<=duration and t>=last,'event outside timeline or unsorted');last=t
        txt(e['type'],'event type');need(0<=num(e['strength'],'strength')<=1,'strength outside 0..1')
        need(e['status'] in ('candidate','confirmed'),'invalid event status');events[e['id']]=e
    need(bool(events),'music events missing')
    segments={};last_end=0
    for s in music['segments']:
        txt(s['id'],'segment id');need(s['id'] not in segments,'duplicate segment id');txt(s['role'],'segment role')
        a=num(s['start'],'segment start');b=num(s['end'],'segment end')
        need(abs(a-last_end)<1e-6 and a<b<=duration,'segments must cover timeline without gaps');last_end=b;segments[s['id']]=s
    need(abs(last_end-duration)<1e-6,'segments do not cover duration')
    shots={s['id']:s for s in plan['shots']}
    for shot in shots.values():
        c=shot['musicCue'];txt(c['visualHit'],'visualHit');need(c['targetEventId'] in events,'unknown cue event')
        t=events[c['targetEventId']]['time'];need(shot['start']<=t<=shot['end'],'cue outside shot')
        refs=c['segmentIds'];need(bool(refs),'segment references missing')
        for sid in refs:
            need(sid in segments,'unknown cue segment');s=segments[sid]
            need(s['start']<shot['end'] and s['end']>shot['start'],'cue segment does not overlap shot')
    if stage in ('motion','production'):
        sync=plan['sync'];seen=set()
        for c in sync:
            sid=c['shotId'];need(sid in shots,'unknown sync shot');need(sid not in seen,'duplicate sync shot');seen.add(sid)
            shot=shots[sid];eid=c['eventId'];need(eid in events,'unknown sync event')
            need(eid==shot['musicCue']['targetEventId'],'sync differs from shot cue')
            times=[num(c[k],k) for k in ('prepareAt','moveAt','hitAt','settleAt')]
            need(0<=times[0]<=times[1]<=times[2]<=times[3]<=shot['end']-shot['start'],'invalid action phase order or range')
            tolerance=num(c['toleranceFrames'],'toleranceFrames');need(0<=tolerance<=2,'toleranceFrames must be 0..2')
            error=abs((shot['start']+c['hitAt'])-events[eid]['time'])*fps
            need(error<=tolerance+1e-6,'visual hit misses sound event')
        need(seen==set(shots),'sync must cover all shots')
    if stage=='production':
        need(music['basis']=='measured','production requires measured music map')
        for e in events.values():need(e['status']=='confirmed','production requires confirmed music events')
        txt(plan.get('musicTimingEvidence'),'musicTimingEvidence')
        need(plan.get('review',{}).get('audioAnimatic') in ('checked','approved'),'production requires audio animatic review')
    return len(events)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('plan',type=pathlib.Path);p.add_argument('--stage',choices=['storyboard','motion','production'],default='storyboard');a=p.parse_args()
    try:n=validate_music(json.loads(a.plan.read_text(encoding='utf-8-sig')),a.stage)
    except (ValueError,KeyError,TypeError) as e:print('MUSIC_PLAN_FAIL '+str(e),file=sys.stderr);sys.exit(1)
    print(f'MUSIC_PLAN_PASS stage={a.stage} events={n} scope=declared-timing-not-listening')
