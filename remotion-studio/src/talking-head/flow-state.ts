export const smooth=(v:number)=>{const p=Math.max(0,Math.min(1,v));return p*p*(3-2*p);};
export const phase=(t:number,start:number,duration=.5)=>smooth((t-start)/duration);
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export type FlowNode={x:number;y:number;scale:number;opacity:number};
const blend=(a:FlowNode,b:FlowNode,p:number):FlowNode=>({x:lerp(a.x,b.x,p),y:lerp(a.y,b.y,p),scale:lerp(a.scale,b.scale,p),opacity:lerp(a.opacity,b.opacity,p)});
export function flowState(t:number,studentStart:number,teacherStart:number,educationStart:number){
 const boundary=phase(t,4.42,.42),protect=phase(t,7.05,.48),education=phase(t,educationStart,.48);
 const unfold=phase(t,educationStart+2.1,.55),studentFocus=phase(t,studentStart,.5),teacherFocus=phase(t,teacherStart,.5),summary=phase(t,30.55,.55);
 let core=blend({x:110,y:300,scale:1,opacity:phase(t,1.67,.3)},{x:440,y:445,scale:1,opacity:1},boundary);
 core=blend(core,{x:220,y:395,scale:1,opacity:1},protect);
 core=blend(core,{x:290,y:520,scale:1,opacity:1},education);
 core=blend(core,{x:290,y:340,scale:1,opacity:1},phase(t,educationStart+1.6,.42));
 core=blend(core,{x:330,y:440,scale:1,opacity:1},studentFocus);
 core=blend(core,{x:290,y:405,scale:1,opacity:1},summary);
 let student=blend({x:290,y:340,scale:.4,opacity:0},{x:110,y:550,scale:1,opacity:1},unfold);
 let teacher=blend({x:290,y:340,scale:.4,opacity:0},{x:430,y:550,scale:1,opacity:1},unfold);
 student=blend(student,{x:110,y:440,scale:1,opacity:1},studentFocus);
 teacher=blend(teacher,{x:430,y:650,scale:.66,opacity:.28},studentFocus);
 student=blend(student,{x:430,y:650,scale:.66,opacity:.28},teacherFocus);
 teacher=blend(teacher,{x:110,y:440,scale:1,opacity:1},teacherFocus);
 student=blend(student,{x:110,y:590,scale:1,opacity:1},summary);
 teacher=blend(teacher,{x:430,y:590,scale:1,opacity:1},summary);
 return {core,student,teacher,boundary,protect,education,unfold,studentFocus,teacherFocus,summary};
}
