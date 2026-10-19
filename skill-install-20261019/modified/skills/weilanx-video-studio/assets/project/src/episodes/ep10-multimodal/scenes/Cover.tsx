import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Fridge} from '../../../library/items/objects';
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

export const Ep10Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#DDF1E4', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(120, C.white)}>拍张冰箱照片</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 310, transform: 'rotate(-3deg)'}}>
      <div style={bigText(140, C.red)}>它就懂做啥菜？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 20, right: 20, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px'}}>
        <div style={txt(80)}>多模态</div>
        <div style={bigText(104, C.white)}>Multimodal</div>
      </Card>
    </div>
    {/* 画面：一张冰箱照片，AI 小人看得两眼放光，CC 在旁边 */}
    <div style={{position: 'absolute', left: 80, top: 740, transform: 'rotate(-5deg)', background: C.white, border: `5px solid ${C.ink}`, padding: '14px 14px 50px', boxShadow: '6px 8px 0 rgba(43,35,32,0.18)'}}>
      <Fridge w={300} />
    </div>
    <Char f={f} x={640} y={1250} s={1.2} kind="bot" eyes="star" lookX={-0.5} armsUp={0.9} />
    <Char f={f} x={890} y={1250} s={1.2} wear={['headphones']} eyes="happy" lookX={-0.5} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个用法，<span style={{color: C.yellow}}>拍一张比打一段强</span>
        </div>
      </Card>
    </div>
  </div>
);
