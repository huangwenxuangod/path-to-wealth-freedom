"""Structural preflight, not an artistic or scientific correctness oracle."""
import argparse,json,pathlib,math,sys

def validate(plan,stage):
    def need(ok,message):
        if not ok:raise ValueError(message)
    def number(value,label):
        need(isinstance(value,(int,float)) and not isinstance(value,bool) and math.isfinite(value),f'{label}: finite number required')
        return float(value)
    def text(value,label):need(isinstance(value,str) and bool(value.strip()),f'{label}: nonempty text required')
    brief=plan['brief'];duration=number(brief['duration'],'duration');need(duration>0,'duration must be positive')
    for key in ('width','height','fps'):need(number(brief[key],key)>0,f'{key}: positive value required')
    need(int(brief['width'])==brief['width'] and int(brief['height'])==brief['height'],'dimensions must be integer')
    for key in ('question','answer','throughline','audience'):text(brief[key],key)
    need(brief.get('timingBasis') in ('estimated','measured'),'timingBasis must be estimated or measured')
    narrative=plan['narrative'];text(narrative['openingPromise'],'openingPromise');text(narrative['closingPayoff'],'closingPayoff')
    beats=narrative['beats'];need(bool(beats),'narrative beats missing');ids=set()
    for b in beats:
        text(b['id'],'beat id');need(b['id'] not in ids,'duplicate beat id');ids.add(b['id']);text(b['newInformation'],'newInformation')
    shots=plan['shots'];need(bool(shots),'shots missing');previous=0.;shot_ids=set();lookup={}
    for shot in shots:
        sid=shot['id'];text(sid,'shot id');need(sid not in shot_ids,'duplicate shot id');shot_ids.add(sid);lookup[sid]=shot
        need(shot['beatId'] in ids,f'{sid}: unknown beatId')
        start=number(shot['start'],'shot start');end=number(shot['end'],'shot end')
        need(abs(start-previous)<1e-6,f'{sid}: gap, overlap or unsorted timeline');need(end>start and end<=duration+1e-6,f'{sid}: invalid range');previous=end
        for key in ('purpose','startState','endState','composition','voice','caption'):text(shot[key],f'{sid}.{key}')
        camera=shot['camera'];need(camera['kind'] in ('hold','push','pull','pan','track','overhead-reframe','cut'),f'{sid}: unknown camera kind')
        for key in ('motivation','startView','endView'):text(camera[key],f'{sid}.camera.{key}')
        a=number(camera['startAt'],'camera startAt');b=number(camera['endAt'],'camera endAt')
        need(0<=a<=b<=end-start,f'{sid}: camera outside local shot range')
        if camera['kind'] not in ('hold','cut'):need(b>a,f'{sid}: moving camera must have positive duration')
        text(shot['transition']['kind'],f'{sid}.transition.kind');text(shot['transition']['carry'],f'{sid}.transition.carry')
    need(abs(previous-duration)<1e-6,'shots do not cover full duration');need(ids=={s['beatId'] for s in shots},'narrative beat has no shot')
    if stage in ('motion','production'):
        review=plan.get('review',{});need(review.get('storyboard') in ('checked','approved'),'storyboard must be reviewed before motion design')
        motions=plan.get('motion',[]);need({m['shotId'] for m in motions}==shot_ids,'motion plan must cover all shots');need(len(motions)==len(shot_ids),'duplicate motion section')
        for m in motions:
            shot=lookup[m['shotId']];local=shot['end']-shot['start'];events=m['events'];need(bool(events),'motion events missing');last=-1
            for event in events:
                a=number(event['start'],'event start');b=number(event['end'],'event end');need(0<=a<b<=local,'motion outside local shot range');need(a>=last,'motion event list unsorted');last=a
                need(event['domain'] in ('object','camera','overlay','sfx'),'unknown motion domain')
                for key in ('target','property','purpose','easing'):text(event[key],f'motion.{key}')
                need('from' in event and 'to' in event,'motion endpoint states missing')
            cameras=[e for e in events if e['domain']=='camera'];camera=shot['camera']
            if camera['kind']=='hold':need(not cameras,'fixed storyboard camera conflicts with motion camera events')
            elif camera['kind']!='cut':
                need(bool(cameras),'moving storyboard camera has no motion event')
                need(abs(min(e['start'] for e in cameras)-camera['startAt'])<1e-6 and abs(max(e['end'] for e in cameras)-camera['endAt'])<1e-6,'motion camera timing differs from storyboard')
    if stage=='production':
        for key in ('motion','animatic'):need(plan.get('review',{}).get(key) in ('checked','approved'),f'{key} must be reviewed before production')
        need(brief['timingBasis']=='measured','production requires measured narration/timing, not draft estimate')
        need(bool(plan.get('timingEvidence')),'production requires timing evidence reference')
    if brief.get('rhythmMode') is not None:
        from check_music_plan import validate_music
        validate_music(plan,stage)
    return len(shots),duration

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('plan',type=pathlib.Path);p.add_argument('--stage',choices=['storyboard','motion','production'],default='storyboard');a=p.parse_args()
    try:
        plan=json.loads(a.plan.read_text(encoding='utf-8-sig'));count,duration=validate(plan,a.stage)
    except (ValueError,KeyError,TypeError) as e:
        print('DIRECTOR_PLAN_FAIL '+str(e),file=sys.stderr);sys.exit(1)
    print(f'DIRECTOR_PLAN_PASS stage={a.stage} shots={count} duration={duration:.3f}s narration_timing={plan["brief"]["timingBasis"]}')
