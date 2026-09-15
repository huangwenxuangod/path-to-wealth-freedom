// Adapted from Magic UI Terminal (MIT). Explicit video time replaces viewport/timer sequencing.
import type {CSSProperties, ReactNode} from 'react';
import {cn} from '@/lib/utils';
import {graphemes} from '../../spec';
export function Terminal({children, className, style}: {children:ReactNode; className?:string; style?:CSSProperties}) {
  return <div className={cn('h-full w-full rounded-xl border',className)} style={{background:'#17243A',color:'#f5f7fa',borderColor:'#354258',overflow:'hidden',...style}}>
    <div className="flex flex-col gap-y-2 border-b" style={{padding:24,borderColor:'#354258'}}><div className="flex flex-row gap-x-2">{['#e89997','#e5c787','#8ac2ae'].map(c=><div key={c} style={{width:12,height:12,borderRadius:20,background:c}}/>)}</div></div>
    <pre style={{margin:0,padding:32}}><code className="mono" style={{display:'grid',gap:24}}>{children}</code></pre>
  </div>;
}
export function TypingAnimation({children,seconds,start=0,speed=30}: {children:string;seconds:number;start?:number;speed?:number}) {
  return <span>{graphemes(children).slice(0,Math.max(0,Math.floor((seconds-start)*speed))).join('')}</span>;
}
export function AnimatedSpan({children,seconds,start,color='#9fdac5'}:{children:ReactNode;seconds:number;start:number;color?:string}) {
  return <span style={{opacity:Math.min(1,Math.max(0,(seconds-start)/.25)),color}}>{children}</span>;
}
