import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {PerspectiveCamera, Vector3} from 'three';
import terrain from './terrain.json';
import timeline from '../data/timeline.json';

loadFont({family:'Silk Serif',url:staticFile('fonts/NotoSerifSC.ttf'),weight:'100 900'});
loadFont({family:'Silk Mono',url:staticFile('fonts/mono.woff2'),weight:'400'});

type P = [number,number];
type Screen = {x:number;y:number;z:number};
type Ctx = CanvasRenderingContext2D;
const W=1280,H=720,GOLD='#d6bd7a',IVORY='#f6eed8',BLUE='#94c5e1',GREEN='#8bbd9a',RED='#dd7650';
const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(x:number)=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const fade=(t:number,a:number,b:number,c:number,d:number)=>smooth((t-a)/(b-a))*(1-smooth((t-c)/(d-c)));
const rand=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453123;return v-Math.floor(v);};
export const cityNodes = [
  {name:'长安',p:[108.94,34.34] as P,color:RED},
  {name:'敦煌',p:[94.66,40.14] as P,color:RED},
  {name:'楼兰',p:[89.9,40.5] as P,color:RED},
  {name:'龟兹',p:[82.96,41.7] as P,color:BLUE},
  {name:'喀什',p:[75.99,39.47] as P,color:BLUE},
  {name:'撒马尔罕',p:[66.98,39.65] as P,color:BLUE},
  {name:'梅尔夫',p:[62.17,37.66] as P,color:GREEN},
  {name:'泰西封',p:[44.58,33.1] as P,color:GREEN},
  {name:'帕尔米拉',p:[38.27,34.55] as P,color:GREEN},
  {name:'安条克',p:[36.16,36.2] as P,color:IVORY},
  {name:'地中海',p:[28,37] as P,color:IVORY},
];
const MAIN:P[]=cityNodes.map(n=>n.p);
const NORTH:P[]=[[94.66,40.14],[90,43.8],[85,44.6],[80,43.5],[75.99,39.47]];
const SOUTH:P[]=[[94.66,40.14],[90,37.5],[85,37],[80,37.2],[75.99,39.47]];
const WEST:P[]=[[75.99,39.47],[71,42.5],[66.98,39.65],[62.17,37.66],[56,35.5],[51.4,35.7],[44.58,33.1],[38.27,34.55],[36.16,36.2],[28,37],[20,39],[12.5,41.9]];
const SEA:P[]=[[108.94,34.34],[119,25],[112,15],[103,4],[90,9],[80,8],[72,18],[59,22],[50,12],[40,16],[32,30],[28,37]];
const NORTHWEST:P[]=[[75.99,39.47],[68,47],[57,48],[44,45],[33,43],[25,45],[14,46],[7,48]];
const INDIA:P[]=[[75.99,39.47],[72,32],[77,27],[82,25],[88,23],[96,23],[105,30],[108.94,34.34]];
const AFRICA:P[]=[[28,37],[20,32],[12,31],[1,29],[-7,31]];

function elevation(lon:number,lat:number) {
  const hills=[[85,30,18,2.7,56],[80,42,13,2.5,46],[72,37,4,5,52],[99,30,5,8,35],[47,33,8,3,24],[44,42,8,2.2,33],[10,46,10,2,22],[90,49,12,4,17],[109,35,9,8,12],[36,9,6,10,20]];
  let h=1.8;
  for(const [x,y,sx,sy,a] of hills)h+=a*Math.exp(-(((lon-x)/sx)**2)-((lat-y)/sy)**2);
  return Math.max(0,h+3.6*(Math.sin(lon*.32+lat*.6)+Math.cos(lat*.63-lon*.12))+2.5*Math.sin(lon*.81+lat*.44));
}
const world=(lon:number,lat:number,height:number)=>new Vector3((lon-60)*7,height,-(lat-30)*9);
const camKeys=[
  [8,71,34,900,1.03,0],[14,75,34,900,.99,-.02],
  [17,98,32,320,.78,-.02],[22,97,32,330,.70,.025],
  [27,88,35,260,.65,-.10],[33,87,35,285,.60,-.06],
  [37,87,33,320,.79,.03],[43.5,87,33,350,.85,-.03],
  [49,79,34,350,.75,-.02],[55.5,75,34,320,.72,-.025],
  [61,75,34,330,.76,-.015],[65,74,34,355,.83,-.03],
  [75,72,34,340,.83,-.07],[81,67,32,340,.78,-.04],
  [85,61,32,350,.81,-.015],[89,50,30,650,.93,-.06],
  [94,68,29,880,1.09,-.04],[104,68,29,880,1.06,.035],
  [109,68,31,820,1.01,.05],[112,70,31,810,.97,.09],
];
function cameraAt(t:number){
  let k=0;while(k<camKeys.length-2&&t>camKeys[k+1][0])k++;
  const a=camKeys[k],b=camKeys[k+1],u=smooth((t-a[0])/(b[0]-a[0]));
  const v=a.map((x,i)=>mix(x,b[i],u));
  const target=world(v[1],v[2],8),camera=new PerspectiveCamera(43,W/H,.1,10000);
  camera.position.copy(target).add(new Vector3(Math.sin(v[5])*v[3],Math.sin(v[4])*v[3],Math.cos(v[4])*v[3]));
  camera.lookAt(target);camera.updateMatrixWorld();camera.updateProjectionMatrix();
  return camera;
}
function projector(camera:PerspectiveCamera){
  const v=new Vector3();
  return (p:P,height=elevation(p[0],p[1])+4):Screen=>{
    v.copy(world(p[0],p[1],height*1.35)).project(camera);
    return {x:(v.x+1)*W/2,y:(1-v.y)*H/2,z:v.z};
  };
}
function line(c:Ctx,pts:Screen[],color:string,width=1,alpha=1){
  c.save();c.strokeStyle=color;c.lineWidth=width;c.globalAlpha=alpha;c.beginPath();
  let open=false;
  for(const p of pts){if(p.z>1||!Number.isFinite(p.x)||Math.abs(p.x)>6000||Math.abs(p.y)>6000){open=false;continue;}if(!open){c.moveTo(p.x,p.y);open=true;}else c.lineTo(p.x,p.y);}
  c.stroke();c.restore();
}
function glowDot(c:Ctx,x:number,y:number,r:number,color:string,alpha=1){
  c.save();c.globalAlpha=alpha;const g=c.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,color);g.addColorStop(.15,color+'99');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(x-r*4,y-r*4,r*8,r*8);c.fillStyle=IVORY;c.beginPath();c.arc(x,y,Math.max(1,r*.35),0,Math.PI*2);c.fill();c.restore();
}
function geoPath(points:P[],n=14):P[]{
  const out:P[]=[];
  for(let i=0;i<points.length-1;i++){
    const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
    for(let j=0;j<n;j++){const u=j/n,u2=u*u,u3=u2*u;
      const calc=(k:number)=>.5*((2*p1[k])+(-p0[k]+p2[k])*u+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*u2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*u3);
      out.push([calc(0),calc(1)]);
    }
  }out.push(points[points.length-1]);return out;
}
const ROUTES=[MAIN,NORTH,SOUTH,WEST,SEA,NORTHWEST,INDIA,AFRICA].map(p=>geoPath(p));
function route(c:Ctx,project:(p:P,h?:number)=>Screen,points:P[],t:number,color=GOLD,alpha=1,progress=1,sea=false){
  const end=Math.max(2,Math.floor(points.length*clamp(progress))),pts=points.slice(0,end).map(p=>project(p,sea?3:undefined));
  c.save();c.globalCompositeOperation='lighter';
  line(c,pts,color,5,alpha*.07);c.shadowColor=color;c.shadowBlur=8;line(c,pts,color,1.3,alpha*.86);c.shadowBlur=0;
  for(let k=0;k<3;k++){const index=Math.floor(((t*.08+k*.33)%1)*Math.max(1,pts.length-1));const p=pts[index];if(p&&p.z<1)glowDot(c,p.x,p.y,3.6,color,alpha*.65);}
  c.restore();
}
function marker(c:Ctx,p:Screen,color:string,t:number,flower:boolean,alpha=1){
  if(p.z>1||p.x<-60||p.x>W+60||p.y<-60||p.y>H+60)return;
  c.save();c.globalAlpha=alpha;c.globalCompositeOperation='lighter';glowDot(c,p.x,p.y,5.5,color,.42);
  if(flower){c.fillStyle=color+'13';c.fillRect(p.x-19,p.y-19,38,38);}
  c.strokeStyle=GOLD;c.lineWidth=1.4;c.shadowBlur=10;c.shadowColor=color;
  if(flower){for(let a=0;a<3;a++){c.save();c.translate(p.x,p.y);c.rotate(a*Math.PI/3);c.beginPath();c.ellipse(0,0,4,10.5,0,0,Math.PI*2);c.stroke();c.restore();}}
  else{c.fillStyle=color;c.fillRect(p.x-3,p.y-3,6,6);}
  c.beginPath();c.arc(p.x,p.y,9+Math.sin(t*1.5)*.6,0,Math.PI*2);c.globalAlpha=alpha*.13;c.stroke();c.restore();
}
function label(c:Ctx,text:string,p:Screen,alpha=.45,size=12,offset=15){
  c.save();c.font=`${size}px "Silk Serif"`;c.textAlign='left';c.fillStyle=IVORY;c.globalAlpha=alpha;c.fillText(text,p.x+offset,p.y-11);c.restore();
}

function terrainMesh(c:Ctx,project:(p:P,h?:number)=>Screen,t:number,opacity=1){
  const {nx,ny,vertices}=terrain;
  const projected=vertices.map(v=>project([v[0],v[1]+(v[3]===0?Math.sin(v[0]*.85+v[1]*.15)*.3:0)],v[2]));
  c.save();c.globalAlpha=opacity;
  // One batched path per material keeps 18k vertices efficient and seek-deterministic.
  for(let mode=0;mode<2;mode++){
    c.beginPath();c.strokeStyle=mode===1?'rgba(183,151,102,.32)':'rgba(66,97,126,.26)';c.lineWidth=mode===1?.68:.6;
    const segment=(a:number,b:number)=>{if((vertices[a][3]||vertices[b][3])!==mode)return;const p=projected[a],q=projected[b];if(p.z>1||q.z>1||Math.abs(p.x)>2500||Math.abs(q.x)>2500||Math.abs(p.y)>1500||Math.abs(q.y)>1500)return;c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);};
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const index=j*nx+i;if(i<nx-1)segment(index,index+1);if(j<ny-1&&mode===1)segment(index,index+nx);}
    c.stroke();
  }
  c.globalAlpha=opacity*.32;c.fillStyle='#e2c383';
  for(let i=0;i<vertices.length;i++){const v=vertices[i],p=projected[i];if(v[3]&&i%2===0&&p.z<1&&p.y>40&&p.y<620&&p.x>-5&&p.x<1285)c.fillRect(p.x,p.y,.8,.8);}
  c.globalAlpha=opacity*(t>14&&t<89?.06:.22);
  for(const outline of terrain.outlines){const pts=outline.filter(p=>p[0]>-25&&p[0]<145&&p[1]>-10).map(p=>project([p[0],p[1]],1));line(c,pts,'#b6a177',.7,.55);}
  // Geographic lettering stays attached to the moving mesh.
  if(t>19&&t<86){label(c,t<34?'河 西 走 廊':'塔里木盆地',project([86,39]),.32,16,-28);label(c,'伊朗高原',project([55,31]),.30,16,-20);}
  if(t>85){label(c,'波斯',project([51,35]),.37,16,-8);label(c,'印度洋',project([77,8],1),.38,16,-8);label(c,'地中海',project([26,36],1),.45,16,-8);}
  c.restore();
}

function flatMap(c:Ctx,t:number,alpha:number){
  const project=(p:P):Screen=>({x:100+(p[0]+17)*7.05,y:70+(73-p[1])*6.1,z:0});
  c.save();c.globalAlpha=alpha;
  for(const ring of terrain.outlines){let pts=ring.filter(p=>p[0]>-22&&p[0]<145&&p[1]>-8).map(p=>project([p[0],p[1]]));line(c,pts,'#8e805a',.7,.05);}
  const a=project([25,38]),b=project([109,34]);
  if(t<4.6){const aa={x:565,y:358,z:0},bb={x:1105,y:393,z:0};const end={x:mix(aa.x,bb.x,smooth(t/.55)),y:mix(aa.y,bb.y,smooth(t/.55)),z:0};line(c,[aa,end],GOLD,1.65,.9);glowDot(c,aa.x,aa.y,6,GOLD);marker(c,end,RED,t,true,.8);label(c,'汉 地',bb,.8,20);}
  else{const pts=[...ROUTES[0]].reverse();route(c,project,pts,t,GOLD,.9,smooth((t-4.25)/2));
    for(let i=0;i<cityNodes.length;i++){const n=cityNodes[i];glowDot(c,project(n.p).x,project(n.p).y,4,n.color,.8);}
    label(c,'地中海',a,.6,15,-55);label(c,'汉地',b,.8,17);}
  c.restore();
}

function camel(c:Ctx,x:number,y:number,scale:number,t:number){
  c.save();c.translate(x,y);c.scale(-scale,scale);c.strokeStyle=GOLD;c.lineWidth=1.7;c.lineJoin='round';c.shadowColor=GOLD;c.shadowBlur=6;
  // Two humps, long neck, muzzle, and articulated walking legs.
  const body=new Path2D('M -26 0 Q -29 -5 -25 -9 Q -20 -7 -17 -10 Q -13 -31 -7 -13 Q -1 -31 5 -11 Q 11 -8 15 -10 L 19 -24 Q 19 -30 24 -30 L 30 -27 L 32 -21 L 26 -17 L 24 2 Q 13 8 -15 5 Q -23 4 -26 0 M -25 -6 Q -33 -9 -31 -16');c.stroke(body);
  for(let k=0;k<4;k++){const bx=-19+k*11,step=Math.sin(t*4.4+k*Math.PI*.7)*5;c.beginPath();c.moveTo(bx,5);c.lineTo(bx+step*.4,14);c.lineTo(bx-step,24);c.lineTo(bx-step-5,24);c.stroke();}
  c.restore();
}
function caravan(c:Ctx,project:(p:P,h?:number)=>Screen,t:number,alpha=1){
  const local=clamp((t-25.5)/10),path=ROUTES[0];
  const idx=Math.floor(mix(16,64,local));
  c.save();c.globalAlpha=alpha;
  for(let k=2;k>=0;k--){const p=project(path[Math.max(0,idx-k*2)]);camel(c,p.x,p.y-26,1.18-k*.06,t+k*.2);}
  c.restore();
}
function silkRoll(c:Ctx,x:number,y:number,scale:number,t:number,color=RED){
  c.save();c.translate(x,y);c.rotate(Math.sin(t*.42)*.05);c.scale(scale,scale);
  const g=c.createLinearGradient(-45,0,45,0);g.addColorStop(0,'#907446');g.addColorStop(.2,'#e0bb73');g.addColorStop(.5,color);g.addColorStop(.83,'#e1bc77');g.addColorStop(1,'#947246');
  c.fillStyle=g;c.shadowBlur=16;c.shadowColor='#b78b47';c.fillRect(-45,-18,90,36);
  for(const sx of [-43,43]){const s=c.createLinearGradient(sx-6,-20,sx+6,20);s.addColorStop(0,'#f0d9a1');s.addColorStop(.5,'#c19c5a');s.addColorStop(1,'#806039');c.fillStyle=s;c.beginPath();c.ellipse(sx,0,7,19,0,0,Math.PI*2);c.fill();}
  c.shadowBlur=0;c.strokeStyle='rgba(255,222,162,.8)';c.lineWidth=.8;for(let j=0;j<6;j++){c.beginPath();c.moveTo(-31+j*12,-16);c.lineTo(-31+j*12,16);c.stroke();}
  c.restore();
}
function hangingSilk(c:Ctx,x:number,y:number,t:number,alpha:number){
  c.save();c.globalAlpha=alpha;c.translate(x,y);
  const skew=Math.sin(t*.65)*4;
  const clothHeight=mix(58,4,smooth((t-15.7)/1.5));
  c.fillStyle='#b38c52';c.shadowBlur=20;c.shadowColor='#d3a564';c.fillRect(-52,-52,104,7);
  for(let k=0;k<12;k++){
    const x0=-50+k*8.4,g=c.createLinearGradient(x0,-46,x0+8,-46);g.addColorStop(0,k%2?'#ae7144':'#dbab70');g.addColorStop(.4,'#f0d0a0');g.addColorStop(1,'#98633c');c.fillStyle=g;c.beginPath();c.moveTo(x0,-45);c.lineTo(x0+8.4,-45);c.lineTo(x0+8.4+skew,-45+clothHeight+Math.sin(k*.55)*2);c.lineTo(x0+skew,-45+clothHeight+Math.sin(k*.55)*2);c.closePath();c.fill();
  }c.restore();
}
function desert(c:Ctx,project:(p:P,h?:number)=>Screen,t:number,alpha:number){
  const center=project([86.2,38.6],4);center.y+=76;c.save();c.globalAlpha=alpha;
  for(let k=0;k<2200;k++){
    const a=rand(k+7)*Math.PI*2+t*.18,r=18+Math.sqrt(rand(k+20))*185,swirl=Math.sin(a*3+t*.2)*4;
    const x=center.x+Math.cos(a)*(r+swirl),y=center.y+Math.sin(a)*r*.24;
    c.strokeStyle=`rgba(228,200,131,${.22+rand(k+30)*.5})`;c.lineWidth=.85;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.sin(a)*(2+rand(k+5)*4),y+Math.cos(a)*1.5);c.stroke();
  }c.strokeStyle='rgba(189,154,81,.35)';c.lineWidth=.8;c.beginPath();c.ellipse(center.x,center.y,190,48,.03,0,Math.PI*2);c.stroke();
  c.restore();
}
function hand(c:Ctx,x:number,y:number,side:number,color:string,reach:number,rotate=0){
  c.save();c.translate(x,y);c.rotate(rotate);c.scale(side,1);
  // Forearm fades into darkness; fingers use a restrained transparent line mesh.
  const g=c.createLinearGradient(-490,0,-70,0);g.addColorStop(0,color+'00');g.addColorStop(.6,color+'c0');g.addColorStop(1,color+'d0');c.fillStyle=g;c.fillRect(-490+reach,-29,390,58);c.fillStyle='#b5b3a0';c.fillRect(-100+reach,-32,15,64);
  c.translate(reach,0);c.fillStyle='rgba(190,185,155,.12)';c.strokeStyle='rgba(218,214,191,.43)';c.lineWidth=1;
  const p=new Path2D('M -85 -23 L -49 -25 L -36 -51 Q -27 -57 -23 -48 L -30 -25 L 2 -22 Q 14 -21 10 -16 L -21 -10 L 15 -6 Q 23 -1 14 3 L -20 3 L 9 10 Q 17 17 5 18 L -27 11 L -8 24 Q -4 31 -15 31 L -45 18 L -68 22 L -85 20 Z');c.fill(p);c.stroke(p);
  for(let j=0;j<4;j++){c.beginPath();c.moveTo(-79+j*11,-22);c.lineTo(-64+j*10,19);c.stroke();}c.restore();
}
function handoff(c:Ctx,t:number,vertical=false){
  const start=vertical?78.8:44,end=vertical?86.2:55.6;
  const alpha=fade(t,start,start+.7,end-.7,end);if(alpha<=0)return;
  const u=smooth((t-start)/2),handX=290*u;
  c.save();c.globalAlpha=alpha;
  if(!vertical){hand(c,160,475,1,'#2c668c',handX);hand(c,1120,475,-1,'#8e383c',handX);silkRoll(c,mix(445,805,smooth((t-start-3)/3.5)),472,.82,t,t<start+4?RED:BLUE);}
  else{c.save();c.translate(410,570);c.rotate(-.45);hand(c,-65,-60,1,'#367d70',60*u,-Math.PI/2);hand(c,50,-60,1,'#438d79',60*u,-Math.PI/2);silkRoll(c,-7,-125,.77,t,GREEN);c.restore();}
  if(!vertical){const x=mix(445,805,smooth((t-start-3)/3.5));c.strokeStyle='#d6c79b';c.lineWidth=.8;c.beginPath();c.moveTo(x,488);c.lineTo(x,515);c.stroke();c.fillStyle='#d6cfaf';c.fillRect(x-11,515,22,30);c.fillStyle='#983e35';c.fillRect(x-8,518,16,14);c.fillStyle='#f4dfb5';c.font='11px "Silk Serif"';c.textAlign='center';c.fillText('贵',x,530);c.fillStyle='#c39d59';c.beginPath();c.arc(x,538,4,0,Math.PI*2);c.fill();}
  c.restore();
}
function commodity(c:Ctx,x:number,y:number,kind:number,color:string,r=23){
  c.save();c.translate(x,y);c.strokeStyle=color;c.lineWidth=1.2;c.shadowColor=color;c.shadowBlur=8;
  c.fillStyle=color+'13';c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();c.stroke();c.shadowBlur=0;c.scale(r/23,r/23);
  if(kind===0){silkRoll(c,0,0,.23,0,color);}
  if(kind===1){c.stroke(new Path2D('M -9 10 L 9 10 L 9 0 L 6 -7 L 2 -8 L 5 -11 L -1 -15 L -8 -11 L -6 -6 L -11 -2 L -5 1 L 0 -4 L 0 7 L -9 7 Z'));}
  if(kind===2){c.stroke(new Path2D('M -3 -14 L 3 -14 L 3 -4 Q 14 1 9 11 Q 0 18 -9 11 Q -14 1 -3 -4 Z M -5 -15 L 5 -15 M 0 -8 L 0 9'));}
  if(kind===3){c.beginPath();for(let i=0;i<65;i++){const a=i*.24,r0=i*.2;const x0=Math.cos(a)*r0,y0=Math.sin(a)*r0;if(i===0)c.moveTo(x0,y0);else c.lineTo(x0,y0);}c.stroke();}
  if(kind===4){c.stroke(new Path2D('M -12 8 L 0 -8 L 12 8 Z M -8 8 L 0 -1 L 8 8'));for(let j=0;j<9;j++){c.fillStyle=color;c.fillRect(-6+j*1.5,4-rand(j)*7,1,1);}}
  c.restore();
}
function exchange(c:Ctx,t:number,project:(p:P,h?:number)=>Screen){
  const alpha=fade(t,64.2,65.3,77.8,78.8);if(alpha<=0)return;
  c.save();c.globalAlpha=alpha;
  const cx=660,cy=350,r=210;
  c.fillStyle='rgba(9,7,3,.88)';c.beginPath();c.arc(cx,cy,r-1,0,Math.PI*2);c.fill();
  c.strokeStyle='rgba(205,193,150,.62)';c.lineWidth=.9;
  for(const rr of [r,170,86]){c.beginPath();c.arc(cx,cy,rr,0,Math.PI*2);c.stroke();}
  for(let k=0;k<90;k++){const a=k*Math.PI/45;c.beginPath();c.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.lineTo(cx+Math.cos(a)*(r+3),cy+Math.sin(a)*(r+3));c.stroke();}
  c.strokeStyle=BLUE;c.globalAlpha=alpha*.65;c.beginPath();for(let k=0;k<=100;k++){const a=k*Math.PI/50,rr=85+Math.sin(a*26)*2;const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;if(k===0)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();c.globalAlpha=alpha;
  const colors=[GOLD,'#b3875b','#7bb4ac',IVORY,'#bc7046'];
  for(let k=0;k<5;k++){
    const appear=smooth((t-64.5-k*.6)/.7);if(appear<=0)continue;
    const a=k*Math.PI*.4-.2+(t-64.5)*.105;const x=cx+Math.cos(a)*165,y=cy+Math.sin(a)*165;
    c.save();c.globalAlpha=alpha*appear;commodity(c,x,y,k,colors[k],36);c.restore();
  }
  const u=clamp((t-71)/5),a=-Math.PI+u*Math.PI*1.3;c.strokeStyle=GOLD;c.lineWidth=1.4;c.shadowBlur=8;c.shadowColor=GOLD;c.beginPath();c.arc(cx,cy,r,Math.PI,a+Math.PI*2);c.stroke();glowDot(c,cx+Math.cos(a)*r,cy+Math.sin(a)*r,4,GOLD);
  if(t>73){const p=project([62,37]);commodity(c,mix(cx+r,p.x,u),mix(cy,p.y,u),0,GOLD,23);}
  c.restore();
}
function network(c:Ctx,project:(p:P,h?:number)=>Screen,t:number){
  const layers=[
    {name:'商品',color:GOLD,begin:89.5,paths:[ROUTES[0],ROUTES[1],ROUTES[2],ROUTES[3],ROUTES[4]]},
    {name:'技术',color:IVORY,begin:96.8,paths:[ROUTES[3],ROUTES[5],ROUTES[6]]},
    {name:'艺术',color:'#8ebcb5',begin:100,paths:[ROUTES[1],ROUTES[4],ROUTES[6]]},
    {name:'宗教与思想',color:'#a2bcd2',begin:102.8,paths:[ROUTES[2],ROUTES[5],ROUTES[6],ROUTES[7]]},
  ];
  layers.forEach((layer,i)=>{
    const progress=smooth((t-layer.begin)/3.2);if(progress<=0)return;
    layer.paths.forEach((path,k)=>{route(c,project,path,t+k*1.1,layer.color,.60,progress,k===4&&i===0);for(let n=0;n<path.length;n+=14){if(n/path.length<progress){const p=project(path[n]);glowDot(c,p.x,p.y,i===0?3:2,layer.color,.45);}}});
    c.save();c.font='12px "Silk Serif"';c.fillStyle=layer.color;c.globalAlpha=progress*.75;c.fillText('✦  '+layer.name,1110,39+i*20);c.restore();
  });
  if(t>105.8){for(let k=0;k<35;k++){const p=project(ROUTES[4][Math.floor(rand(k+22)*(ROUTES[4].length-1))]);glowDot(c,p.x,p.y,1.8,RED,smooth((t-105.8)/1.5)*.5);}}
}
function weaving(c:Ctx,t:number){
  const alpha=fade(t,108.3,109.1,111.5,112.5);if(alpha<=0)return;
  c.save();c.globalAlpha=alpha*.8;c.strokeStyle=GOLD;c.shadowColor=GOLD;c.shadowBlur=5;c.lineWidth=.9;
  for(let k=0;k<13;k++){c.beginPath();for(let x=0;x<W;x+=6){const y=275+k*9+55*Math.sin(x*.008+t*.5+k*.16)+18*Math.sin(x*.02-k*.4);if(x===0)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();}c.restore();
}


// Authored cue sequence from measured mixed-track transients, not certified drum beats.
const CONTACT=49.9929, OWNERSHIP=51.5893;
const RELAY_CUES=[56.8972,57.9548,59.8206,61.4070,63.2727];
function cueProgress(t:number){
  const knots=[55.6,...RELAY_CUES], values=[0,.08,.30,.55,.78,1];
  for(let i=1;i<knots.length;i++)if(t<=knots[i])return mix(values[i-1],values[i],smooth((t-knots[i-1])/(knots[i]-knots[i-1])));
  return 1;
}
function pilotTransfer(c:Ctx,t:number,project:(p:P,h?:number)=>Screen){
  if(t<44||t>=64.5)return;
  const meet=smooth((t-(CONTACT-1.4))/1.4),release=smooth((t-CONTACT)/(OWNERSHIP-CONTACT));
  const base=290*smooth((t-44)/1.8),reach=mix(base,440,meet);
  const handsAlpha=smooth((t-44)/.6)*(1-smooth((t-54.8)/1.1));
  c.save();c.globalAlpha=handsAlpha;
  hand(c,160,475,1,'#2c668c',mix(reach,245,release));
  hand(c,1120,475,-1,'#8e383c',mix(reach,300,release));c.restore();
  const px=mix(mix(450,640,meet),820,release);
  // Keep the representative relay inside the current camera view, not offscreen west.
  const path=ROUTES[3].filter(p=>{const q=project(p);return q.x>=90&&q.x<=1190&&q.y>=95&&q.y<=515;}),u=cueProgress(t),index=u*(path.length-1),i=Math.floor(index);
  const a=project(path[Math.min(i,path.length-1)]),b=project(path[Math.min(i+1,path.length-1)]);
  const net={x:mix(a.x,b.x,index-i),y:mix(a.y,b.y,index-i)-13};
  const bridge=smooth((t-55.6)/(RELAY_CUES[0]-55.6));
  const x=t<55.6?px:mix(820,net.x,bridge),y=t<55.6?472:mix(472,net.y,bridge);
  const scale=t<55.6?.82:mix(.82,.36,bridge);
  c.save();c.globalAlpha=smooth((t-44.5)/.6)*(1-smooth((t-64.1)/.4));
  silkRoll(c,x,y,scale,t,t<OWNERSHIP?RED:BLUE);
  if(t>55.6){
    // A trail follows the cargo; each waypoint is reached on a declared audio cue.
    const pts=path.slice(0,Math.max(2,Math.floor(index)+1)).map(p=>project(p));
    line(c,pts,IVORY,2.3,.72*bridge);
  }
  const hits=[CONTACT,OWNERSHIP,...RELAY_CUES];
  for(const hit of hits){const dt=t-hit;if(dt>=0&&dt<.42){const q=dt/.42;c.strokeStyle=GOLD;c.lineWidth=1.5;c.globalAlpha=(1-q)*.65;c.beginPath();c.ellipse(x,y,20+q*46,8+q*18,0,0,Math.PI*2);c.stroke();}}
  c.restore();
}

function draw(c:Ctx,t:number,grain:boolean){
  c.clearRect(0,0,W,H);c.fillStyle='#090703';c.fillRect(0,0,W,H);
  const camera=cameraAt(t),project=projector(camera);
  if(t<12)flatMap(c,t,1-smooth((t-8.1)/3.7));
  const terrainAlpha=smooth((t-7.8)/3.5)*(1-smooth((t-110.8)/2.2));
  if(terrainAlpha>.001){
    c.save();c.globalAlpha=terrainAlpha;terrainMesh(c,project,t);
    if(t<34.8){route(c,project,ROUTES[0],t,GOLD,.88,t<14?1:clamp((t-20)/12,.10,1));}
    if(t>=34.8&&t<89.5){route(c,project,ROUTES[0],t,GOLD,t>55? .25:.55);route(c,project,ROUTES[1],t,GOLD,.85,smooth((t-36)/3.4));route(c,project,ROUTES[2],t,BLUE,.80,smooth((t-38)/3));route(c,project,ROUTES[3],t,t>55?BLUE:GOLD,.85,smooth((t-52)/6));}
    if(t>89)network(c,project,t);
    for(let i=0;i<cityNodes.length;i++){
      const n=cityNodes[i],p=project(n.p),active=t<89;
      if(active){marker(c,p,n.color,t,t>14, .75);if((t<23&&i<3)||(t>53&&i>4))label(c,n.name,p,.43,13);}
    }
    if(t>25.4&&t<35.8)caravan(c,project,t,fade(t,25.4,26.2,34.9,35.8));
    if(t>35.2&&t<43.1)desert(c,project,t,fade(t,35.2,36.2,42.2,43.1));
    if(t>14.2&&t<19.3){const p=project([108.94,34.34]);hangingSilk(c,p.x+100,p.y-72,t,fade(t,14.2,15,18.4,19.3));}
    if(t>14&&t<94){c.save();c.fillStyle='#d5c598';c.globalAlpha=.27;for(let k=0;k<1400;k++){const lon=37+rand(k*3)*72,lat=31+rand(k*3+1)*15,p=project([lon,lat]);if(p.z<1&&p.x>0&&p.x<W&&p.y>0&&p.y<H)c.fillRect(p.x,p.y,.8+rand(k*3+2)*.8,.8);}c.restore();}
    if(false&&t>55.5&&t<64.4){const path=ROUTES[3],idx=Math.floor(clamp((t-55.5)/9)*45);const p=project(path[Math.min(idx,path.length-1)]);camel(c,p.x,p.y-18,.75,t);}
    c.restore();
  }
  pilotTransfer(c,t,project);
  if(t>=64.2&&t<78.8)exchange(c,t,project);
  if(t>=78.8&&t<86.2)handoff(c,t,true);
  weaving(c,t);
  if(t<112.4){
    c.save();c.globalAlpha=.42;c.fillStyle='#b8ae82';c.font='15px "Silk Serif"';c.fillText('路 线 示 意',40,52);c.globalAlpha=.30;c.font='9px "Silk Mono"';c.fillText('c. 1st–2nd CENTURY CE · SCHEMATIC',40,69);
    c.font='7px "Silk Mono"';c.fillText('76° E',34,174);c.fillText('34° N',34,361);c.fillText('0      500      1000 km',1000,32);c.restore();
  }
  if(t>=112.3){
    const u=smooth((t-112.3)/.9),out=1-smooth((t-115.4)/.7);
    c.save();c.globalAlpha=u*out;c.fillStyle='#655330';c.shadowColor='#d6b976';c.shadowBlur=4;c.font='900 400px "Silk Serif"';c.textAlign='center';c.textBaseline='middle';c.fillText('丝',640,317);c.strokeStyle='#92784b';c.lineWidth=.65;c.strokeText('丝',640,317);c.shadowBlur=0;c.globalAlpha=u*out*.12;c.fillStyle='#000';for(let y=120;y<495;y+=4)c.fillRect(430,y,420,1);c.restore();
  }
  const vignette=c.createRadialGradient(640,330,120,640,360,760);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(.6,'rgba(0,0,0,.05)');vignette.addColorStop(1,'rgba(0,0,0,.65)');c.fillStyle=vignette;c.fillRect(0,0,W,H);
  if(grain){c.save();c.globalAlpha=.023;c.fillStyle='#dac387';for(let k=0;k<2200;k++){const x=rand(k*2)*W,y=rand(k*2+1)*H;c.fillRect(x,y,.65,.65);}c.restore();}
}

const Caption:React.FC<{text:string;start:number;end:number}>=({text,start,end})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const duration=end-start,opacity=fade(t,0,.16,duration-.24,duration);
  const reveal=smooth(t/.7);
  return <div style={{position:'absolute',left:35,right:35,top:584,textAlign:'center',fontFamily:'Silk Serif',fontWeight:600,fontSize:38,letterSpacing:1.5,color:'#f3edda',textShadow:'0 0 8px rgba(238,213,146,.12)',opacity}}><span style={{position:'relative',display:'inline-block'}}><span style={{clipPath:`inset(0 ${(1-reveal)*100}% 0 0)`,display:'inline-block'}}>{text}</span>{reveal<1&&<span style={{position:'absolute',top:27,left:`${reveal*100}%`,width:90,height:1,background:'linear-gradient(90deg,#d6bd7a,transparent)',boxShadow:'0 0 6px #d6bd7a'}}/>}</span></div>;
};
export const SilkRoad:React.FC<{audio:boolean;subtitles:boolean;grain:boolean;startAt?:number}>=({audio,subtitles,grain,startAt=0})=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),ref=useRef<HTMLCanvasElement>(null);
  useLayoutEffect(()=>{const c=ref.current?.getContext('2d');if(c)draw(c,frame/fps+startAt,grain);},[frame,fps,grain,startAt]);
  return <AbsoluteFill style={{background:'#090703'}}>
    <canvas ref={ref} width={W} height={H} style={{position:'absolute',width:'100%',height:'100%'}}/>
    {audio&&<Audio src={staticFile('reference-audio-refined.m4a')} startFrom={Math.round(startAt*fps)}/>}
    {subtitles&&timeline.captions.map(c=><Sequence key={c.start} name={c.text} from={Math.round((c.start-startAt)*fps)} durationInFrames={Math.round((c.end-c.start)*fps)}><Caption {...c}/></Sequence>)}
  </AbsoluteFill>;
};
