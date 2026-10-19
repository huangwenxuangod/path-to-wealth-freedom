import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01} from '../anim';
import {BrandMark, BrowserMock, EndCard, FeatureCard, InkPill, LogoTiles, PopTitle, SitePage, ThumbWall} from '../editor-room/canvas';
import {CREW} from '../editor-room/mascots';
import type {ChatMsg, Clip, CursorPath} from '../editor-room/stage';
import {EditorRoom, Icon, timelineGeom} from '../editor-room/stage';
import {E, EF} from '../editor-room/theme';

/**
 * 协作剪辑台风预览：一支约 35 秒的网站宣传动画示例（虚构的建站工具「Pebble · 一句话做网站」）。
 * 一镜到底：群聊一问一答、小角色把镜头片段拖进时间轴、画布按播放头换镜头；最后渲染进度填满、整屏切到收尾卡。
 * 文案、产品、logo、网页全是自己编的示例。
 */

export const EDITOR_ROOM_DEMO_FRAMES = 1050;

const TOTAL = 30; // 时间轴总长（秒）
const g = timelineGeom(TOTAL);

/** 镜头：[开始帧, 结束帧, 镜头名]，播放头 f/30 秒走到哪个镜头就播哪个 */
const SHOTS: [number, number, string][] = [
  [90, 240, '01 一句话'],
  [240, 420, '02 生成网站'],
  [420, 570, '03 页面组件'],
  [570, 720, '04 案例'],
  [720, 900, '05 集成'],
];

/** 片段落轨：每个镜头片段在它开播前一小会被一个小角色拖进来 */
const DROPS = [60, 200, 380, 530, 690];
const clips: Clip[] = [
  ...SHOTS.map(([a, b, name], i): Clip => ({track: 'shot', start: a / 30, end: b / 30, label: name, drop: DROPS[i], by: i, thumb: <SitePage seed={i + 1} w={34} h={34} />})),
  {track: 'title', start: 3, end: 9.5, label: '“一句话做网站”', kind: 'hl'},
  {track: 'title', start: 19, end: 24, label: '“每一页都能直接用”', kind: 'hl', drop: 560, by: 3},
  {track: 'motion', start: 3, end: 6, label: 'Logo 升起', kind: 'pink'},
  {track: 'motion', start: 8.5, end: 13, label: '页面滚动', kind: 'pink'},
  {track: 'sfx', start: 19.5, end: 23, label: '对勾提示音', drop: 600, by: 4},
];

/** 每个小角色的光标路径：先在附近浮着，到点把片段拖到它在镜头轨上的位置，然后停在片段下方 */
const slot = (i: number): [number, number] => [(g.X(SHOTS[i][0] / 30) + g.X(SHOTS[i][1] / 30)) / 2 - 20, g.rowY('shot') - 6];
const park = (i: number): [number, number] => [g.X(SHOTS[i][1] / 30) - 70, g.rowY('motion') - 4 + (i % 2) * 24];
const cursors: CursorPath[] = SHOTS.map((_, i) => {
  const [sx, sy] = slot(i);
  const [px, py] = park(i);
  const start: [number, number] = [Math.min(px + 30, 1820), py - 20];
  return {who: i, keys: [[0, ...start], [DROPS[i] - 24, sx + 40, sy - 70], [DROPS[i], sx, sy], [DROPS[i] + 30, px, py], [1050, px + 10, py]]};
});
/** 飘在顶栏上空的一个光标（偶尔去点一下「渲染」） */
const floaters: CursorPath[] = [{who: 2, keys: [[0, 1460, 26], [300, 1520, 30], [820, 1560, 24], [850, 1790, 34], [900, 1790, 34]]}];

const msgs: ChatMsg[] = [
  {at: 20, who: 'me', text: '谁能用 30 秒讲清楚 Pebble？'},
  {at: 70, who: 0, text: '一句话就能做出一个网站？', icon: 'search'},
  {at: 130, who: 1, text: '我先把开场的 logo 动一下。', icon: 'spark'},
  {at: 210, who: 'me', text: '这页真是一句话生成的？'},
  {at: 280, who: 3, text: '真的，连文案都是它写的。', icon: 'copy'},
  {at: 360, who: 2, text: '配乐我卡到 120 BPM 了。', icon: 'music'},
  {at: 450, who: 4, text: '组件都能单独改吗？', icon: 'search'},
  {at: 500, who: 'me', text: '能，拖进来就行。'},
  {at: 600, who: 3, text: '再放一墙案例，看着更踏实。', icon: 'copy'},
  {at: 680, who: 0, text: '支付和表单能接吗？', icon: 'key'},
  {at: 760, who: 4, text: '都核过了，全部已接入。', icon: 'check'},
  {at: 830, who: 'me', text: '行，渲染。'},
];

/** 集成卡的原创小图形 */
const glyph = (k: number) => (
  <svg width={46} height={46} viewBox="0 0 46 46">
    {k === 0 && (
      <>
        <rect x={4} y={10} width={38} height={26} rx={6} fill={E.ink} />
        <rect x={4} y={16} width={38} height={6} fill={E.hl} />
      </>
    )}
    {k === 1 && (
      <>
        <rect x={8} y={4} width={30} height={38} rx={5} fill="none" stroke={E.ink} strokeWidth={3} />
        <path d="M15 16 H31 M15 24 H31 M15 32 H24" stroke={E.ink} strokeWidth={3} strokeLinecap="round" />
      </>
    )}
    {k === 2 && <path d="M6 38 V24 M17 38 V14 M28 38 V20 M39 38 V8" stroke={E.ink} strokeWidth={5} strokeLinecap="round" />}
    {k === 3 && (
      <>
        <circle cx={23} cy={23} r={18} fill="none" stroke={E.ink} strokeWidth={3} />
        <path d="M5 23 H41 M23 5 C14 14 14 32 23 41 M23 5 C32 14 32 32 23 41" fill="none" stroke={E.ink} strokeWidth={2.5} />
      </>
    )}
  </svg>
);

/** 画布内容：按当前帧所在镜头切换（硬切） */
const Canvas: React.FC<{f: number}> = ({f}) => {
  const shot = SHOTS.findIndex(([a, b]) => f >= a && f < b);
  if (shot < 0)
    return (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 1080, height: 560, borderRadius: 18, border: `2px dashed ${E.faint}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
          <Icon k="film" c={E.faint} s={44} />
          <span style={{fontFamily: EF.ui, fontWeight: 600, fontSize: 22, color: E.gray}}>{f < 90 ? '把镜头拖到这里' : '渲染中…'}</span>
        </div>
      </AbsoluteFill>
    );
  const at = SHOTS[shot][0];
  if (shot === 0)
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}>
          <BrandMark size={86} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 290}}>
          <PopTitle f={f} at={at + 10} parts={['一句话，', '做出你的〔网站〕。']} size={100} per={8} />
        </div>
      </AbsoluteFill>
    );
  if (shot === 1)
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 60, top: 150, width: 380}}>
          <PopTitle f={f} at={at + 4} parts={['“帮我做个', '甜品小店的', '〔官网〕”']} size={52} per={6} align="left" />
          <div style={{marginTop: 22, fontFamily: EF.ui, fontWeight: 600, fontSize: 20, color: E.gray}}>输入这一句，回车。</div>
        </div>
        <BrowserMock f={f} at={at + 26} url="pebble.site/甜品小店" seed={0} title="周末甜品铺" x={470} y={40} w={680} h={580} scrollAt={at + 70} scrollDur={70} />
      </AbsoluteFill>
    );
  if (shot === 2)
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 0, right: 0, top: 70}}>
          <PopTitle f={f} at={at + 4} parts={['每一块，', '都能〔单独改〕。']} size={74} per={7} />
        </div>
        <FeatureCard f={f} at={at + 22} label="PAGE" chips={[{text: '模板', icon: 'film'}, {text: '文案', icon: 'text'}, {text: '一键发布', icon: 'share', hl: true}]} chipAt={at + 40} x={300} y={250} />
      </AbsoluteFill>
    );
  if (shot === 3)
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 60, top: 180, width: 420}}>
          <PopTitle f={f} at={at + 4} parts={['做过的，', '不是〔样稿〕。']} size={64} per={7} align="left" />
          <div style={{marginTop: 24, fontFamily: EF.ui, fontWeight: 600, fontSize: 20, color: E.gray, lineHeight: 1.6}}>每一页都已经上线，直接能用。</div>
        </div>
        <ThumbWall f={f} at={at + 18} stickerAt={at + 60} x={500} y={110} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 80}}>
        <PopTitle f={f} at={at + 4} parts={['接上你', '〔在用〕的工具。']} size={80} per={7} />
      </div>
      <LogoTiles f={f} at={at + 24} checkAt={at + 70} tiles={[{name: '支付', glyph: glyph(0)}, {name: '表单', glyph: glyph(1)}, {name: '统计', glyph: glyph(2)}, {name: '域名', glyph: glyph(3)}]} x={150} y={260} />
      <InkPill f={f} at={at + 110} text="全部已接入" x={500} y={560} />
    </AbsoluteFill>
  );
};

export const EditorRoomDemo: React.FC = () => {
  const f = useCurrentFrame();
  const shot = SHOTS.find(([a, b]) => f >= a && f < b);
  const render = clamp01((f - 840) / 50);
  const fade = clamp01((f - 900) / 14);
  return (
    <AbsoluteFill style={{background: E.bg, fontFamily: EF.ui}}>
      {f < 915 && (
        <EditorRoom
          f={Math.min(f, 899)}
          logo={<BrandMark size={40} />}
          name="Pebble"
          tag="产品演示"
          project="30 秒讲清 Pebble"
          render={render}
          channel="讲清-pebble"
          crew={CREW}
          me={{name: '小林', role: '制片'}}
          msgs={msgs}
          shot={shot?.[2]}
          canvas={<Canvas f={f} />}
          total={TOTAL}
          clips={clips}
          cursors={cursors}
          floaters={floaters}
          keyframes={[15, 16, 17, 18]}
          railThumbs={[<SitePage key="a" seed={2} w={52} h={80} />, <SitePage key="b" seed={4} w={52} h={80} />]}
          fade={fade}
        />
      )}
      {f >= 914 && <EndCard f={f} at={915} logo={<BrandMark size={96} />} name="Pebble" slogan={['一句话，', '做出你的〔网站〕。']} url="pebble.site" note="示例产品 · 免费试用，不绑卡。" crew={CREW} />}
    </AbsoluteFill>
  );
};
