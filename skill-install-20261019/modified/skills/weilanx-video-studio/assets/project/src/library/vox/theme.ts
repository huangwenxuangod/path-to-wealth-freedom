import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Vox 拼贴解说的配色与字体。
 * 配色照 huashu-art-motion 的 Vox 语法卡（Missing Chapter 实测）：黑、纸白、一种红，加荧光黄只划重点。
 */
export const V = {
  desk: '#e4ddcf', // 桌面纸
  deskDark: '#d6cdbb',
  paper: '#eeeded', // 纸白
  paperWarm: '#f1ead9', // 泛黄的剪报
  oldMap: '#e4dccf',
  parchment: '#cfb195',
  card: '#1b1b1a', // 黑卡纸
  ink: '#171716',
  inkSoft: '#5b5651',
  red: '#b8433f', // 线索红：画线
  redDark: '#93403c', // 暗红：填面
  hi: 'rgba(218,207,8,0.9)', // 荧光笔
  hiSolid: '#dacf08',
};

const FACES: [string, string, string?][] = [
  ['Vox Anton', 'fonts/vox/Anton-400.woff'],
  ['Vox Playfair', 'fonts/vox/PlayfairDisplay-700.woff'],
  ['Vox Playfair Italic', 'fonts/vox/PlayfairDisplay-700i.woff'],
  ['Vox Garamond', 'fonts/vox/EBGaramond-400.woff'],
  ['Vox Garamond SemiBold', 'fonts/vox/EBGaramond-600.woff'],
  ['Vox Caveat', 'fonts/vox/Caveat-600.woff'],
  ['Vox Heavy', 'fonts/vox/NotoSansSC-900.woff'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('load vox fonts');
  Promise.all(
    FACES.map(([name, file]) => {
      const face = new FontFace(name, `url(${staticFile(file)})`);
      return face.load().then((loaded) => document.fonts.add(loaded));
    }),
  )
    .catch((err) => console.error(err))
    .finally(() => continueRender(handle));
}

/** 中文剪报正文：宋体 */
export const VF = {
  serifCn: `'Songti SC', 'Noto Serif SC', serif`,
  heavy: `'Vox Heavy', 'PingFang SC', sans-serif`,
  num: `'Vox Anton', 'Vox Heavy', sans-serif`,
  head: `'Vox Playfair', 'Songti SC', serif`,
  headItalic: `'Vox Playfair Italic', 'Songti SC', serif`,
  body: `'Vox Garamond', 'Songti SC', serif`,
  bodyBold: `'Vox Garamond SemiBold', 'Songti SC', serif`,
  hand: `'Vox Caveat', 'Songti SC', cursive`,
};

/** 一拍二：元素层按 12fps 步进（相机层仍按 30fps 平滑），这是 Vox 手工感的一半来源 */
export const step12 = (f: number) => Math.floor((f * 12) / 30) * (30 / 12);

/** 长尾缓动 cubic-bezier(.33,0,.2,1)：拉出揭示、沿线索追过去 */
export const tailEase = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  // 牛顿迭代求 bezier 的 x→t
  const bx = (u: number) => 3 * (1 - u) * (1 - u) * u * 0.33 + 3 * (1 - u) * u * u * 0.2 + u * u * u;
  const by = (u: number) => 3 * (1 - u) * u * u * 1 + u * u * u;
  let u = c;
  for (let i = 0; i < 6; i++) {
    const x = bx(u) - c;
    const d = 3 * (1 - u) * (1 - u) * 0.33 + 6 * (1 - u) * u * (0.2 - 0.33) + 3 * u * u * (1 - 0.2);
    if (Math.abs(d) < 1e-6) break;
    u -= x / d;
  }
  return by(Math.max(0, Math.min(1, u)));
};

/** 对称缓动 easeInOutSine：长距离找下一张卡 */
export const sineInOut = (t: number) => -(Math.cos(Math.PI * Math.max(0, Math.min(1, t))) - 1) / 2;
