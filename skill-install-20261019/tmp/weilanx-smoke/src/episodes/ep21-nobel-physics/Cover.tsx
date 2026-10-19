import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VoxFootage} from '../../library/vox/footage';
import {Desk, Label, VoxDefs} from '../../library/vox/props';
import {V, VF} from '../../library/vox/theme';

const FT = 'footage/ep21-nobel-physics/';

const Medal: React.FC<{s: number}> = ({s}) => (
  <svg width={s} height={s * 1.25} viewBox="0 0 120 150">
    <path d="M30 0 L52 60 L68 60 L46 0 Z" fill={V.red} />
    <path d="M90 0 L68 60 L52 60 L74 0 Z" fill="#3D6AA8" />
    <circle cx={60} cy={98} r={46} fill="#D9B44A" stroke={V.ink} strokeWidth={4} />
    <circle cx={60} cy={98} r={33} fill="none" stroke="#9C7A1E" strokeWidth={4} />
    <text x={60} y={110} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fontWeight={700} fill="#7A5C10">
      N
    </text>
  </svg>
);

/** 16:9 封面（成片首帧）：黑卡大标题 + 南极冰立方实验室极光夜景实拍 */
export const Ep21Cover: React.FC<{f: number}> = () => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Desk w={1920} h={1080} color={V.oldMap} seed={9} />
    <div style={{position: 'absolute', left: 60, top: 60, width: 1000, height: 960, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
    <div style={{position: 'absolute', left: 120, top: 120}}>
      <Label size={44} bg={V.red}>
        2026 诺贝尔物理学奖
      </Label>
    </div>
    <div style={{position: 'absolute', left: 110, top: 230, fontFamily: VF.heavy, fontSize: 190, lineHeight: 1.04, color: V.paper}}>
      南极冰下
      <br />
      抓幽灵
    </div>
    <div style={{position: 'absolute', left: 120, top: 690, fontFamily: VF.num, fontSize: 96, color: '#7FD3FF'}}>NEUTRINO · ICECUBE</div>
    <div style={{position: 'absolute', left: 120, top: 860, fontFamily: VF.heavy, fontSize: 52, color: V.hiSolid}}>一立方公里的冰，变成了望远镜</div>
    <div style={{position: 'absolute', left: 1110, top: 150}}>
      <VoxFootage f={0} src={`${FT}lab-night.jpg`} start={0} w={720} h={480} rot={3} zoom={[1, 1]} focus={[0.5, 0.6]} credit="照片：John Hardin / CC BY 4.0" />
    </div>
    <div style={{position: 'absolute', left: 1180, top: 690}}>
      <VoxFootage f={0} src={`${FT}dom.jpg`} start={0} w={300} h={300} rot={-4} zoom={[1, 1]} credit="Amble / CC BY-SA 3.0" />
    </div>
    <div style={{position: 'absolute', left: 1600, top: 620, transform: 'rotate(10deg)'}}>
      <Medal s={210} />
    </div>
  </div>
);

/** 3:4 竖版封面（1080×1440） */
export const Ep21CoverTall: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <VoxDefs />
    <Desk w={1080} h={1440} color={V.oldMap} seed={11} />
    <div style={{position: 'absolute', left: 50, top: 50, width: 980, height: 760, background: V.card, boxShadow: '4px 8px 12px rgba(23,23,22,0.3)'}} />
    <div style={{position: 'absolute', left: 100, top: 100}}>
      <Label size={40} bg={V.red}>
        2026 诺贝尔物理学奖
      </Label>
    </div>
    <div style={{position: 'absolute', left: 90, top: 190, fontFamily: VF.heavy, fontSize: 210, lineHeight: 1.02, color: V.paper, whiteSpace: 'nowrap'}}>
      南极冰下
      <br />
      抓幽灵
    </div>
    <div style={{position: 'absolute', left: 100, top: 660, fontFamily: VF.num, fontSize: 84, color: '#7FD3FF'}}>NEUTRINO · ICECUBE</div>
    <div style={{position: 'absolute', left: 70, top: 860}}>
      <VoxFootage f={0} src={`${FT}lab-night.jpg`} start={0} w={620} h={400} rot={-2} zoom={[1, 1]} focus={[0.5, 0.6]} credit="照片：John Hardin / CC BY 4.0" />
    </div>
    <div style={{position: 'absolute', left: 740, top: 800, transform: 'rotate(10deg)'}}>
      <Medal s={250} />
    </div>
    <div style={{position: 'absolute', left: 60, top: 1335, background: V.hiSolid, padding: '10px 26px', transform: 'rotate(-1deg)', fontFamily: VF.heavy, fontSize: 52, color: V.ink, whiteSpace: 'nowrap', boxShadow: '3px 5px 0 rgba(23,23,22,0.85)'}}>每秒 650 亿个穿过你，你却毫无感觉</div>
  </AbsoluteFill>
);
