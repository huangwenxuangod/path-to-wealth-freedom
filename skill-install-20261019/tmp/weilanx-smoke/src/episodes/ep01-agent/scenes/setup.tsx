import React from 'react';
import {easeInOut, easeOut, lerp, prog} from '../../../library/anim';
import {C} from '../../../library/theme';
import {Char} from '../../../library/character/Char';
import {ce, cf, cw} from '../cues';
import {FONT_CODE} from '../../../library/fonts';
import {Bulb, CheckBox, Folder, PlainFile, Stamp, ToolIcon, UserFace, VideoFile, type ToolKind} from '../../../library/icons';
import {Card, Marker, Pop, txt} from '../../../library/ui';
import {Laptop} from '../../../library/items/objects';
import type {SfxCue} from '../../../library/types';

/* ---------------- S4 任务：整理桌面 ---------------- */

export const S4Desktop: React.FC<{f: number}> = ({f}) => (
  <>
    <Pop f={f} at={cf(16) - 6} x={60} y={30} dur={12}>
      <Laptop w={960} h={620}>
        <Pop f={f} at={cf(16) + 4} x={30} y={50} rot={-6}>
          <PlainFile name="截图(1).png" size={80} color="#FFD2CC" />
        </Pop>
        <Pop f={f} at={cf(16) + 12} x={740} y={40} rot={4}>
          <Folder name="新建文件夹(3)" size={100} />
        </Pop>
        <Pop f={f} at={cf(17)} x={760} y={380} rot={7}>
          <PlainFile name="未命名.docx" size={80} />
        </Pop>
        <Pop f={f} at={cw(18, '学习资料')} x={50} y={310} enter="drop" rot={-3}>
          <VideoFile name="学习资料.mp4" size={120} />
        </Pop>
        <Pop f={f} at={cf(19)} x={320} y={120} enter="drop" rot={4}>
          <VideoFile name="学习资料二.mp4" size={120} />
        </Pop>
        <Pop f={f} at={cw(20, '学习资料')} x={500} y={330} enter="drop" rot={-5}>
          <VideoFile name="学习资料三.mp4" size={120} />
        </Pop>
      </Laptop>
    </Pop>
    <Pop f={f} at={cf(21)} x={120} y={760} enter="up">
      <Card w={840} h={300} bg="#FFF3B8" style={{position: 'relative'}}>
        <div style={txt(50)}>任务目标</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 24}}>
          <CheckBox p={0} />
          <div style={txt(46)}>按项目整理好</div>
        </div>
        {f >= cw(22, '重复') - 6 && (
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 18}}>
            <CheckBox p={0} />
            <div style={txt(46)}>
              找出<Marker p={prog(f, cw(22, '重复'), 10)}>重复文件</Marker>
            </div>
          </div>
        )}
      </Card>
    </Pop>
  </>
);

export const S4Sfx: SfxCue[] = [
  ['whoosh', cf(16) - 6, 0.4],
  ['pop', cf(16) + 4, 0.35],
  ['pop', cf(16) + 12, 0.35],
  ['pop', cf(17), 0.35],
  ['boing', cw(18, '学习资料') + 6, 0.35],
  ['boing', cf(19) + 6, 0.35],
  ['boing', cw(20, '学习资料') + 6, 0.35],
  ['paper', cf(21), 0.45],
  ['pop', cw(22, '重复') - 6, 0.4],
];

/* ---------------- S5 只会动嘴 ---------------- */

const ADVICE = [
  {at: cf(23) + 8, text: '你可以先新建一个文件夹～'},
  {at: cf(24), text: '再把视频按项目拖进去～'},
  {at: cw(24, '告诉'), text: '最后删掉重复的就好啦～'},
];

export const S5TalkOnly: React.FC<{f: number}> = ({f}) => {
  const jitter = (i: number) => Math.sin(f * 0.9 + i * 2) * 2;
  return (
    <>
      <Pop f={f} at={cf(23) - 6} x={250} y={20} dur={12}>
        <Laptop w={580} h={360}>
          {['学习资料.mp4', '学习资料二.mp4', '学习资料三.mp4'].map((n, i) => (
            <div key={n} style={{position: 'absolute', left: 30 + i * 175, top: 90 + (i % 2) * 60, transform: `rotate(${jitter(i)}deg)`}}>
              <VideoFile name={n} size={70} />
            </div>
          ))}
        </Laptop>
      </Pop>
      <Pop f={f} at={cf(24) + 6} x={540} y={450} center rot={-4}>
        <div style={{...txt(40, C.inkSoft), background: C.white, border: `3px dashed ${C.inkSoft}`, borderRadius: 12, padding: '4px 18px'}}>文件：纹丝不动</div>
      </Pop>
      <Char f={f} x={230} y={1060} s={1.05} kind="bot" talk />
      {ADVICE.map((a, i) => (
        <Pop key={i} f={f} at={a.at} x={380} y={560 + i * 140} enter="left">
          <div style={{...txt(42), background: C.white, border: `4px solid ${C.ink}`, borderRadius: '8px 28px 28px 28px', padding: '12px 26px', boxShadow: '4px 5px 0 rgba(43,35,32,0.12)'}}>{a.text}</div>
        </Pop>
      ))}
      <Pop f={f} at={cw(24, '整理')} x={790} y={1010} center rot={-10} dur={6}>
        <Stamp text="只会动嘴" size={62} color="#7E7A72" />
      </Pop>
    </>
  );
};

export const S5Sfx: SfxCue[] = [
  ...ADVICE.map((a) => ['pop', a.at, 0.4] as SfxCue),
  ['stamp', cw(24, '整理'), 0.6],
];

/* ---------------- S6 第一步：接上工具 ---------------- */

const TOOLS: {kind: ToolKind; name: string; code: string; at: number; x: number; y: number}[] = [
  {kind: 'readFile', name: '读取文件', code: 'read_file', at: cw(27, '读取文件'), x: 60, y: 40},
  {kind: 'mkdir', name: '创建文件夹', code: 'create_folder', at: cw(28, '创建文件夹'), x: 560, y: 40},
  {kind: 'readVideo', name: '读取视频', code: 'read_video', at: cw(28, '读取视频'), x: 60, y: 300},
  {kind: 'moveFile', name: '移动文件', code: 'move_file', at: cw(29, '移动文件'), x: 560, y: 300},
];

const AGENT6 = {x: 540, y: 1060, s: 1.25};

export const S6Tools: React.FC<{f: number}> = ({f}) => {
  const top = {x: AGENT6.x, y: AGENT6.y - 157 * AGENT6.s};
  const flex = f >= cf(25) && f < cf(26) + 10 ? Math.abs(Math.sin((f - cf(25)) * 0.25)) : 0;
  return (
    <>
      <svg width={1080} height={1100} style={{position: 'absolute', left: 0, top: 0}}>
        {TOOLS.map((t) => {
          const p = prog(f, t.at + 6, 12, easeInOut);
          if (p <= 0) return null;
          const sx = t.x + 210;
          const sy = t.y + 220;
          const d = `M${sx} ${sy} C ${sx} ${sy + 160}, ${top.x + (sx - top.x) * 0.2} ${top.y - 180}, ${top.x + (sx < 540 ? -40 : 40)} ${top.y}`;
          return <path key={t.kind} d={d} pathLength={1} fill="none" stroke={C.ink} strokeWidth={7} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />;
        })}
      </svg>
      {TOOLS.map((t) => (
        <Pop key={t.kind} f={f} at={t.at} x={t.x} y={t.y} enter="drop">
          <Card w={420} h={220} bg={C.white} style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <ToolIcon kind={t.kind} size={110} />
            <div>
              <div style={txt(50)}>{t.name}</div>
              <div style={{fontFamily: FONT_CODE, fontSize: 30, color: C.teal}}>{t.code}()</div>
            </div>
          </Card>
        </Pop>
      ))}
      <Pop f={f} at={cw(29, '等等')} x={540} y={580} center>
        <div style={{...txt(40, C.inkSoft), border: `3px dashed ${C.inkSoft}`, borderRadius: 30, padding: '4px 26px', background: C.white}}>+ 更多工具…</div>
      </Pop>
      <Pop f={f} at={cf(25)} out={cf(26) + 20} x={820} y={690} rot={8}>
        <div style={{...txt(64, C.orange), WebkitTextStroke: `3px ${C.ink}`, paintOrder: 'stroke fill'}}>动手！</div>
      </Pop>
      <Char f={f} x={AGENT6.x} y={AGENT6.y} s={AGENT6.s} armsUp={flex} eyes={f >= cw(29, '移动文件') ? 'happy' : 'open'} lookX={0} />
    </>
  );
};

export const S6Sfx: SfxCue[] = [
  ['pop', cf(25), 0.45],
  ...TOOLS.flatMap((t) => [['whoosh', t.at - 4, 0.25], ['click', t.at + 18, 0.5]] as SfxCue[]),
  ['pop', cw(29, '等等'), 0.35],
];

/* ---------------- S7 第二步：写个程序 + 说明书 ---------------- */

const CODE = ['while 任务没完成:', '    想想下一步()', '    调用工具()', '    看看结果()'];
const MANUAL: [string, string, string][] = [
  ['read_file', '路径', '读取文件内容'],
  ['create_folder', '名字', '创建文件夹'],
  ['read_video', '路径', '看看视频讲了什么'],
  ['move_file', '从, 到', '把文件挪过去'],
];

export const S7Program: React.FC<{f: number}> = ({f}) => {
  const typeStart = cf(32) + 4;
  const total = CODE.join('').length;
  const typed = Math.floor(lerp(0, total, prog(f, typeStart, ce(33) - typeStart)));
  let budget = typed;
  const paramsP = prog(f, cf(36), 16, easeOut);
  const bulb = f >= cf(38);
  const agentEyes = bulb ? 'happy' : f >= cf(31) ? 'wide' : 'open';
  return (
    <>
      <Pop f={f} at={cf(32) - 4} x={60} y={10} enter="down">
        <Card w={960} h={330} pad={0} bg="#2B2F36" style={{overflow: 'hidden'}}>
          <div style={{height: 54, background: '#3A3F48', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderBottom: `4px solid ${C.ink}`}}>
            {[C.red, C.yellow, '#3DAA6B'].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c, border: `2px solid ${C.ink}`}} />)}
            <div style={{fontFamily: FONT_CODE, fontSize: 30, color: '#C9D1D9', marginLeft: 16}}>agent.py — 指导模型干活的程序</div>
          </div>
          <div style={{padding: '14px 30px'}}>
            {CODE.map((line, i) => {
              const shown = line.slice(0, Math.max(0, budget));
              budget -= line.length;
              const kw = shown.startsWith('while');
              return (
                <div key={i} style={{fontFamily: FONT_CODE, fontSize: 44, lineHeight: 1.35, color: kw ? '#F2C230' : '#9FE3D2', whiteSpace: 'pre'}}>
                  {shown}
                  {budget < 0 && budget > -line.length - 1 && Math.floor(f / 8) % 2 === 0 ? '▌' : ''}
                </div>
              );
            })}
          </div>
        </Card>
      </Pop>
      <Pop f={f} at={cf(34)} x={40} y={370} enter="up">
        <Card w={720} h={470} bg="#FFF8E6">
          <div style={{...txt(48), marginBottom: 14}}>工具说明书</div>
          {MANUAL.map(([fn, params, desc], i) => {
            const at = cf(35) + i * 8;
            if (f < at) return null;
            const p = prog(f, at, 8, easeOut);
            return (
              <div key={fn} style={{display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
                <span style={{fontFamily: FONT_CODE, fontSize: 36, color: C.teal}}>
                  {fn}(<Marker p={paramsP}>{params}</Marker>)
                </span>
                <span style={txt(32, '#5A524A')}>{desc}</span>
              </div>
            );
          })}
        </Card>
      </Pop>
      <Pop f={f} at={cf(37)} x={60} y={870} enter="left" style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <UserFace size={110} f={f} />
        <div style={{...txt(44), background: '#BFE7DF', border: `4px solid ${C.ink}`, borderRadius: '28px 28px 28px 8px', padding: '12px 26px'}}>帮我整理一下桌面</div>
      </Pop>
      <Char f={f} x={900} y={1080} s={0.95} eyes={agentEyes} lookX={f >= cf(34) && !bulb ? -1 : 0} armsUp={bulb ? 0.4 : 0} />
      <Pop f={f} at={cf(31)} out={cf(38) - 4} x={900} y={780} center>
        <div style={{...txt(110, C.ink), transform: `rotate(${Math.sin(f * 0.3) * 10}deg)`}}>?</div>
      </Pop>
      <Pop f={f} at={cf(38)} x={900} y={740} center>
        <Bulb size={110} glow={0.6 + 0.4 * Math.abs(Math.sin(f * 0.2))} />
      </Pop>
    </>
  );
};

export const S7Sfx: SfxCue[] = [
  ['question', cf(31), 0.4],
  ['pop', cf(32) - 4, 0.35],
  ['type', cf(32) + 4, 0.35],
  ['type', cf(32) + 30, 0.35],
  ['type', cf(33), 0.35],
  ['paper', cf(34), 0.5],
  ...MANUAL.map((_, i) => ['click', cf(35) + i * 8, 0.35] as SfxCue),
  ['pop', cf(37), 0.45],
  ['ding', cf(38), 0.45],
];
