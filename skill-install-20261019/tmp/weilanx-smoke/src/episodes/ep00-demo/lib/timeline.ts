export const FPS = 30;
export const DURATION = 900;
export const W = 1920;
export const H = 1080;

const s = (sec: number) => Math.round(sec * FPS);

/** 全片关键时刻（帧号），画面与音效共用 */
export const T = {
  walkIn: s(0),
  audioTrack: s(0.8),
  dropSunrise: s(1.2),
  dragCoffee: s(1.8),
  dropCoffee: s(2.7),
  dropRest: s(2.8),
  zoomTimeline: s(2.2),
  boringLabel: s(3.5),
  zoomBoring: s(3.6),
  scissorsUp: s(4.0),
  snip: s(5.0),
  closeGap: s(5.4),
  muchCleaner: s(6.4),
  tabTransitions: s(8.0),
  panLeft: s(7.8),
  grabSpin: s(8.8),
  dropSpin: s(9.6),
  trip: s(9.9),
  getUp: s(10.9),
  dropWhoosh: s(11.2),
  tabText: s(11.8),
  panCenter: s(11.4),
  typeCaption: s(12.2),
  textClip: s(12.4),
  wink: s(14.0),
  panRight: s(15.2),
  reachSparkle: s(15.6),
  reachShake: s(16.5),
  shakeMax: s(17.0),
  shakeBack: s(18.0),
  nobodySaw: s(18.1),
  playback: s(19.0),
  reachZoom: s(21.0),
  reachExport: s(21.9),
  exportClick: s(22.4),
  exportDone: s(23.4),
  outro: s(24.0),
  nailedIt: s(26.2),
  signature: s(24.6),
  signName: s(25.8),
  signOff: s(27.0),
  confetti: s(25.8),
  end: DURATION,
} as const;

/* ---------- 世界坐标里的 UI 几何（1920×1080） ---------- */
export const TL_X0 = 150;
export const PX_PER_SEC = 105;
export const timeToX = (sec: number) => TL_X0 + sec * PX_PER_SEC;

export const GEO = {
  window: {x: 45, y: 22, w: 1830, h: 1023},
  titleH: 72,
  media: {x: 65, y: 107, w: 363, h: 505},
  phone: {x: 818, y: 108, w: 282, h: 499},
  adjust: {x: 1493, y: 107, w: 362, h: 505},
  timeline: {x: 65, y: 622, w: 1790, h: 415},
  ruler: {y: 640},
  textTrack: {y: 688, h: 50},
  videoTrack: {y: 752, h: 100},
  audioTrack: {y: 868, h: 60},
  markers: {y: 958},
  exportBtn: {x: 1652, y: 33, w: 193, h: 52},
  sliderX0: 1522,
  sliderW: 304,
  sliderY: {sparkle: 222, shake: 312, zoom: 402, speed: 492},
  groundY: 752,
} as const;

export type SceneId = 'sunrise' | 'coffee' | 'boring' | 'cat' | 'dance';

export interface ClipDef {
  id: SceneId;
  start: number; // 秒
  end: number;
  fill: string;
  border: string;
}

export const CLIPS: ClipDef[] = [
  {id: 'sunrise', start: 0, end: 2.6, fill: '#F6C27A', border: '#E7A935'},
  {id: 'coffee', start: 2.65, end: 5.0, fill: '#F7CFD6', border: '#E9A3AF'},
  {id: 'boring', start: 5.05, end: 8.0, fill: '#D9D6CF', border: '#8F8B84'},
  {id: 'cat', start: 8.05, end: 10.6, fill: '#CBBDF2', border: '#7B63D6'},
  {id: 'dance', start: 10.65, end: 13.2, fill: '#A8E3D6', border: '#3FA894'},
];

/** 剪掉 boring 后，后续片段左移的秒数 */
export const SNIP_SHIFT = 3.0;
