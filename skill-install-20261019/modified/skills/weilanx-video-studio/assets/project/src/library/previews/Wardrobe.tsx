import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import type {Wear} from '../character/Accessories';
import type {Eyes} from '../character/types';
import {Char} from '../character/Char';
import {DotPaper} from '../fx';
import {txt} from '../ui';
import '../fonts';

const LOOKS: {name: string; wear: Wear[]; eyes: Eyes}[] = [
  {name: '默认', wear: [], eyes: 'open'},
  {name: '圣诞帽', wear: ['santa'], eyes: 'happy'},
  {name: '耳机', wear: ['headphones'], eyes: 'closed'},
  {name: '眼镜', wear: ['glasses'], eyes: 'open'},
  {name: '墨镜', wear: ['sunglasses'], eyes: 'open'},
  {name: '学士帽', wear: ['grad'], eyes: 'star'},
  {name: '太空服', wear: ['space'], eyes: 'wide'},
  {name: '书生帽', wear: ['scholar'], eyes: 'happy'},
  {name: '侦探帽', wear: ['detective'], eyes: 'flat'},
  {name: '派对帽+领结', wear: ['party', 'bowtie'], eyes: 'heart'},
  {name: '皇冠', wear: ['crown'], eyes: 'star'},
  {name: '晕了', wear: [], eyes: 'spiral'},
];

/** 配饰与表情一览，用于挑选造型 */
export const Wardrobe: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DotPaper f={f} />
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', ...txt(72)}}>小人衣柜</div>
      <div style={{position: 'absolute', left: 0, top: -90, width: 1080, height: 1920}}>
        {LOOKS.map((l, i) => {
          const x = 180 + (i % 3) * 360;
          const y = 520 + Math.floor(i / 3) * 400;
          return (
            <React.Fragment key={l.name}>
              <div style={{position: 'absolute', left: 0, top: 0}}>
                <Char f={f} x={x} y={y} s={0.95} eyes={l.eyes} wear={l.wear} armsUp={l.eyes === 'star' ? 0.6 : 0} />
              </div>
              <div style={{position: 'absolute', left: x - 150, top: y + 18, width: 300, textAlign: 'center', ...txt(40, C.ink)}}>{l.name}</div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
