import {easeInOut, easeIn, easeOut, easeOutBack, keyframes, lerp, prog} from '../../../library/anim';
import {CLIPS, FPS, GEO, PX_PER_SEC, SNIP_SHIFT, T, timeToX, type ClipDef, type SceneId} from './timeline';
import {getBuddy} from './buddy';

export type Tab = 'media' | 'transitions' | 'text';
export type PhoneScene = 'empty' | SceneId | 'export';

export interface ClipView extends ClipDef {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  opacity: number;
  visible: boolean;
}

export interface IconView {
  kind: 'spin' | 'whoosh';
  x: number;
  y: number;
  scale: number;
  visible: boolean;
}

export interface EditorState {
  timecode: string;
  tab: Tab;
  tabSwitchT: number; // 距离最近一次切 tab 的帧数，用于弹跳
  phone: PhoneScene;
  phoneSceneT: number; // 当前手机画面已显示的帧数
  phoneShake: number;
  clips: ClipView[];
  audioTrack: number;
  playheadX: number;
  boringLabel: number;
  icons: IconView[];
  textClip: number;
  captionT: number; // <0 表示还没开始打字
  sliders: {sparkle: number; shake: number; zoom: number; speed: number};
  shakeMax: boolean;
  exportProgress: number;
  done: boolean;
  keyMarkers: number;
  uiFade: number;
}

const sec = (s: number) => Math.round(s * FPS);

/** 媒体库缩略图位置：片段从这里飞进时间轴 */
const THUMB_POS: Record<SceneId, [number, number]> = {
  sunrise: [85, 175],
  coffee: [255, 175],
  cat: [85, 318],
  dance: [255, 318],
  boring: [700, -160],
};

const LAND: Record<SceneId, number> = {
  sunrise: T.dropSunrise,
  coffee: T.dropCoffee,
  boring: T.dropRest,
  cat: T.dropRest + 5,
  dance: T.dropRest + 10,
};
const FLY = 12;

const clipView = (def: ClipDef, frame: number): ClipView => {
  const h = GEO.videoTrack.h;
  const y0 = GEO.videoTrack.y;
  const shiftP = def.id === 'cat' || def.id === 'dance' ? prog(frame, T.closeGap, 14, easeOutBack) : 0;
  const slotX = timeToX(def.start) - shiftP * SNIP_SHIFT * PX_PER_SEC;
  const w = (def.end - def.start) * PX_PER_SEC;
  const base = {...def, w, h, opacity: 1};

  // 咖啡片段被小人拖着走
  if (def.id === 'coffee' && frame >= T.dragCoffee && frame < T.dropCoffee) {
    const b = getBuddy(frame);
    return {...base, x: b.x + 40, y: GEO.groundY - 150, rot: -12 + Math.sin(frame * 0.4) * 3, visible: true};
  }
  if (def.id === 'coffee' && frame >= T.dropCoffee) {
    const p = prog(frame, T.dropCoffee, 6, easeIn);
    const b = getBuddy(T.dropCoffee - 1);
    return {...base, x: lerp(b.x + 40, slotX, p), y: lerp(GEO.groundY - 150, y0, p), rot: lerp(-12, 0, p), visible: true};
  }

  const land = LAND[def.id];
  if (def.id !== 'coffee' && frame >= land - FLY && frame < land) {
    const p = prog(frame, land - FLY, FLY, easeInOut);
    const [tx, ty] = THUMB_POS[def.id];
    const arc = Math.sin(p * Math.PI) * 140;
    return {...base, x: lerp(tx, slotX, p), y: lerp(ty, y0, p) - arc, rot: (1 - p) * 10, visible: true, opacity: Math.min(1, p * 4)};
  }
  if (frame < land) return {...base, x: slotX, y: y0, rot: 0, visible: false};

  // boring 片段被剪掉后掉下去
  if (def.id === 'boring' && frame >= T.snip + 2) {
    const p = prog(frame, T.snip + 2, 14, easeIn);
    return {...base, x: slotX + p * 30, y: y0 + p * 260, rot: p * 18, visible: p < 1, opacity: 1 - p};
  }
  // 落地后小小回弹
  const bounce = Math.sin(prog(frame, land, 8) * Math.PI) * -10;
  return {...base, x: slotX, y: y0 + bounce, rot: 0, visible: true};
};

const clipsAt = (frame: number) => CLIPS.map((c) => clipView(c, frame));

/** 播放头所在的片段 */
const sceneUnder = (x: number, clips: ClipView[]): SceneId => {
  const live = clips.filter((c) => c.visible && c.opacity > 0.5);
  for (const c of live) if (x >= c.x && x < c.x + c.w) return c.id;
  return live.length ? live[live.length - 1].id : 'sunrise';
};

const playheadSec = (frame: number) =>
  keyframes(frame, [
    [T.dropRest + 10, 0],
    [T.snip, 3.2],
    [T.muchCleaner, 3.0],
    [T.dropSpin, 2.3],
    [T.tabText, 5.8],
    [T.panRight + 10, 8.3],
    [T.shakeBack + 20, 8.3],
    [T.playback, 0],
  ], easeInOut);

const PHONE_SCHEDULE: [number, PhoneScene][] = [
  [0, 'empty'],
  [T.dropSunrise + 6, 'sunrise'],
  [sec(3.6), 'coffee'],
  [sec(4.2), 'boring'],
  [T.snip + 6, 'coffee'],
  [sec(9.1), 'sunrise'], // Spin 转场预览：咖啡 → 日出
  [T.tabText, 'cat'],
  [T.panRight + 10, 'dance'],
];

const phoneAt = (frame: number, clips: ClipView[], playheadX: number): [PhoneScene, number] => {
  if (frame >= T.exportClick) return ['export', frame - T.exportClick];
  if (frame >= T.playback) {
    // 回放期间手机跟随播放头
    const scene = sceneUnder(playheadX, clips);
    let start = frame;
    while (start > T.playback && sceneUnder(playheadAt(start - 1), clipsAt(start - 1)) === scene) start--;
    return [scene, frame - start];
  }
  let cur: [number, PhoneScene] = PHONE_SCHEDULE[0];
  for (const e of PHONE_SCHEDULE) if (frame >= e[0]) cur = e;
  return [cur[1], frame - cur[0]];
};

function playheadAt(frame: number) {
  if (frame >= T.playback && frame < T.exportClick) {
    return timeToX(prog(frame, T.playback + 4, T.reachExport - T.playback, easeInOut) * 10.2);
  }
  if (frame >= T.exportClick) return timeToX(prog(frame, T.exportClick, T.exportDone - T.exportClick) * 10.2);
  return timeToX(playheadSec(frame));
}

const timecodeAt = (frame: number) => {
  const ss = Math.floor(frame / FPS);
  const ff = frame % FPS;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:00:${pad(ss)}:${pad(ff)}`;
};

const junctionY = GEO.videoTrack.y + GEO.videoTrack.h / 2;

const iconsAt = (frame: number): IconView[] => {
  const spinPlaced: [number, number] = [timeToX(2.625), junctionY];
  let spin: IconView = {kind: 'spin', x: 0, y: 0, scale: 1, visible: false};
  if (frame >= T.grabSpin && frame < T.dropSpin) {
    const b = getBuddy(frame);
    spin = {kind: 'spin', x: b.x, y: b.y - 200, scale: 1.1, visible: true};
  } else if (frame >= T.dropSpin) {
    const b = getBuddy(T.dropSpin - 1);
    const p = prog(frame, T.dropSpin, 6, easeIn);
    const s = 1 + Math.sin(prog(frame, T.dropSpin + 6, 8) * Math.PI) * 0.25;
    spin = {kind: 'spin', x: lerp(b.x, spinPlaced[0], p), y: lerp(b.y - 200, spinPlaced[1], p), scale: s, visible: true};
  }

  // Whoosh 自己从面板飞到 咖啡|猫 交界处
  const whooshTo: [number, number] = [timeToX(5.025), junctionY];
  let whoosh: IconView = {kind: 'whoosh', x: 0, y: 0, scale: 1, visible: false};
  if (frame >= T.dropWhoosh - 12) {
    const p = prog(frame, T.dropWhoosh - 12, 12, easeInOut);
    const s = 1 + Math.sin(prog(frame, T.dropWhoosh, 8) * Math.PI) * 0.25;
    whoosh = {kind: 'whoosh', x: lerp(145, whooshTo[0], p), y: lerp(232, whooshTo[1], p) - Math.sin(p * Math.PI) * 160, scale: s, visible: true};
  }
  return [spin, whoosh];
};

export function getEditorState(frame: number): EditorState {
  const clips = clipsAt(frame);
  const playheadX = playheadAt(frame);
  const [phone, phoneSceneT] = phoneAt(frame, clips, playheadX);

  const tab: Tab = frame >= T.tabText ? 'text' : frame >= T.tabTransitions ? 'transitions' : 'media';
  const tabSwitchT = frame - (tab === 'text' ? T.tabText : tab === 'transitions' ? T.tabTransitions : 0);

  const sparkle = keyframes(frame, [[T.reachSparkle + 10, 0], [T.reachSparkle + 26, 0.7]], easeInOut);
  const shake = keyframes(frame, [
    [T.reachShake + 6, 0],
    [T.shakeMax, 1],
    [T.shakeBack, 1],
    [T.shakeBack + 6, 0.05],
  ], easeOut);
  const zoom = keyframes(frame, [[T.reachZoom + 6, 0], [T.reachZoom + 18, 0.6]], easeInOut);

  return {
    timecode: timecodeAt(frame),
    tab,
    tabSwitchT,
    phone,
    phoneSceneT,
    phoneShake: frame >= T.shakeMax && frame < T.shakeBack ? 1 : 0,
    clips,
    audioTrack: prog(frame, T.audioTrack, 15, easeOut),
    playheadX,
    boringLabel: frame < T.snip ? prog(frame, T.boringLabel, 8, easeOutBack) : 1 - prog(frame, T.snip, 4),
    icons: iconsAt(frame),
    textClip: prog(frame, T.textClip, 12, easeOutBack),
    captionT: frame - T.typeCaption,
    sliders: {sparkle, shake, zoom, speed: 0.33},
    shakeMax: frame >= T.shakeMax && frame < T.shakeBack,
    exportProgress: prog(frame, T.exportClick, T.exportDone - T.exportClick),
    done: frame >= T.exportDone,
    keyMarkers: Math.floor(prog(frame, T.playback + 8, 45) * 6),
    uiFade: prog(frame, T.outro, 20, easeInOut),
  };
}
