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
      return <line key={i} x1={540 + Math.cos(a) * r0} y1={960 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 1600} y2={960 + Math.sin(a) * 1600} stroke={C.ink} strokeWidth={3 + (i % 3) * 3} opacity={0.12} />;
    })}
  </svg>
);

export const Ep09Cover: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, width: 1080, height: 1440, background: '#D6ECF7', overflow: 'hidden'}}>
    <Rays />
    <div style={{position: 'absolute', left: 60, top: 60, transform: 'rotate(-3deg)'}}>
      <Note color={C.white} size={48}>一分钟看懂 AI</Note>
    </div>
    <div style={{position: 'absolute', left: 60, top: 160}}>
      <div style={bigText(120, C.white)}>同一个 AI</div>
    </div>
    <div style={{position: 'absolute', left: 50, top: 310, transform: 'rotate(-3deg)'}}>
      <div style={bigText(150, C.red)}>你问出废话？</div>
    </div>
    {/* 核心词 */}
    <div style={{position: 'absolute', left: 40, right: 40, top: 520, display: 'flex', justifyContent: 'center', transform: 'rotate(-2deg)'}}>
      <Card h={160} pad={0} bg={C.yellow} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px'}}>
        <div style={txt(80)}>提示词</div>
        <div style={bigText(120, C.white)}>Prompt</div>
      </Card>
    </div>
    {/* 画面：一份任务说明书，AI 小人捧着看得两眼放光，CC 在旁边 */}
    <div style={{position: 'absolute', left: 60, top: 740, transform: 'rotate(-4deg)'}}>
      <Card w={460} h={420} bg="#FFFDF7">
        <div style={{...txt(52), textAlign: 'center'}}>任务说明书</div>
        <div style={{borderTop: `4px solid ${C.ink}`, margin: '12px 0 6px'}} />
        {['目标', '背景', '要求'].map((t, i) => (
          <div key={t} style={{marginTop: 18}}>
            <div style={txt(40, C.orangeDark)}>{i + 1}. {t}</div>
            <div style={{height: 16, width: `${80 - i * 8}%`, background: '#E4DED2', borderRadius: 8, marginTop: 10}} />
          </div>
        ))}
      </Card>
      <div style={{position: 'absolute', left: 250, top: 300, transform: 'rotate(-12deg)'}}>
        <Stamp text="写清楚" size={60} color={C.teal} />
      </div>
    </div>
    <Char f={f} x={650} y={1250} s={1.2} kind="bot" eyes="star" lookX={-0.4} armsUp={0.9} />
    <Char f={f} x={890} y={1250} s={1.2} wear={['headphones']} eyes="happy" lookX={-0.4} />
    <div style={{position: 'absolute', left: 60, top: 1290, right: 60}}>
      <Card h={110} pad={0} bg={C.ink} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={txt(56, C.white)}>
          3 个做法，<span style={{color: C.yellow}}>把废话问成干货</span>
        </div>
      </Card>
    </div>
  </div>
);
