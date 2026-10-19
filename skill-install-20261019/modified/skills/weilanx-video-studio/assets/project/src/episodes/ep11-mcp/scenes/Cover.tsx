import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {CalendarIcon, PlugIcon, SheetIcon} from '../../../library/icons';
import {bigText, Card, Note, txt} from '../../../library/ui';

// 竖屏 3:4 封面（1080×1440），作为成片首帧

const Rays: React.FC = () => (
  <svg width={1080} height={1440} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 36}, (_, i) => {
      const a = (i / 36) * Math.PI * 2;
      const r0 = 260 + rand(i * 7) * 80;
      return <line key={i} x1={540 + Math.cos(a) * r0} y1={980 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 1600} y2={980 + Math.sin(a) * 1600} stroke={C.ink} strokeWidth={3 + (i % 3) * 3} opacity={0.12} />;
    })}
  </svg>
);

export const Ep11Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#FFE9C7', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(110, C.white)}>AI 怎么突然能</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 300, transform: 'rotate(-3deg)'}}>
      <div style={bigText(140, C.red)}>改你的表格？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 40, right: 40, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>统一插座</div>
        <div style={bigText(130, C.white)}>MCP</div>
      </Card>
    </div>
    {/* 画面：一根 MCP 插座，日历、表格插在上面，AI 小人和 CC 在旁边 */}
    <div style={{position: 'absolute', left: 70, top: 760, transform: 'rotate(-3deg)'}}>
      <div style={{display: 'flex', gap: 30, marginLeft: 40}}>
        <CalendarIcon size={130} />
        <SheetIcon size={130} />
        <div style={{marginTop: 10}}>
          <PlugIcon kind="usbc" size={90} color={C.tealLight} />
        </div>
      </div>
      <Card w={520} h={110} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', marginTop: 20}}>
        <div style={bigText(56, C.white)}>MCP</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 80, height: 56, borderRadius: 12, background: '#FFF6D0', border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            {[0, 1].map((j) => <div key={j} style={{width: 9, height: 22, borderRadius: 4, background: C.ink}} />)}
          </div>
        ))}
      </Card>
    </div>
    <Char f={f} x={690} y={1250} s={1.2} kind="bot" eyes="star" lookX={-0.5} armsUp={0.9} />
    <Char f={f} x={920} y={1250} s={1.2} wear={['headphones']} eyes="happy" lookX={-0.5} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个建议，<span style={{color: C.yellow}}>接对工具不踩坑</span>
        </div>
      </Card>
    </div>
  </div>
);
