// Magic UI Number Ticker (MIT), adapted to a deterministic seconds input.
import {cn} from '@/lib/utils';
export function NumberTicker({value,seconds,start=0,duration=.8,decimalPlaces=1,className}:{value:number;seconds:number;start?:number;duration?:number;decimalPlaces?:number;className?:string}) {
  const p=Math.max(0,Math.min(1,(seconds-start)/duration));
  const latest=value*(1-Math.pow(1-p,3));
  return <span className={cn('inline-block tabular-nums tracking-tight',className)}>{Intl.NumberFormat('en-US',{minimumFractionDigits:decimalPlaces,maximumFractionDigits:decimalPlaces}).format(Number(latest.toFixed(decimalPlaces)))}</span>;
}
