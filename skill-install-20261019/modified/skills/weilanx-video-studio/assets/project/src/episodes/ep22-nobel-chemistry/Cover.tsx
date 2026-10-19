import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VoxFootage} from '../../library/vox/footage';
import {Desk, Label, VoxDefs} from '../../library/vox/props';
import {Medal} from '../../library/vox/shots';
import {V, VF} from '../../library/vox/theme';

const FT = 'footage/ep22-nobel-chemistry/';

/** 16:9 封面（成片首帧）：黑卡大标题 + 反应停药瓶 + 诺奖镜像小鼠插图 */
export const Ep22Cover: React.FC<{f: number}> = () => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Desk w={1920} h={1080} color={V.oldMap} seed={12} />
    <div style={{position: 'absolute', left: 60, top: 60, width: 1000, height: 960, background: V.card, boxShadow: '3px 6px 10px rgba(23,23,22,0.28)'}} />
    <div style={{position: 'absolute', left: 120, top: 120}}>
      <Label size={44} bg={V.red}>
        2026 诺贝尔化学奖
      </Label>
    </div>
    <div style={{position: 'absolute', left: 110, top: 230, fontFamily: VF.heavy, fontSize: 190, lineHeight: 1.04, color: V.paper}}>
      分子也分
      <br />
      左右手
    </div>
    <div style={{position: 'absolute', left: 120, top: 690, fontFamily: VF.num, fontSize: 96, color: V.hiSolid}}>MIRROR MOLECULES</div>
    <div style={{position: 'absolute', left: 120, top: 860, fontFamily: VF.heavy, fontSize: 52, color: V.paper}}>一只手治病，另一只手致畸</div>
    <div style={{position: 'absolute', left: 1120, top: 130}}>
      <VoxFootage f={0} src={`${FT}nobel-fig_ke_26_3x2-scaled.jpg`} start={0} w={700} h={467} rot={3} zoom={[1, 1]} credit="插图：© Johan Jarnestad / 瑞典皇家科学院" />
    </div>
    <div style={{position: 'absolute', left: 1160, top: 660}}>
      <VoxFootage f={0} src={`${FT}kevadon.jpg`} start={0} w={360} h={270} rot={-4} zoom={[1.1, 1.1]} credit="美国 FDA（公有领域）" />
    </div>
    <div style={{position: 'absolute', left: 1600, top: 640, transform: 'rotate(10deg)'}}>
      <Medal s={210} />
    </div>
  </div>
);

/** 3:4 竖版封面（1080×1440） */
export const Ep22CoverTall: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <VoxDefs />
    <Desk w={1080} h={1440} color={V.oldMap} seed={13} />
    <div style={{position: 'absolute', left: 50, top: 50, width: 980, height: 760, background: V.card, boxShadow: '4px 8px 12px rgba(23,23,22,0.3)'}} />
    <div style={{position: 'absolute', left: 100, top: 100}}>
      <Label size={40} bg={V.red}>
        2026 诺贝尔化学奖
      </Label>
    </div>
    <div style={{position: 'absolute', left: 90, top: 190, fontFamily: VF.heavy, fontSize: 210, lineHeight: 1.02, color: V.paper, whiteSpace: 'nowrap'}}>
      分子也分
      <br />
      左右手
    </div>
    <div style={{position: 'absolute', left: 100, top: 660, fontFamily: VF.num, fontSize: 84, color: V.hiSolid}}>MIRROR MOLECULES</div>
    <div style={{position: 'absolute', left: 70, top: 860}}>
      <VoxFootage f={0} src={`${FT}nobel-fig_ke_26_3x2-scaled.jpg`} start={0} w={620} h={413} rot={-2} zoom={[1, 1]} credit="插图：© Johan Jarnestad / 瑞典皇家科学院" />
    </div>
    <div style={{position: 'absolute', left: 750, top: 840, transform: 'rotate(10deg)'}}>
      <Medal s={250} />
    </div>
    <div style={{position: 'absolute', left: 60, top: 1335, background: V.hiSolid, padding: '10px 26px', transform: 'rotate(-1deg)', fontFamily: VF.heavy, fontSize: 52, color: V.ink, whiteSpace: 'nowrap', boxShadow: '3px 5px 0 rgba(23,23,22,0.85)'}}>一只手治病，另一只手致畸</div>
  </AbsoluteFill>
);
