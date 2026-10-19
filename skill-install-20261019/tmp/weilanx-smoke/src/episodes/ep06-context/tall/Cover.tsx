import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {PlainFile} from '../../../library/icons';
import {Desk} from '../../../library/items/objects';
import {bigText, Card, Note, txt} from '../../../library/ui';

// 竖屏 3:4 封面（1080×1440），作为成片首帧

const Rays: React.FC = () => (
  <svg width={1080} height={1440} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 36}, (_, i) => {
      const a = (i / 36) * Math.PI * 2;
      const r0 = 260 + rand(i * 7) * 80;
      return <line key={i} x1={540 + Math.cos(a) * r0} y1={760 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 1600} y2={760 + Math.sin(a) * 1600} stroke={C.ink} strokeWidth={3 + (i % 3) * 3} opacity={0.12} />;
    })}
  </svg>
);

export const Ep06Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#FFE59A', overflow: 'hidden'}}>
    <Rays />
    {/* 系列标签 */}
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    {/* 大标题 */}
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(136, C.white)}>AI 聊着聊着</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 320, transform: 'rotate(-3deg)'}}>
      <div style={bigText(168, C.red)}>就变笨了？</div>
    </div>
    {/* 角色：左边转圈眼的 AI，右边惊讶的 CC（画在关键词和文件后面） */}
    <Char f={f} x={250} y={880} s={0.9} kind="bot" eyes="spiral" lookX={0.3} />
    <Char f={f} x={830} y={880} s={0.9} wear={['headphones']} eyes="wide" lookX={-0.4} armsUp={0.8} />
    {/* 核心词：放到最大 */}
    <div style={{position: 'absolute', left: 60, right: 60, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={150} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>上下文</div>
        <div style={bigText(120, C.white)}>context</div>
      </Card>
    </div>
    {/* 画面：桌子放满了，前面的文件被挤下去 */}
    <div style={{position: 'absolute', left: 140, top: 1010}}>
      <Desk w={800} hot={1} />
    </div>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{position: 'absolute', left: 200 + i * 140, top: 870}}>
        <PlainFile name="" size={100} color={i % 2 ? C.tealLight : '#FCE3A8'} />
      </div>
    ))}
    <div style={{position: 'absolute', left: 40, top: 960, transform: 'rotate(-35deg)', filter: 'grayscale(1)', opacity: 0.8}}>
      <PlainFile name="" size={100} />
    </div>
    <div style={{position: 'absolute', left: 30, top: 1150, transform: 'rotate(-8deg)'}}>
      <div style={bigText(92, C.red)}>全忘了！</div>
    </div>
    {/* 底部承诺 */}
    <div style={{position: 'absolute', left: 60, right: 60, top: 1290}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个做法，让它<span style={{color: C.yellow}}>重新变聪明</span>
        </div>
      </Card>
    </div>
  </div>
);
