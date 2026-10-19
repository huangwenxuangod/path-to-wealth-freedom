import React from 'react';
import {rand} from '../../library/anim';
import {At, Clipping, HalftonePhoto, Label} from '../../library/vox/props';
import {DeskLitter, People, PostIt, Pushpin, Stamp, Sticker} from '../../library/vox/stickers';
import {step12, V, VF} from '../../library/vox/theme';
import {cf, cw} from './cues';
import {HallArt, ImageGridArt} from './art';
import {Portrait} from '../../library/vox/portrait';
import {LANE, WORLD_W, xy, yx} from './timeline';

/**
 * 桌面上的「旁支材料」：人物照、年代小物件贴纸、冷知识便利贴、桌面杂物。
 * 主线卡片在 film.tsx；这里只往主线卡片之间的空白里塞东西，让每个镜头都像翻一本塞满的剪贴簿。
 * 冷知识全部来自 materials/04-Vox科普/00-AI简史/调研.md。
 */

const P: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => <div style={{position: 'absolute', left: x, top: y, width: 'max-content'}}>{children}</div>;

/** 人物照 + 名牌 */
const Person: React.FC<{x: number; y: number; name: string; note?: string; hair?: 'side' | 'receding' | 'grey' | 'curly' | 'short'; glasses?: boolean; rot?: number; w?: number}> = ({x, y, name, note, hair, glasses, rot = -3, w = 190}) => (
  <P x={x} y={y}>
    <HalftonePhoto w={w} h={w * 1.2} rot={rot} dot={5} caption={name}>
      <Portrait w={w} h={w * 1.2} hair={hair} glasses={glasses} />
    </HalftonePhoto>
    {note && (
      <div style={{fontFamily: VF.serifCn, fontWeight: 700, fontSize: 22, color: V.inkSoft, textAlign: 'center', marginTop: 8, width: w + 28}}>{note}</div>
    )}
  </P>
);

/* ============ 小物件贴纸（扁平、三四个颜色） ============ */

const ink = V.ink;
const red = V.red;

const PunchCard: React.FC = () => (
  <svg width={300} height={140} viewBox="0 0 300 140">
    <path d="M14 0 L300 0 L300 140 L0 140 L0 14 Z" fill="#e9d9a8" />
    {Array.from({length: 10}, (_, r) =>
      Array.from({length: 26}, (_, c) => (rand(r * 31 + c) > 0.82 ? <rect key={`${r}-${c}`} x={14 + c * 10.6} y={14 + r * 12} width={5} height={8} fill={ink} /> : null)),
    )}
    <text x={150} y={134} textAnchor="middle" fontFamily="Courier New" fontSize={10} fill="#8a6d2a">IBM · 80 COLUMN</text>
  </svg>
);

const VacuumTube: React.FC = () => (
  <svg width={90} height={170} viewBox="0 0 90 170">
    <path d="M15 120 L15 40 Q15 6 45 6 Q75 6 75 40 L75 120 Z" fill="#cfe0e3" stroke={ink} strokeWidth={4} />
    <rect x={30} y={40} width={30} height={60} fill="none" stroke={ink} strokeWidth={3} />
    <path d="M38 98 L38 60 L45 52 L52 60 L52 98" fill="none" stroke="#e08a2a" strokeWidth={4} />
    <rect x={10} y={118} width={70} height={26} fill={ink} />
    {[22, 36, 50, 64].map((x) => <rect key={x} x={x} y={144} width={5} height={22} fill="#777" />)}
  </svg>
);

const CalendarPage: React.FC<{top: string; big: string; sub: string}> = ({top, big, sub}) => (
  <div style={{width: 170, background: '#fff', textAlign: 'center', fontFamily: VF.heavy}}>
    <div style={{background: red, color: '#fff', fontSize: 24, padding: '4px 0'}}>{top}</div>
    <div style={{fontFamily: VF.num, fontSize: 84, color: ink, lineHeight: 1.05}}>{big}</div>
    <div style={{fontSize: 22, color: ink, paddingBottom: 8}}>{sub}</div>
  </div>
);

const Terminal: React.FC<{f: number; lines: [string, string][]; from: number}> = ({f, lines, from}) => (
  <div style={{width: 430, background: '#1d1f1c', border: '14px solid #bdb6a6', borderRadius: 10, padding: '16px 18px', fontFamily: `'Courier New', monospace`, fontSize: 21, lineHeight: 1.5, color: '#9fe39a', boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
    {lines.map(([who, t], i) => (
      <div key={i} style={{opacity: f >= from + i * 10 ? 1 : 0, color: who === 'ELIZA' ? '#9fe39a' : '#e9e6d8'}}>
        {who}: {t}
      </div>
    ))}
  </div>
);

const MoneyDown: React.FC = () => (
  <svg width={190} height={150} viewBox="0 0 190 150">
    <path d="M30 60 Q20 40 50 30 L40 10 L90 10 L80 30 Q120 40 110 60 Q130 140 70 140 Q10 140 30 60 Z" fill="#c9b27a" stroke={ink} strokeWidth={4} />
    <text x={70} y={112} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={44} fill={ink}>$</text>
    <path d="M150 20 L150 120 M128 98 L150 124 L172 98" stroke={red} strokeWidth={10} fill="none" strokeLinecap="round" />
  </svg>
);

const Scissors: React.FC = () => (
  <svg width={210} height={120} viewBox="0 0 210 120">
    <rect x={70} y={30} width={140} height={64} fill="#9fbf8f" stroke={ink} strokeWidth={3} />
    <circle cx={140} cy={62} r={18} fill="none" stroke={ink} strokeWidth={3} />
    <path d="M70 30 L120 62 L70 94" fill="#e4dccf" stroke={ink} strokeWidth={3} strokeDasharray="8 6" />
    <circle cx={22} cy={34} r={16} fill="none" stroke={red} strokeWidth={8} />
    <circle cx={22} cy={90} r={16} fill="none" stroke={red} strokeWidth={8} />
    <path d="M34 44 L110 70 M34 80 L110 54" stroke="#7d7d7d" strokeWidth={8} strokeLinecap="round" />
  </svg>
);

const Snowflake: React.FC<{s?: number}> = ({s = 80}) => (
  <svg width={s} height={s} viewBox="-50 -50 100 100">
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`} stroke="#5d86a8" strokeWidth={7} strokeLinecap="round">
        <path d="M0 -44 L0 44 M0 -26 L-12 -38 M0 -26 L12 -38 M0 26 L-12 38 M0 26 L12 38" fill="none" />
      </g>
    ))}
  </svg>
);

const Thermometer: React.FC = () => (
  <svg width={80} height={240} viewBox="0 0 80 240">
    <rect x={26} y={8} width={28} height={180} rx={14} fill="#fff" stroke={ink} strokeWidth={4} />
    <circle cx={40} cy={204} r={28} fill="#5d86a8" stroke={ink} strokeWidth={4} />
    <rect x={33} y={150} width={14} height={50} fill="#5d86a8" />
    {Array.from({length: 7}, (_, i) => <path key={i} d={`M54 ${30 + i * 20} L64 ${30 + i * 20}`} stroke={ink} strokeWidth={3} />)}
  </svg>
);

const Stethoscope: React.FC = () => (
  <svg width={170} height={170} viewBox="0 0 170 170">
    <path d="M40 10 L40 60 Q40 100 75 100 Q110 100 110 60 L110 10" fill="none" stroke={ink} strokeWidth={8} />
    <path d="M75 100 L75 130 Q75 158 110 158 Q140 158 140 128" fill="none" stroke={ink} strokeWidth={8} />
    <circle cx={140} cy={118} r={18} fill="#9a9a9a" stroke={ink} strokeWidth={6} />
    <circle cx={40} cy={10} r={7} fill={red} />
    <circle cx={110} cy={10} r={7} fill={red} />
  </svg>
);

const Wrench: React.FC = () => (
  <svg width={190} height={70} viewBox="0 0 190 70">
    <path d="M40 22 L170 22 Q186 22 186 35 Q186 48 170 48 L40 48 Z" fill="#8f949a" stroke={ink} strokeWidth={4} />
    <path d="M44 35 A30 30 0 1 1 30 8 L22 26 L30 40 L46 40 Z" fill="#8f949a" stroke={ink} strokeWidth={4} />
  </svg>
);

const Floppy: React.FC<{label: string}> = ({label}) => (
  <svg width={150} height={150} viewBox="0 0 150 150">
    <path d="M6 6 L132 6 L144 18 L144 144 L6 144 Z" fill="#2c3440" />
    <rect x={36} y={6} width={74} height={44} fill="#b8bec6" />
    <rect x={84} y={12} width={16} height={32} fill="#2c3440" />
    <rect x={22} y={70} width={106} height={70} fill="#f3efe4" />
    <text x={75} y={110} textAnchor="middle" fontFamily="Courier New" fontWeight={700} fontSize={16} fill={ink}>{label}</text>
  </svg>
);

const Bills: React.FC = () => (
  <svg width={240} height={150} viewBox="0 0 240 150">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 24} ${i * 14}) rotate(${-6 + i * 5} 90 50)`}>
        <rect width={180} height={86} fill="#9fbf8f" stroke={ink} strokeWidth={3} />
        <circle cx={90} cy={43} r={24} fill="none" stroke={ink} strokeWidth={3} />
        <text x={90} y={56} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={34} fill={ink}>$</text>
      </g>
    ))}
  </svg>
);

const TrashBin: React.FC = () => (
  <svg width={170} height={210} viewBox="0 0 170 210">
    {[0, 1, 2].map((i) => (
      <rect key={i} x={40 + i * 26} y={8 + i * 6} width={70} height={46} fill="#eeeded" stroke={ink} strokeWidth={3} transform={`rotate(${-20 + i * 18} ${75 + i * 26} 30)`} />
    ))}
    <path d="M20 60 L150 60 L136 204 L34 204 Z" fill="#6f7479" stroke={ink} strokeWidth={4} />
    {[52, 85, 118].map((x) => <path key={x} d={`M${x} 80 L${x} 186`} stroke="#4b4f53" strokeWidth={6} />)}
  </svg>
);

const DownChart: React.FC = () => (
  <svg width={260} height={190} viewBox="0 0 260 190">
    <rect width={260} height={190} fill="#fff" />
    <path d="M30 20 L30 166 L246 166" stroke={ink} strokeWidth={4} fill="none" />
    <path d="M36 50 L80 40 L120 60 L150 52 L180 140 L236 156" stroke={red} strokeWidth={8} fill="none" strokeLinejoin="round" />
    <path d="M220 140 L238 158 L212 162" stroke={red} strokeWidth={8} fill="none" />
  </svg>
);

const Mug: React.FC = () => (
  <svg width={140} height={160} viewBox="0 0 140 160">
    <path d="M40 40 Q30 20 44 6 M64 40 Q54 20 68 6 M88 40 Q78 20 92 6" stroke="#9a9a9a" strokeWidth={5} fill="none" />
    <path d="M14 52 L104 52 L98 150 L20 150 Z" fill={red} stroke={ink} strokeWidth={4} />
    <path d="M104 72 Q132 72 130 98 Q128 122 100 122" fill="none" stroke={ink} strokeWidth={9} />
  </svg>
);

const ChessKing: React.FC<{fallen?: boolean}> = ({fallen}) => (
  <svg width={130} height={190} viewBox="0 0 130 190" style={{transform: fallen ? 'rotate(-90deg)' : undefined}}>
    <path d="M58 6 L72 6 L72 18 L84 18 L84 30 L72 30 L72 40 L58 40 L58 30 L46 30 L46 18 L58 18 Z" fill={ink} />
    <path d="M34 54 Q30 40 65 40 Q100 40 96 54 L86 70 L44 70 Z" fill={ink} />
    <path d="M44 70 L86 70 L94 150 L36 150 Z" fill={ink} />
    <rect x={22} y={150} width={86} height={22} rx={6} fill={ink} />
    <rect x={14} y={170} width={102} height={16} rx={6} fill={ink} />
  </svg>
);

const Chip: React.FC<{label: string}> = ({label}) => (
  <svg width={190} height={190} viewBox="0 0 190 190">
    {Array.from({length: 8}, (_, i) => (
      <g key={i} fill="#b9a23c">
        <rect x={34 + i * 16} y={4} width={7} height={22} />
        <rect x={34 + i * 16} y={164} width={7} height={22} />
        <rect x={4} y={34 + i * 16} width={22} height={7} />
        <rect x={164} y={34 + i * 16} width={22} height={7} />
      </g>
    ))}
    <rect x={24} y={24} width={142} height={142} rx={8} fill="#2a2d31" />
    <rect x={50} y={50} width={90} height={90} fill="#3f454c" stroke="#7d858e" strokeWidth={3} />
    <text x={95} y={103} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={label.length > 4 ? 18 : 26} fill="#e9e6d8">{label}</text>
  </svg>
);

const GoStones: React.FC = () => (
  <svg width={220} height={110} viewBox="0 0 220 110">
    {[[30, 60, 1], [80, 40, 0], [120, 70, 1], [170, 46, 0], [196, 84, 1]].map(([x, y, b], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y + 6} rx={26} ry={10} fill="rgba(0,0,0,0.25)" />
        <ellipse cx={x} cy={y} rx={26} ry={20} fill={b ? '#151515' : '#f7f7f5'} stroke={ink} strokeWidth={2} />
        <ellipse cx={x - 8} cy={y - 7} rx={7} ry={4} fill={b ? 'rgba(255,255,255,0.3)' : '#fff'} />
      </g>
    ))}
  </svg>
);

const TV: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{width: 280, background: '#3a3a38', borderRadius: 14, padding: 14, boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
    <div style={{height: 160, background: '#cfd6cf', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{children}</div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8}}>
      <div style={{width: 60, height: 10, background: '#666', borderRadius: 4}} />
      <div style={{fontFamily: VF.heavy, fontSize: 18, color: '#e9e6d8'}}>LIVE</div>
    </div>
  </div>
);

const ServerRack: React.FC = () => (
  <svg width={200} height={250} viewBox="0 0 200 250">
    {[0, 1].map((k) => (
      <g key={k} transform={`translate(${k * 100} 0)`}>
        <rect x={6} y={4} width={88} height={242} fill="#24272b" stroke={ink} strokeWidth={3} />
        {Array.from({length: 11}, (_, i) => (
          <g key={i}>
            <rect x={14} y={14 + i * 21} width={72} height={15} fill="#3c4148" />
            <circle cx={76} cy={21 + i * 21} r={3} fill={(i + k) % 3 ? '#7be07b' : red} />
          </g>
        ))}
      </g>
    ))}
  </svg>
);

const Bubble: React.FC<{text: string; me?: boolean}> = ({text, me}) => (
  <div style={{background: me ? '#fff' : '#d9ead3', border: `3px solid ${ink}`, borderRadius: 22, padding: '10px 22px', fontFamily: VF.serifCn, fontWeight: 700, fontSize: 28, color: ink, boxShadow: '3px 5px 0 rgba(23,23,22,0.85)'}}>{text}</div>
);

const Phone: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{width: 200, height: 360, background: '#1b1b1a', borderRadius: 30, padding: '30px 12px', boxSizing: 'border-box', boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
    <div style={{width: '100%', height: '100%', background: '#f7f7f5', borderRadius: 14, padding: 12, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden'}}>{children}</div>
  </div>
);

const Protein: React.FC = () => (
  <svg width={260} height={220} viewBox="0 0 260 220">
    <path d="M20 180 C 40 80, 80 220, 100 120 S 150 20, 170 110 S 220 200, 240 60" fill="none" stroke="#5d86a8" strokeWidth={22} strokeLinecap="round" />
    <path d="M20 180 C 40 80, 80 220, 100 120 S 150 20, 170 110 S 220 200, 240 60" fill="none" stroke="#9cc0dc" strokeWidth={8} strokeLinecap="round" strokeDasharray="14 10" />
    <path d="M40 40 Q90 10 120 50 Q150 90 200 30" fill="none" stroke={red} strokeWidth={14} strokeLinecap="round" />
  </svg>
);

const Globe: React.FC = () => (
  <svg width={210} height={210} viewBox="0 0 210 210">
    <circle cx={105} cy={105} r={96} fill="#9cc0dc" stroke={ink} strokeWidth={5} />
    <path d="M50 50 Q80 40 90 70 Q70 100 90 120 Q60 140 40 110 Q30 80 50 50 Z M120 40 Q170 50 170 90 Q150 100 160 140 Q130 170 120 130 Q110 90 130 80 Q110 60 120 40 Z" fill="#9fbf8f" stroke={ink} strokeWidth={3} />
    <ellipse cx={105} cy={105} rx={40} ry={96} fill="none" stroke={ink} strokeWidth={2} opacity={0.4} />
    <path d="M9 105 L201 105" stroke={ink} strokeWidth={2} opacity={0.4} />
  </svg>
);

/* ============ 按年代摆放（坐标都是桌面世界坐标） ============ */

/** 1950 图灵 */
const Era1950: React.FC<{f: number}> = ({f}) => {
  const x = yx(1950);
  return (
    <>
      <Person x={x + 420} y={90} name="艾伦 · 图灵" note="1912–1954 · 英国数学家" hair="side" rot={3} />
      <P x={x - 520} y={150}>
        <Sticker rot={-12}>
          <PunchCard />
        </Sticker>
      </P>
      <P x={x - 470} y={560}>
        <Sticker rot={8}>
          <VacuumTube />
        </Sticker>
      </P>
      <At f={f} at={cf(19)}>
        <P x={x + 470} y={560}>
          <PostIt w={330} rot={3} head="图灵的预言">
            大约 50 年后，提问 5 分钟，普通人认对的概率不超过 70%
          </PostIt>
        </P>
      </At>
    </>
  );
};

/** 1955–56 达特茅斯 */
const Era1956: React.FC<{f: number}> = ({f}) => {
  const x = yx(1956);
  return (
    <>
      <P x={x + 170} y={520}>
        <HalftonePhoto w={300} h={190} rot={2} dot={5} caption="达特茅斯学院（示意）">
          <HallArt w={300} h={190} />
        </HalftonePhoto>
      </P>
      <At f={f} at={cw(25, '10 个人')}>
        <P x={x - 220} y={478}>
          <Sticker rot={-2}>
            <div style={{background: '#fff', padding: '10px 16px'}}>
              <People n={10} lit={Math.min(10, Math.floor((step12(f) - cw(25, '10 个人')) / 2.5) + 1)} />
              <div style={{fontFamily: VF.heavy, fontSize: 30, color: V.ink, marginTop: 4}}>10 个人 × 2 个月</div>
            </div>
          </Sticker>
        </P>
      </At>
      <P x={x + 560} y={520}>
        <Sticker rot={6}>
          <CalendarPage top="1956 · 夏" big="2" sub="个月" />
        </Sticker>
      </P>
      <P x={x + 400} y={300}>
        <Stamp size={34} rot={-10} round>
          DARTMOUTH
          <br />
          1956
        </Stamp>
      </P>
    </>
  );
};

/** 1958–1969 两派分开，ELIZA */
const EraSplit: React.FC<{f: number}> = ({f}) => {
  const x = yx(1964);
  return (
    <>
      <P x={x - 260} y={70}>
        <Label size={26}>1966 · 聊天程序 ELIZA</Label>
      </P>
      <P x={x - 260} y={120}>
        <Terminal
          f={f}
          from={cf(32)}
          lines={[
            ['我', '我最近很难过。'],
            ['ELIZA', '你为什么觉得难过？'],
            ['我', '我男朋友让我来的。'],
            ['ELIZA', '跟我说说你男朋友。'],
          ]}
        />
      </P>
      <P x={x + 240} y={130}>
        <PostIt w={290} rot={-4} head="规则派的明星">
          秘书跟它聊了几句，就请作者离开房间
        </PostIt>
      </P>
      <Person x={yx(1958) + 980} y={LANE.learnTop + 30} name="罗森布拉特" note="感知机的发明者" hair="short" rot={-4} w={170} />
    </>
  );
};

/** 1969–1973 */
const Era1969: React.FC<{f: number}> = ({f}) => {
  const x = yx(1969);
  return (
    <>
      <Person x={x - 250} y={120} name="马文 · 明斯基" note="规则派 · 《感知机》作者" hair="receding" rot={3} w={160} />
      <At f={f} at={cw(41, '经费')}>
        <P x={x + 440} y={LANE.learnTop + 40}>
          <Sticker rot={5}>
            <MoneyDown />
          </Sticker>
        </P>
      </At>
      <P x={yx(1973) - 680} y={140}>
        <Stamp size={30} rot={-14}>
          UK · 1973
        </Stamp>
      </P>
      <At f={f} at={cf(43)}>
        <P x={yx(1973) + 330} y={300}>
          <Sticker rot={-6}>
            <Scissors />
          </Sticker>
        </P>
        <P x={yx(1973) + 350} y={70}>
          <PostIt w={270} rot={4} head="报告之后">
            英国大幅削减 AI 研究经费
          </PostIt>
        </P>
      </At>
    </>
  );
};

/** 两次寒冬里的雪花和温度计（跟霜一起出现） */
const WinterBits: React.FC<{f: number; at: number; from: number; to: number; seed: number}> = ({f, at, from, to, seed}) => {
  if (f < at) return null;
  const x0 = yx(from);
  const w = yx(to) - x0;
  return (
    <>
      {Array.from({length: 6}, (_, i) => (
        <P key={i} x={x0 + 60 + rand(seed + i) * (w - 160)} y={90 + rand(seed + i + 9) * 650}>
          <div style={{transform: `rotate(${(step12(f) - at) * 1.2 + i * 20}deg)`}}>
            <Sticker>
              <Snowflake s={50 + rand(seed + i + 3) * 50} />
            </Sticker>
          </div>
        </P>
      ))}
      <P x={x0 + w - 110} y={520}>
        <Sticker rot={6}>
          <Thermometer />
        </Sticker>
      </P>
    </>
  );
};

/** 80 年代专家系统 → 1987 崩盘 */
const Era80s: React.FC<{f: number}> = ({f}) => {
  const x = yx(1983);
  return (
    <>
      <At f={f} at={cf(49)}>
        <P x={x - 520} y={LANE.learnTop + 40}>
          <Sticker rot={-8}>
            <Stethoscope />
          </Sticker>
        </P>
        <P x={x - 300} y={LANE.learnTop + 90}>
          <Sticker rot={12}>
            <Wrench />
          </Sticker>
        </P>
      </At>
      <P x={x - 40} y={LANE.learnTop + 40}>
        <Sticker rot={-5}>
          <Floppy label="MYCIN.RULES" />
        </Sticker>
      </P>
      <P x={x + 170} y={LANE.learnTop + 70}>
        <Sticker rot={9}>
          <Floppy label="XCON v4" />
        </Sticker>
      </P>
      <At f={f} at={cw(52, '10 亿')}>
        <P x={yx(1985) + 20} y={330}>
          <Sticker rot={-4}>
            <Bills />
          </Sticker>
        </P>
      </At>
      <At f={f} at={cf(55)}>
        <P x={yx(1985) + 400} y={330}>
          <Stamp size={36} rot={8}>
            维护太贵
          </Stamp>
        </P>
      </At>
      <P x={yx(1986) + 560} y={120}>
        <Sticker rot={-6}>
          <TrashBin />
        </Sticker>
      </P>
      <At f={f} at={cf(57)}>
        <P x={yx(1987) + 400} y={110}>
          <Sticker rot={4}>
            <DownChart />
          </Sticker>
        </P>
        <P x={yx(1987) + 360} y={340}>
          <PostIt w={300} rot={-3} head="1987">
            Lisp 机器的市场几乎一夜崩盘
          </PostIt>
        </P>
      </At>
    </>
  );
};

/** 1986 反向传播：辛顿、深夜咖啡、前人 */
const Era1986: React.FC<{f: number}> = ({f}) => {
  const x = yx(1986);
  return (
    <>
      <Person x={x - 760} y={LANE.learnTop + 30} name="杰弗里 · 辛顿" note="学习派 · 坐了几十年冷板凳" hair="grey" glasses rot={-3} w={170} />
      <P x={x + 690} y={LANE.learnTop + 60}>
        <Sticker rot={-4}>
          <Mug />
        </Sticker>
      </P>
      <At f={f} at={cf(65)}>
        <P x={x + 690} y={LANE.learnTop + 250}>
          <PostIt w={300} rot={3} head="其实">
            1974 年 Werbos 就提出过，这篇让它出了名
          </PostIt>
        </P>
      </At>
    </>
  );
};

/** 1997 深蓝 */
const Era1997: React.FC<{f: number}> = ({f}) => {
  const x = yx(1997);
  return (
    <>
      <P x={x - 740} y={390}>
        <PostIt w={240} rot={-5} head="1997.5.3–5.11">
          纽约 · 一共六局
        </PostIt>
      </P>
      <Person x={x - 670} y={50} name="卡斯帕罗夫" note="国际象棋世界冠军" hair="curly" rot={-4} w={150} />
      <At f={f} at={cf(68)}>
        <P x={x + 380} y={360}>
          <Clipping w={440} h={250} seed={97} date="THE NEW YORK TIMES, MONDAY, MAY 12, 1997" head="Swift and Slashing, Computer Topples Kasparov" headSize={34} lines={2} rot={3} />
        </P>
      </At>
      <At f={f} at={cf(69)}>
        <P x={x - 400} y={350}>
          <Sticker rot={0}>
            <ChessKing fallen />
          </Sticker>
        </P>
      </At>
    </>
  );
};

/** 2012 */
const Era2012: React.FC<{f: number}> = ({f}) => {
  const x = yx(2012);
  return (
    <>
      <P x={x - 860} y={LANE.learnTop + 60}>
        <PostIt w={260} rot={-4} head="两块显卡">
          GTX 580，打游戏用的那种
        </PostIt>
      </P>
      <P x={x + 360} y={110}>
        <HalftonePhoto w={300} h={220} rot={3} dot={5} caption="ImageNet 图库（示意）">
          <ImageGridArt w={300} h={220} />
        </HalftonePhoto>
      </P>
      <P x={x + 740} y={150}>
        <PostIt w={280} rot={4} head="比赛规模">
          120 万张训练图，1000 个类别
        </PostIt>
      </P>
      <At f={f} at={cw(77, '算力')}>
        <P x={x + 520} y={LANE.learnTop + 40}>
          <Sticker rot={-8}>
            <Chip label="GTX 580" />
          </Sticker>
        </P>
      </At>
    </>
  );
};

/** 2016–2022 加速段 */
const EraBoom: React.FC<{f: number}> = ({f}) => (
  <>
    {/* 2016 首尔 */}
    <Person x={yx(2016) - 640} y={200} name="李世石" note="围棋九段" hair="short" rot={3} w={150} />
    <P x={yx(2016) - 300} y={230}>
      <TV>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: VF.num, fontSize: 64, color: V.ink, lineHeight: 1}}>{f >= cw(81, '2 亿') ? '2 亿+' : 'LIVE'}</div>
          <People n={6} size={26} />
        </div>
      </TV>
    </P>
    <P x={yx(2016) + 420} y={LANE.learnTop + 40}>
      <PostIt w={290} rot={4} head="第二局 · 第 37 手">
        一步职业棋手都没想到的棋
      </PostIt>
    </P>
    <P x={yx(2016) + 60} y={LANE.learnTop + 290}>
      <Sticker rot={-4}>
        <GoStones />
      </Sticker>
    </P>
    {/* 2017 */}
    <At f={f} at={cf(82)}>
      <P x={yx(2017) - 260} y={250}>
        <Sticker rot={-2}>
          <div style={{background: '#fff', padding: '10px 16px'}}>
            <People n={8} lit={Math.min(8, Math.floor((step12(f) - cf(82)) / 2.5) + 1)} />
            <div style={{fontFamily: VF.heavy, fontSize: 28, color: V.ink, marginTop: 4}}>8 位作者</div>
          </div>
        </Sticker>
      </P>
    </At>
    <P x={yx(2017) + 380} y={LANE.learnTop + 60}>
      <Stamp size={28} rot={-8}>
        arXiv:1706.03762
      </Stamp>
    </P>
    {/* 2020 */}
    <P x={yx(2020) - 330} y={230}>
      <Sticker rot={-3}>
        <ServerRack />
      </Sticker>
    </P>
    <At f={f} at={cw(86, '1750')}>
      <P x={yx(2020) + 330} y={LANE.learnTop + 40}>
        <PostIt w={260} rot={4} head="它读了多少">
          训练时读了约 3000 亿个词元
        </PostIt>
      </P>
    </At>
    {/* 2022 ChatGPT：大家都在问它 */}
    {['帮我写周报', '这道题怎么做？', '翻译成英文', '给我讲个笑话'].map((t, i) => (
      <At key={t} f={f} at={cf(87) + 8 + i * 9}>
        <P x={yx(2022) - 420 + (i % 2) * 330} y={120 + i * 80}>
          <Bubble text={t} me />
        </P>
      </At>
    ))}
    <P x={yx(2022) + 560} y={LANE.learnTop + 30}>
      <Phone>
        <div style={{alignSelf: 'flex-end'}}>
          <Bubble text="在吗" me />
        </div>
        <Bubble text="在的！" />
      </Phone>
    </P>
  </>
);

/** 2024 诺贝尔、2026 */
const EraNow: React.FC<{f: number}> = ({f}) => (
  <>
    <P x={yx(2024) + 420} y={LANE.learnTop + 40}>
      <Sticker rot={6}>
        <Protein />
      </Sticker>
    </P>
    <At f={f} at={cf(93)}>
      <P x={yx(2024) + 20} y={180}>
        <PostIt w={300} rot={-3} head="AlphaFold">
          预测了约 2 亿种蛋白质的结构
        </PostIt>
      </P>
    </At>
    <P x={yx(2024) - 420} y={150}>
      <Stamp size={34} rot={8} round>
        NOBEL
        <br />
        2024
      </Stamp>
    </P>
    <At f={f} at={cf(96) + 12}>
      <P x={yx(2026) - 440} y={250}>
        <Sticker rot={-6}>
          <Globe />
        </Sticker>
      </P>
      <P x={yx(2026) - 190} y={300}>
        <Sticker>
          <div style={{background: '#fff', padding: '8px 12px'}}>
            {[0, 1, 2].map((r) => (
              <People key={r} n={10} size={26} color={r === 0 ? V.red : V.ink} lit={Math.min(10, Math.floor((step12(f) - cf(96) - 12) / 2) - r * 4)} />
            ))}
          </div>
        </Sticker>
      </P>
    </At>
    <P x={yx(2026) + 380} y={LANE.learnTop + 30}>
      <Phone>
        <div style={{alignSelf: 'flex-end'}}>
          <Bubble text="今天也来问你" me />
        </div>
        <Bubble text="好呀" />
      </Phone>
    </P>
  </>
);

/** 一个固定图钉：钉在主线卡片顶上 */
export const Pins: React.FC<{at: [number, number][]}> = ({at}) => (
  <>
    {at.map(([x, y], i) => (
      <P key={i} x={x - 17} y={y - 17}>
        <Pushpin color={i % 3 === 2 ? V.ink : V.red} />
      </P>
    ))}
  </>
);

/** 整张桌面的旁支材料，放在主线卡片下面一层 */
export const Scrapbook: React.FC<{f: number}> = ({f}) => (
  <>
    <DeskLitter x0={300} x1={WORLD_W - 300} y0={-40} y1={1000} count={70} seed={18} />
    <Era1950 f={f} />
    <Era1956 f={f} />
    <EraSplit f={f} />
    <Era1969 f={f} />
    <WinterBits f={f} at={cf(45) + 4} from={1974} to={1980} seed={74} />
    <WinterBits f={f} at={cf(57) + 10} from={1987} to={1993} seed={87} />
    <Era80s f={f} />
    <Era1986 f={f} />
    <Era1997 f={f} />
    <Era2012 f={f} />
    <EraBoom f={f} />
    <EraNow f={f} />
  </>
);

/* ============ 屏幕右上角：年份计数器（跟着相机滚） ============ */

/** 口播讲到哪一年：[从第几句开始, 年份]；cf(8)–cf(10) 那段沿时间尺追的镜头用相机位置 */
const STORY_YEARS: [number, number][] = [
  [1, 1958], [13, 1950], [21, 1955], [30, 1958], [38, 1969], [42, 1973], [45, 1974], [47, 1980], [51, 1985], [56, 1987],
  [61, 1986], [66, 1997], [71, 2012], [80, 2016], [82, 2017], [86, 2020], [87, 2022], [90, 2024], [96, 2026], [98, 1958],
];

const storyYear = (f: number) => {
  let prev = STORY_YEARS[0][1];
  let cur = prev;
  let at = 0;
  for (const [n, y] of STORY_YEARS) {
    if (f < cf(n) - 6) break;
    prev = cur;
    cur = y;
    at = cf(n) - 6;
  }
  const t = Math.min(1, (step12(f) - at) / 12);
  return prev + (cur - prev) * (1 - Math.pow(1 - t, 3));
};

export const YearHud: React.FC<{f: number; cam: {x: number; z: number}}> = ({f, cam}) => {
  if (f < cf(1) || f >= cf(103) || cam.z < 0.4) return null;
  const tracking = f >= cf(8) && f < cf(13);
  const year = Math.round(Math.max(1950, Math.min(2026, tracking ? xy(cam.x) : storyYear(f))));
  const p = (year - 1950) / 76;
  return (
    <div style={{position: 'absolute', right: 36, top: 28, background: V.ink, padding: '10px 18px 14px', width: 300, boxShadow: '3px 6px 8px rgba(23,23,22,0.3)'}}>
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <div style={{fontFamily: VF.num, fontSize: 76, color: V.paper, lineHeight: 1}}>{year}</div>
        <div style={{fontFamily: VF.heavy, fontSize: 22, color: V.hiSolid}}>AI 七十年</div>
      </div>
      <div style={{position: 'relative', height: 14, marginTop: 10}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 6, height: 3, background: 'rgba(238,237,237,0.4)'}} />
        {[1974, 1987].map((y) => (
          <div key={y} style={{position: 'absolute', left: `${((y - 1950) / 76) * 100}%`, width: `${(6 / 76) * 100}%`, top: 3, height: 9, background: 'rgba(160,186,206,0.7)'}} />
        ))}
        <div style={{position: 'absolute', left: 0, width: `${p * 100}%`, top: 5, height: 5, background: V.red}} />
        <div style={{position: 'absolute', left: `calc(${p * 100}% - 7px)`, top: 0, width: 14, height: 14, borderRadius: 7, background: V.red, border: `2px solid ${V.paper}`}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: VF.num, fontSize: 18, color: 'rgba(238,237,237,0.6)', marginTop: 4}}>
        <span>1950</span>
        <span>2026</span>
      </div>
    </div>
  );
};
