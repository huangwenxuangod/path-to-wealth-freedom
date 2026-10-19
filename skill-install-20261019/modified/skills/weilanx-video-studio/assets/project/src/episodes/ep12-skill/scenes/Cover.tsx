import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {bigText, Card, Note, txt} from '../../../library/ui';
import {ManualBook} from './part1';

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

export const Ep12Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#E6E4FB', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(110, C.white)}>一句话让 AI</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 300, transform: 'rotate(-3deg)'}}>
      <div style={bigText(130, C.red)}>做完一整期视频？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 40, right: 40, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>技能说明书</div>
        <div style={bigText(120, C.white)}>Skill</div>
      </Card>
    </div>
    {/* 画面：一排技能手册，AI 小人和 CC 在旁边 */}
    <div style={{position: 'absolute', left: 50, top: 740, display: 'flex', gap: 16, alignItems: 'flex-end', transform: 'rotate(-3deg)'}}>
      <ManualBook title="做视频" w={200} h={300} color={C.teal} size={40} />
      <ManualBook title="写周报" w={180} h={250} color={C.orange} size={36} />
      <ManualBook title="回客户" w={180} h={270} color="#8E8FE8" size={36} />
    </div>
    <Char f={f} x={740} y={1250} s={1.1} kind="bot" eyes="star" lookX={-0.5} armsUp={0.9} />
    <Char f={f} x={950} y={1250} s={1.1} wear={['headphones']} eyes="happy" lookX={-0.5} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个建议，<span style={{color: C.yellow}}>写出你的第一个 Skill</span>
        </div>
      </Card>
    </div>
  </div>
);
