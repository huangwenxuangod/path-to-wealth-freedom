import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Wear} from '../character/Accessories';
import type {PixelSkin} from '../character/PixelBuddy';
import {Char, CharStyle} from '../character/Char';
import {txt} from '../ui';
import '../fonts';

const SKINS: {skin: PixelSkin; wear?: Wear[]; name: string}[] = [
  {skin: 'plain', name: '默认'},
  {skin: 'plain', wear: ['headphones'], name: '耳机'},
  {skin: 'santa', name: '圣诞'},
  {skin: 'cowboy', name: '牛仔'},
  {skin: 'chef', name: '厨师'},
  {skin: 'detective', name: '侦探'},
];

/** 像素风皮肤一览（深色底，和参考图一致） */
export const PixelWardrobe: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <CharStyle.Provider value="pixel">
      <AbsoluteFill style={{background: '#25232C'}}>
        {SKINS.map((s, i) => {
          const x = 180 + (i % 3) * 360;
          const y = 400 + Math.floor(i / 3) * 420;
          return (
            <React.Fragment key={s.name}>
              <div style={{position: 'absolute', left: 0, top: 0}}>
                <Char f={f} x={x} y={y} s={1} skin={s.skin} wear={s.wear} />
              </div>
              <div style={{position: 'absolute', left: x - 150, top: y + 14, width: 300, textAlign: 'center', ...txt(36, '#EDE7DA')}}>{s.name}</div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </CharStyle.Provider>
  );
};
