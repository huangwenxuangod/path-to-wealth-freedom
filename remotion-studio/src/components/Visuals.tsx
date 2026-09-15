import type {CSSProperties, ReactNode} from 'react';
import {FileText, Table2, CalendarDays, Check, ArrowUpRight} from 'lucide-react';
import {Img, staticFile} from 'remotion';
import {graphemes, type VideoSpec} from '../spec';
import {color, progress} from '../tokens';

export function BorderSweep({seconds, start, w, h}: {seconds: number; start: number; w: number; h: number}) {
  const p = progress(seconds, start, 0.75);
  return <svg className="absolute inset-0 pointer-events-none" width={w} height={h} style={{opacity: seconds >= start && seconds <= start + 0.9 ? 1 : 0}}>
    <rect x={1} y={1} width={w - 2} height={h - 2} rx={16} fill="none" stroke={color.accent} strokeWidth={2.5} pathLength={1} strokeDasharray="0.28 0.72" strokeDashoffset={1 - p}/>
  </svg>;
}

export function ToolCard({tool, box, index, seconds, scanStart}: {tool: VideoSpec['tools'][number]; box: {w: number; h: number}; index: number; seconds: number; scanStart: number}) {
  const isPaper = tool.icon === 'document';
  const icons = {document: FileText, sheet: Table2, calendar: CalendarDays, approval: Check};
  const Icon = icons[tool.icon];
  const active = seconds >= scanStart + 0.7;
  return <div className="relative overflow-hidden rounded-2xl" style={{width: box.w, height: box.h, background: isPaper ? color.paper : color.panel, color: isPaper ? '#222b25' : color.paper, border: `1px solid ${isPaper ? color.paper : color.line}`}}>
    <div className="flex items-center gap-3" style={{padding: '20px 22px', borderBottom: `1px solid ${isPaper ? '#c8cdc2' : color.line}`}}>
      <Icon size={26} strokeWidth={1.6} style={{flexShrink: 0}}/><span data-readable style={{fontSize: graphemes(tool.label).length > 6 ? 24 : 30, fontWeight: 600, whiteSpace: 'nowrap'}}>{tool.label}</span>
      <span className="mono ml-auto" style={{fontSize: 14, opacity: 0.55}}>{String(index + 1).padStart(2, '0')}</span>
    </div>
    <div style={{padding: '18px 22px'}}>
      {tool.icon === 'document' ? <><div style={{fontSize: 18, fontWeight: 500}}>项目计划 · 最新版本</div>{[94, 79, 56].map((w) => <div key={w} style={{height: 4, width: `${w}%`, background: '#bac3b4', marginTop: 12}}/>)}</> : null}
      {tool.icon === 'sheet' ? [86, 58, 72].map((w, i) => <div key={w} className="mono flex items-center gap-5" style={{fontSize: 16, marginBottom: 12}}><span>0{i + 1}</span><div style={{height: 5, width: `${w * 0.55}%`, background: color.accent, opacity: 0.6}}/><span className="ml-auto">{[128, 64, 96][i]}</span></div>) : null}
      {tool.icon === 'calendar' ? <div className="flex items-center gap-5"><div className="mono" style={{fontSize: 52, lineHeight: 1, color: color.accent}}>26</div><div style={{fontSize: 19}}>会议 · 待办<br/><span style={{fontSize: 15, color: color.muted}}>日程与提醒</span></div></div> : null}
      {tool.icon === 'approval' ? <div className="flex items-center gap-4"><div className="rounded-full flex items-center justify-center" style={{width: 48, height: 48, border: `1px solid ${color.accent}`, color: color.accent}}><Check size={26}/></div><div style={{fontSize: 21}}>流程与状态<br/><span style={{fontSize: 15, color: color.muted}}>记录有迹可循</span></div></div> : null}
    </div>
    <div className="absolute rounded-full" style={{right: 12, bottom: 12, padding: 4, color: '#090c0b', background: color.accent, opacity: active ? 1 : 0}}><Check size={14}/></div>
    <BorderSweep seconds={seconds} start={scanStart} {...box}/>
  </div>;
}

export function HighlightText({children, seconds, start = 1.4}: {children: ReactNode; seconds: number; start?: number}) {
  return <span className="relative inline-block" style={{padding: '0 14px 9px', color: seconds > start + 0.13 ? color.bg : color.paper}}>
    <span className="absolute" style={{inset: '9px -2px 4px', background: color.accent, rotate: '-1deg', scale: `${progress(seconds, start, 0.65)} 1`, transformOrigin: 'left', zIndex: -1}}/>{children}
  </span>;
}

export function ScreenFrame({src, label, style}: {src: string; label: string; style?: CSSProperties}) {
  return <div className="overflow-hidden" style={{width: 168, height: 168, borderRadius: 37, background: '#fff', boxShadow: '0 20px 50px #00000030', ...style}}><Img src={staticFile(src)} alt={label} style={{width: '100%', height: '100%', objectFit: 'contain'}}/></div>;
}

export function AgentCore({spec, seconds}: {spec: VideoSpec; seconds: number}) {
  return <div className="flex flex-col items-center" style={{width: 370, color: color.paper}}>
    <div data-agent-logo><ScreenFrame src={spec.logo} label={spec.productName}/></div>
    <div data-readable style={{fontSize: 44, fontWeight: 600, marginTop: 24}}>{spec.productName}</div>
    <div className="mono" style={{fontSize: 15, letterSpacing: 4, color: color.muted, marginTop: 12}}>CONTEXT → ACTION</div>
    <div className="flex items-center gap-2 rounded-full" style={{marginTop: 26, padding: '10px 20px', fontSize: 21, border: '1px solid #637d37', background: '#182315', color: color.accent, opacity: progress(seconds, 5.2, 0.4)}}><Check size={21}/>上下文已连接<ArrowUpRight size={18}/></div>
  </div>;
}
