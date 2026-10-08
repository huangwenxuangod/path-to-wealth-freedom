export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const smooth = (v: number) => {const p = clamp(v); return p * p * (3 - 2 * p);};
export const phase = (t: number, start: number, duration = .4) => smooth((t - start) / duration);
export const hit = (t: number, start: number, duration = .3) => 1 - Math.pow(1 - clamp((t - start) / duration), 3);
export const windowOpacity = (t: number, start: number, end: number, duration = .25) => phase(t, start, duration) * (1 - phase(t, end - duration, duration));
export function riskState(t: number) {
 const boundary = phase(t, 4.42, .5), controlled = phase(t, 7.05, .5);
 return {boundary, controlled, marks: [
  {x:mix(70,165,boundary),y:mix(415,500,boundary)},
  {x:mix(680,530,boundary),y:mix(585,590,boundary)},
  {x:mix(355,365,boundary),y:mix(795,665,boundary)},
 ]};
}
export const pairReveal = (t: number, index: number) => hit(t,22.1+index*.16,.42);
export const documentGroups = (t: number) => phase(t,29.36,.7);
export const reunion = (t: number) => phase(t,30.9,.42);
export function stageOpacity(t: number) {
 return Math.max(windowOpacity(t,10.55,12.65,.28),windowOpacity(t,22.1,25.45,.3),phase(t,27.4,.4));
}
