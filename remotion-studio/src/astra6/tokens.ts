export const palette={canvas:'#F5F7FA',surface:'#FFFFFF',ink:'#17243A',muted:'#526176',action:'#2457E6',result:'#087F70'};
export const progress=(s:number,start=0,duration=.6)=>Math.max(0,Math.min(1,(s-start)/duration));
export const ease=(s:number,start=0,duration=.6)=>1-Math.pow(1-progress(s,start,duration),3);
export const sceneStarts=[0,6,14,22,30] as const;
