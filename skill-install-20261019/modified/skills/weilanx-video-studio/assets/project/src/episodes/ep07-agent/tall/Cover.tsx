import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Folder, PlainFile} from '../../../library/icons';
import {bigText, Card, Note, txt} from '../../../library/ui';

// 竖屏 3:4 封面（1080×1440），作为成片首帧

const Rays: React.FC = () => (
  <svg width={1080} height={1440} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 36}, (_, i) => {
      const a = (i / 36) * Math.PI * 2;
      const r0 = 260 + rand(i * 7) * 80;
      return <line key={i} x1={540 + Math.cos(a) * r0} y1={880 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 1600} y2={880 + Math.sin(a) * 1600} stroke={C.ink} strokeWidth={3 + (i % 3) * 3} opacity={0.12} />;
    })}
  </svg>
);

export const Ep07Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#BFE7DF', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(130, C.white)}>AI 只会动嘴？</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 320, transform: 'rotate(-3deg)'}}>
      <div style={bigText(132, C.red)}>它能自己动手！</div>
    </div>
    {/* 角色：CC 伸手去搬文件 */}
    <Char f={f} x={330} y={930} s={1.2} wear={['headphones']} eyes="star" lookX={0.5} armsUp={0.9} />
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 60, right: 60, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={150} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>智能体</div>
        <div style={bigText(130, C.white)}>Agent</div>
      </Card>
    </div>
    {/* 文件飞进文件夹 */}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: 'absolute', left: 600 + i * 110, top: 740 - i * 30, transform: `rotate(${(i - 1) * 18}deg)`}}>
        <PlainFile name="" size={90} color={[C.tealLight, '#FCE3A8', C.pink][i]} />
      </div>
    ))}
    <div style={{position: 'absolute', left: 580, top: 960, display: 'flex', gap: 10}}>
      <Folder name="图片" size={130} color={C.tealLight} open={1} />
      <Folder name="文档" size={130} color="#FCE3A8" open={1} />
    </div>
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          Agent = 大模型 + <span style={{color: C.yellow}}>工具 + 循环</span>
        </div>
      </Card>
    </div>
  </div>
);
