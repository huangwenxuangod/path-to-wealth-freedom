import json, math, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
geo = json.loads((root/'data/land.geojson').read_text(encoding='utf-8'))
polys=[]
for f in geo['features']:
    g=f['geometry']; rings=g['coordinates'] if g['type']=='Polygon' else [p for p in g['coordinates']]
    if g['type']=='Polygon': rings=[rings]
    for p in rings:
        ring=p[0]
        xs=[v[0] for v in ring]; ys=[v[1] for v in ring]
        polys.append((min(xs),max(xs),min(ys),max(ys),ring))
def inside(x,y):
    for xmin,xmax,ymin,ymax,ring in polys:
        if not(xmin<=x<=xmax and ymin<=y<=ymax): continue
        ok=False
        j=len(ring)-1
        for i in range(len(ring)):
            xi,yi=ring[i]; xj,yj=ring[j]
            if (yi>y)!=(yj>y) and x < (xj-xi)*(y-yi)/(yj-yi)+xi: ok=not ok
            j=i
        if ok:return 1
    return 0
def h(x,y):
    mountains=[(85,30,18,2.7,56),(80,42,13,2.5,46),(72,37,4,5,52),(99,30,5,8,35),(47,33,8,3,24),(44,42,8,2.2,33),(10,46,10,2,22),(90,49,12,4,17),(109,35,9,8,12),(36,9,6,10,20)]
    value=1.8
    for cx,cy,sx,sy,a in mountains:value+=a*math.exp(-((x-cx)/sx)**2-((y-cy)/sy)**2)
    value+=3.6*(math.sin(x*.32+y*.6)+math.cos(y*.63-x*.12))+2.5*math.sin(x*.81+y*.44)
    return max(0,value)
NX,NY=181,101
vertices=[]
for j in range(NY):
    lat=76-j*86/(NY-1)
    for i in range(NX):
        lon=-25+i*170/(NX-1); land=inside(lon,lat)
        vertices.append([round(lon,3),round(lat,3),round(h(lon,lat) if land else 0,3),land])
out={'nx':NX,'ny':NY,'vertices':vertices,'outlines':[p[-1] for p in polys if p[1]>-25 and p[0]<145 and p[3]>-10]}
(root/'src/terrain.json').write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
print(f'TERRAIN_PASS {NX}x{NY}; {len(vertices)} vertices; {len(out["outlines"])} outlines')
