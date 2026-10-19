import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Stamp} from '../../../library/icons';
import {bigText, Card, Note, txt} from '../../../library/ui';
import {Ruler} from './part1';

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

export const Ep16Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#FFF0C9', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(110, C.white)}>AI 说做完了</div>
    </div>
    <div style={{position: 'absolute', left: 40, top: 300, transform: 'rotate(-3deg)'}}>
      <div style={bigText(116, C.red)}>一打开全是报错？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 30, right: 30, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>完工标准</div>
        <div style={bigText(130, C.white)}>DONE?</div>
      </Card>
    </div>
    {/* 画面：空白页面 + 报错，AI 却盖了“完工”章；旁边一把尺子 */}
    <div style={{position: 'absolute', left: 60, top: 740, transform: 'rotate(-3deg)'}}>
      <Card w={540} h={320} bg={C.white}>
        <div style={txt(34, '#C9C2B6')}>（一片空白）</div>
        <div style={{marginTop: 120, background: C.ink, borderRadius: 8, padding: '8px 14px'}}>
          <div style={txt(24, '#FF8A8A')}>Uncaught TypeError</div>
          <div style={txt(24, '#FF8A8A')}>Failed to load: 500</div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 230, top: 70, transform: 'rotate(-12deg)'}}>
        <Stamp text="完工！" size={64} />
      </div>
    </div>
    <div style={{position: 'absolute', left: 300, top: 1100, transform: 'rotate(-8deg)'}}>
      <Ruler w={220} />
    </div>
    <Char f={f} x={770} y={1250} s={1.1} kind="bot" eyes="happy" lookX={-0.5} armsUp={0.8} />
    <Char f={f} x={960} y={1250} s={1.1} wear={['headphones']} eyes="wide" lookX={-0.5} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个做法，<span style={{color: C.yellow}}>让 AI 真的做完</span>
        </div>
      </Card>
    </div>
  </div>
);
