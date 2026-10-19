import React from 'react';
import {rand} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {Stamp} from '../../../library/icons';
import {bigText, Card, Note, txt} from '../../../library/ui';

// 竖屏 3:4 封面（1080×1440），作为成片首帧

const Rays: React.FC = () => (
  <svg width={1080} height={1440} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 36}, (_, i) => {
      const a = (i / 36) * Math.PI * 2;
      const r0 = 260 + rand(i * 7) * 80;
      return <line key={i} x1={540 + Math.cos(a) * r0} y1={900 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 1600} y2={900 + Math.sin(a) * 1600} stroke={C.ink} strokeWidth={3 + (i % 3) * 3} opacity={0.12} />;
    })}
  </svg>
);

export const Ep08Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#FFD9D6', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(130, C.white)}>AI 一本正经</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 320, transform: 'rotate(-3deg)'}}>
      <div style={bigText(160, C.red)}>胡说八道？</div>
    </div>
    {/* 画面：一份被盖满“查无此案”的法庭文件，AI 还一脸自信 */}
    <div style={{position: 'absolute', left: 90, top: 740, transform: 'rotate(-4deg)'}}>
      <Card w={560} h={400} bg="#FFFDF7">
        <div style={{...txt(44), textAlign: 'center'}}>法庭文件</div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'relative', marginTop: 34, height: 30}}>
            <div style={{height: 22, width: `${70 + i * 8}%`, background: '#E4DED2', borderRadius: 11}} />
            <div style={{position: 'absolute', left: -6, top: 8, height: 6, width: '90%', background: C.red, borderRadius: 3}} />
          </div>
        ))}
      </Card>
      <div style={{position: 'absolute', left: 250, top: 150, transform: 'rotate(-12deg)'}}>
        <Stamp text="查无此案" size={64} />
      </div>
    </div>
    <Char f={f} x={840} y={1150} s={1.1} kind="bot" eyes="star" lookX={-0.4} armsUp={0.9} />
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 60, right: 60, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={150} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>幻觉</div>
        <div style={bigText(88, C.white)}>Hallucination</div>
      </Card>
    </div>
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个做法，<span style={{color: C.yellow}}>别再被 AI 骗</span>
        </div>
      </Card>
    </div>
  </div>
);
