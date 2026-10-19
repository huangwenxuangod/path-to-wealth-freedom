import React from 'react';
import {clamp01, rand} from '../anim';
import {DotPattern} from './stage';
import {H, HF, chunky, dropIn, misprint, popScale, slamScale} from './theme';

/**
 * 网点档案风的道具：印章、身高尺、名牌、网点大号数字、档案信息、证据卡、便签、数码钟、文件夹、对话框、拟声框、文档窗口、月亮、速度线。
 * 统一画法：藏青粗描边（4～6px）+ 平涂 + 硬投影（错版色）；需要阴影的地方填网点，不用渐变。
 */

/** 斑驳油墨的遮罩：噪点打出不规则的缺墨小洞（印章、旧标签用） */
const inkMask = (seed: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' seed='${seed}'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.1'/></filter><rect width='400' height='400' filter='url(#n)'/></svg>`,
  )}")`;

/**
 * 橡皮印章：双线边框 + 粗黑体字，at 帧从 1.7 倍半透明砸下（5 帧落定），油墨斑驳。
 * size 是字号；rot 倾斜角；color 默认印章红。砸下的抖动和彩纸由场景自己加（`shake` / `Confetti`）。
 */
export const RubberStamp: React.FC<{f: number; at: number; text: string; size?: number; rot?: number; color?: string; seed?: number}> = ({f, at, text, size = 120, rot = -10, color = H.red, seed = 2}) => {
  if (f < at) return null;
  const {s, o} = slamScale(f, at);
  const mask = inkMask(seed);
  return (
    <div style={{display: 'inline-block', transform: `rotate(${rot}deg) scale(${s})`, opacity: o}}>
      <div
        style={{
          padding: size * 0.06,
          border: `${size * 0.07}px solid ${color}`,
          borderRadius: size * 0.12,
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskSize: '400px 400px',
          maskSize: '400px 400px',
        }}
      >
        <div
          style={{
            padding: `${size * 0.04}px ${size * 0.2}px ${size * 0.08}px`,
            border: `${size * 0.03}px solid ${color}`,
            borderRadius: size * 0.06,
            fontFamily: HF.sans,
            fontSize: size,
            lineHeight: 1.1,
            color,
            whiteSpace: 'nowrap',
            letterSpacing: size * 0.04,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/** 身高尺：每 10 一条横线、每 20 标数字（左右两侧等宽字），右上角单位；from/to 是刻度范围 */
export const HeightChart: React.FC<{top?: number; bottom?: number; x0?: number; x1?: number; from?: number; to?: number; unit?: string}> = ({top = 165, bottom = 905, x0 = 145, x1 = 1775, from = 0, to = 80, unit = 'cm'}) => {
  const n = (to - from) / 10;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: n + 1}, (_, i) => {
        const v = from + i * 10;
        const y = bottom - ((bottom - top) * i) / n;
        const major = v % 20 === 0;
        return (
          <g key={i}>
            <line x1={x0} x2={x1} y1={y} y2={y} stroke={H.rule} strokeWidth={major ? 3 : 1.6} opacity={major ? 0.9 : 0.6} />
            {major && (
              <>
                <text x={x0 - 52} y={y + 9} fontFamily={HF.mono} fontWeight={700} fontSize={26} fill={H.inkSoft} textAnchor="middle">
                  {v}
                </text>
                <text x={x1 + 52} y={y + 9} fontFamily={HF.mono} fontWeight={700} fontSize={26} fill={H.inkSoft} textAnchor="middle">
                  {v}
                </text>
              </>
            )}
          </g>
        );
      })}
      <text x={x1 + 52} y={top - 32} fontFamily={HF.mono} fontSize={20} fill={H.inkSoft} textAnchor="middle">
        {unit}
      </text>
    </svg>
  );
};

/** 名牌：藏青板子 + 等宽大字名字 + 两行小字（值可以高亮成黄 / 粉），略歪 */
export const NamePlate: React.FC<{name: string; rows?: [string, string, ('yellow' | 'pink')?][]; w?: number; rot?: number}> = ({name, rows = [], w = 500, rot = -1.5}) => (
  <div
    style={{
      width: w,
      padding: '18px 26px 20px',
      background: H.ink,
      borderRadius: 8,
      transform: `rotate(${rot}deg)`,
      textAlign: 'center',
      boxShadow: `0 8px 0 rgba(28,35,64,0.25)`,
    }}
  >
    <div style={{fontFamily: HF.mono, fontWeight: 700, fontSize: 52, color: H.paperLight, letterSpacing: 2}}>{name}</div>
    {rows.map(([k, v, hl], i) => (
      <div key={i} style={{fontFamily: HF.sans, fontSize: 26, color: H.paperLight, marginTop: i === 0 ? 4 : 0}}>
        {k}
        <span style={{fontFamily: /[A-Za-z0-9-]/.test(v) && !hl ? HF.mono : HF.sans, color: hl === 'yellow' ? H.yellow : hl === 'pink' ? H.pink : H.paperLight}}>{v}</span>
      </div>
    ))}
  </div>
);

/**
 * 网点大号数字：圆胖数字，底色 base（可省略）+ 网点填充 dot；章节号「01」「03」压在道具后面。
 * size 是字号；base 省略时只有网点（更轻，像粉红的「3」）。
 */
export const BigNumeral: React.FC<{text: string; size?: number; dot: string; base?: string; id: string; step?: number}> = ({text, size = 620, dot, base, id, step}) => {
  const w = size * 0.62 * text.length;
  const st = step ?? Math.round(size / 34);
  return (
    <svg width={w} height={size * 0.95} style={{overflow: 'visible'}}>
      <defs>
        <DotPattern id={id} color={dot} step={st} r={st * 0.32} />
      </defs>
      {base && (
        <text x={w / 2} y={size * 0.82} textAnchor="middle" fontFamily={HF.round} fontSize={size} fill={base} stroke={base} strokeWidth={size / 18} strokeLinejoin="round">
          {text}
        </text>
      )}
      <text x={w / 2} y={size * 0.82} textAnchor="middle" fontFamily={HF.round} fontSize={size} fill={`url(#${id})`} stroke={`url(#${id})`} strokeWidth={size / 18} strokeLinejoin="round">
        {text}
      </text>
    </svg>
  );
};

/** 前科式大数字：粉红小标 + 圆胖大数字 + 一行说明；value 可以传正在数的数字 */
export const StatBlock: React.FC<{label: string; value: string; caption: string; size?: number}> = ({label, value, caption, size = 120}) => (
  <div>
    <div style={{fontFamily: HF.sans, fontSize: 26, color: H.pink}}>{label}</div>
    <div style={{fontFamily: HF.round, fontSize: size, lineHeight: 1.05, ...chunky(H.ink, size / 26)}}>{value}</div>
    <div style={{fontFamily: HF.sans, fontSize: 30, color: H.ink, marginTop: 6}}>{caption}</div>
  </div>
);

/** 档案信息块：粉红小标（中文 · 英文）+ 衬线西文名字 + 几行「键：值」（值可高亮粉红） */
export const ProfileBlock: React.FC<{label: string; name: string; rows: [string, string, boolean?][]}> = ({label, name, rows}) => (
  <div>
    <div style={{fontFamily: HF.sans, fontSize: 24, color: H.pink, letterSpacing: 1}}>{label}</div>
    <div style={{fontFamily: HF.latinSerif, fontSize: 64, color: H.ink, lineHeight: 1.15}}>{name}</div>
    {rows.map(([k, v, hl], i) => (
      <div key={i} style={{fontFamily: HF.sans, fontSize: 34, color: H.ink, lineHeight: 1.45}}>
        {k}
        <span style={{color: hl ? H.pink : H.ink}}>{v}</span>
      </div>
    ))}
  </div>
);

/** 图钉：红色圆头 + 高光 */
const Pin: React.FC<{color?: string}> = ({color = H.red}) => (
  <svg width={36} height={36} style={{position: 'absolute', left: '50%', top: -18, marginLeft: -18}}>
    <circle cx={18} cy={18} r={13} fill={color} stroke={H.ink} strokeWidth={3} />
    <circle cx={14} cy={14} r={4} fill="#fff" opacity={0.7} />
  </svg>
);

/** 证据卡：白卡 + 藏青描边 + 硬投影 + 顶部图钉，里面一块色底放图标，下面一行标签；at 帧从上方落下、旋转回到 rot */
export const EvidenceCard: React.FC<{f: number; at: number; color: string; label: string; rot?: number; w?: number; children?: React.ReactNode}> = ({f, at, color, label, rot = -4, w = 300, children}) => {
  if (f < at) return null;
  const d = dropIn(f, at);
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        padding: `${w * 0.07}px ${w * 0.07}px ${w * 0.04}px`,
        background: H.paperLight,
        border: `4px solid ${H.ink}`,
        borderRadius: 6,
        boxShadow: `8px 10px 0 rgba(28,35,64,0.35)`,
        transform: `translateY(${d.y}px) rotate(${rot + (rot >= 0 ? d.rot : -d.rot)}deg)`,
        opacity: d.o,
      }}
    >
      <Pin />
      <div style={{height: w * 0.62, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
      <div style={{fontFamily: HF.sans, fontSize: w * 0.11, color: H.ink, textAlign: 'center', marginTop: w * 0.04}}>{label}</div>
    </div>
  );
};

/** 便签：黄方块 + 藏青描边，一行圆胖大字 + 一行粉红小字，at 帧弹入、歪着贴 */
export const StickyNote: React.FC<{f: number; at: number; title: string; sub?: string; rot?: number; w?: number}> = ({f, at, title, sub, rot = 7, w = 220}) => {
  if (f < at) return null;
  const {s, o} = popScale(f, at, 7, 0.4);
  return (
    <div
      style={{
        width: w,
        padding: '18px 10px 16px',
        background: H.yellow,
        border: `4px solid ${H.ink}`,
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: o,
        textAlign: 'center',
        boxShadow: `6px 6px 0 rgba(28,35,64,0.3)`,
      }}
    >
      <div style={{fontFamily: HF.round, fontSize: w * 0.24, lineHeight: 1.1, ...chunky(H.ink, 2)}}>{title}</div>
      {sub && <div style={{fontFamily: HF.sans, fontSize: w * 0.13, color: H.red, marginTop: 4}}>{sub}</div>}
    </div>
  );
};

/** 数码钟：藏青盒子 + 纸色描边 + 粉红等宽数字，冒号每 15 帧闪一次 */
export const DigitalClock: React.FC<{f: number; text: string; size?: number; color?: string}> = ({f, text, size = 110, color = H.pink}) => {
  const on = Math.floor(f / 15) % 2 === 0;
  return (
    <div style={{display: 'inline-block', padding: `${size * 0.1}px ${size * 0.22}px`, background: H.ink, border: `5px solid ${H.paper}`, borderRadius: size * 0.14, fontFamily: HF.mono, fontWeight: 700, fontSize: size, lineHeight: 1.1, color}}>
      {[...text].map((ch, i) => (
        <span key={i} style={{opacity: ch === ':' && !on ? 0 : 1}}>
          {ch}
        </span>
      ))}
    </div>
  );
};

/** 案卷文件夹：黄色牛皮纸夹 + 后片的小耳朵 + 白色标签（等宽字两行）；children 放在文件夹上沿（比如睡着的嫌疑人） */
export const CaseFolder: React.FC<{w?: number; lines: string[]; children?: React.ReactNode}> = ({w = 700, lines, children}) => {
  const h = w * 0.46;
  return (
    <div style={{position: 'relative', width: w, height: h + 40}}>
      <svg width={w} height={h + 40} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M6 30 L${w * 0.04} 30 L${w * 0.04} 10 L${w - 10} 10 L${w - 10} ${h + 30} L6 ${h + 30} Z`} fill="#d99a20" stroke={H.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M4 40 L${w - 4} 34 L${w - 2} ${h + 36} L8 ${h + 36} Z`} fill={H.yellow} stroke={H.ink} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: w * 0.08, top: h * 0.55, padding: '10px 18px', background: H.paperLight, border: `3px solid ${H.ink}`, fontFamily: HF.mono, fontWeight: 700, fontSize: w * 0.04, color: H.ink, lineHeight: 1.35}}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {children && <div style={{position: 'absolute', left: 0, top: 0, width: w}}>{children}</div>}
    </div>
  );
};

/** 对话框：纸白圆角框 + 藏青粗描边 + 硬投影，尾巴朝左下（tail 设 x 偏移）；children 是内容 */
export const Bubble: React.FC<{w?: number; tail?: number; children: React.ReactNode}> = ({w = 640, tail = 60, children}) => (
  <div style={{position: 'relative', width: w}}>
    <div style={{padding: '24px 34px', background: H.paperLight, border: `5px solid ${H.ink}`, borderRadius: 22, boxShadow: `8px 8px 0 ${H.ink}`, fontFamily: HF.sans, fontSize: 36, color: H.ink, textAlign: 'center', lineHeight: 1.45}}>{children}</div>
    <svg width={80} height={60} style={{position: 'absolute', left: tail, bottom: -52}}>
      <path d="M8 0 L4 54 L54 0" fill={H.paperLight} stroke={H.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={2} y={-6} width={60} height={9} fill={H.paperLight} />
    </svg>
  </div>
);

/** 拟声爆炸框：黄色锯齿星 + 藏青描边 + 粉红粗字（「咕嘟！」「哐！」），at 帧弹出后轻轻抖 */
export const BurstLabel: React.FC<{f: number; at: number; text: string; size?: number; rot?: number; color?: string}> = ({f, at, text, size = 200, rot = -12, color = H.yellow}) => {
  if (f < at) return null;
  const {s, o} = popScale(f, at, 6, 0.2);
  const jig = Math.sin((f - at) * 1.3) * 2;
  const n = 14;
  const pts = Array.from({length: n * 2}, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = (i % 2 ? 0.34 : 0.5) * size * (0.92 + rand(i + 9) * 0.16);
    return `${size / 2 + Math.cos(a) * r * 1.25},${size / 2 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <div style={{position: 'relative', width: size * 1.25, height: size, transform: `rotate(${rot + jig}deg) scale(${s})`, opacity: o}}>
      <svg width={size * 1.3} height={size} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <polygon points={pts} transform={`translate(${size * 0.02} 0)`} fill={color} stroke={H.ink} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF.sans, fontSize: size * 0.26, color: H.red, textShadow: misprint(H.ink, 3)}}>{text}</div>
    </div>
  );
};

/** 文档窗口：钴蓝标题栏（三个圆点 + 文件名）+ 几条灰色占位行 + 正在打字的一行（粉红光标闪）；typed 是 0–1 的打字进度 */
export const DocWindow: React.FC<{f: number; title: string; text: string; typed: number; w?: number; h?: number}> = ({f, title, text, typed, w = 760, h = 440}) => {
  const shown = text.slice(0, Math.round(text.length * clamp01(typed)));
  const on = Math.floor(f / 12) % 2 === 0;
  return (
    <div style={{width: w, height: h, background: H.paperLight, border: `6px solid ${H.ink}`, borderRadius: 14, overflow: 'hidden', boxShadow: `10px 10px 0 rgba(28,35,64,0.25)`}}>
      <div style={{height: 46, background: H.blue, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10}}>
        {[H.red, H.yellow, '#3fb59b'].map((c) => (
          <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
        ))}
        <div style={{flex: 1, textAlign: 'center', fontFamily: HF.sans, fontSize: 22, color: H.paperLight, marginRight: 60}}>{title}</div>
      </div>
      <div style={{padding: '30px 40px'}}>
        {[0.9, 0.75, 0.55].map((k, i) => (
          <div key={i} style={{width: `${k * 100}%`, height: 13, borderRadius: 7, background: '#d6d1c4', marginBottom: 18}} />
        ))}
        <div style={{fontFamily: HF.mono, fontWeight: 700, fontSize: 36, color: H.ink, marginTop: 26, wordBreak: 'break-all', lineHeight: 1.3}}>
          {shown}
          <span style={{display: 'inline-block', width: 16, height: 38, background: H.pink, verticalAlign: 'middle', opacity: on ? 1 : 0}} />
        </div>
      </div>
    </div>
  );
};

/** 网点月亮：明黄圆 + 右下半边橙色网点阴影 + 藏青细描边 */
export const Moon: React.FC<{r?: number; id?: string}> = ({r = 110, id = 'ht-moon'}) => (
  <svg width={r * 2 + 10} height={r * 2 + 10}>
    <defs>
      <DotPattern id={id} color={H.orange} step={14} r={4.2} />
      <clipPath id={`${id}-c`}>
        <circle cx={r + 5} cy={r + 5} r={r} />
      </clipPath>
    </defs>
    <circle cx={r + 5} cy={r + 5} r={r} fill={H.yellow} />
    <g clipPath={`url(#${id}-c)`}>
      <circle cx={r * 1.55 + 5} cy={r * 1.45 + 5} r={r * 1.05} fill={`url(#${id})`} opacity={0.85} />
    </g>
    <circle cx={r + 5} cy={r + 5} r={r} fill="none" stroke={H.paper} strokeWidth={3} opacity={0.5} />
  </svg>
);

/** 速度线：一组往左拖的横线，长度轻轻闪动（嫌疑人跑过去时挂在身后） */
export const SpeedLines: React.FC<{f: number; n?: number; len?: number; gap?: number; color?: string}> = ({f, n = 5, len = 220, gap = 22, color = H.paper}) => (
  <svg width={len + 20} height={n * gap + 10}>
    {Array.from({length: n}, (_, i) => {
      const k = 0.55 + 0.45 * Math.abs(Math.sin(f / 3 + i * 1.7));
      const l = len * k * (i % 2 ? 0.75 : 1);
      return <line key={i} x1={len + 10 - l} x2={len + 10} y1={6 + i * gap} y2={6 + i * gap} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
    })}
  </svg>
);
