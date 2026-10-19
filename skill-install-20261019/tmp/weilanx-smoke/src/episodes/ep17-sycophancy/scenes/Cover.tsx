import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {ThumbUp} from '../../../library/icons';
import {bigText, Card, Note, txt} from '../../../library/ui';
import {Bubble} from './part1';

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

export const Ep17Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#FFE3EA', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(110, C.white)}>AI 总说你说得对</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 300, transform: 'rotate(-3deg)'}}>
      <div style={bigText(150, C.red)}>它在哄你？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 30, right: 30, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '0 30px'}}>
        <div style={txt(76)}>讨好倾向</div>
        <div style={bigText(96, C.white)}>Sycophancy</div>
      </Card>
    </div>
    {/* 画面：AI 小人爱心眼竖大拇指，冒出一句“你说得太对了！” */}
    <div style={{position: 'absolute', left: 70, top: 760, transform: 'rotate(-3deg)'}}>
      <Bubble text="你说得太对了！思路清晰！很有创意！" color={C.tealLight} size={52} />
    </div>
    <div style={{position: 'absolute', left: 120, top: 920, transform: 'rotate(-8deg)'}}>
      <ThumbUp size={170} fill={C.yellow} />
    </div>
    <div style={{position: 'absolute', left: 340, top: 960, transform: 'rotate(8deg)'}}>
      <ThumbUp size={130} fill={C.yellow} />
    </div>
    <Char f={f} x={740} y={1250} s={1.15} kind="bot" eyes="heart" lookX={-0.5} armsUp={0.9} />
    <Char f={f} x={960} y={1250} s={1.1} wear={['headphones']} eyes="wide" lookX={-0.5} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个办法，<span style={{color: C.yellow}}>让 AI 说真话</span>
        </div>
      </Card>
    </div>
  </div>
);
