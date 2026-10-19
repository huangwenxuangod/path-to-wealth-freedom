import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {DatabaseIcon, Stamp} from '../../../library/icons';
import {bigText, Card, Note, txt} from '../../../library/ui';
import {LabeledKey} from './part1';

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

export const Ep14Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#FFE0D6', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(110, C.white)}>AI 帮你干活</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 300, transform: 'rotate(-3deg)'}}>
      <div style={bigText(140, C.red)}>却删了数据库？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 30, right: 30, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '0 34px'}}>
        <div style={txt(80)}>权限</div>
        <div style={bigText(110, C.white)}>Permission</div>
      </Card>
    </div>
    {/* 画面：被删的数据库 + 一串钥匙，AI 小人和 CC 在旁边 */}
    <div style={{position: 'absolute', left: 80, top: 750, transform: 'rotate(-4deg)'}}>
      <DatabaseIcon size={200} />
      <div style={{position: 'absolute', left: -10, top: 70, transform: 'rotate(-10deg)'}}>
        <Stamp text="已删除" size={56} />
      </div>
    </div>
    <div style={{position: 'absolute', left: 330, top: 760, display: 'flex', flexDirection: 'column', gap: 14, transform: 'rotate(3deg)'}}>
      <LabeledKey i={0} size={110} />
      <LabeledKey i={2} size={110} />
      <LabeledKey i={3} size={110} />
    </div>
    <Char f={f} x={760} y={1250} s={1.1} kind="bot" eyes="spiral" lookX={-0.5} />
    <Char f={f} x={960} y={1250} s={1.1} wear={['headphones']} eyes="wide" lookX={-0.5} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个建议，<span style={{color: C.yellow}}>放心把活交给 AI</span>
        </div>
      </Card>
    </div>
  </div>
);
