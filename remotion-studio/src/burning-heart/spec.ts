import {z} from 'zod';

export const burningHeartSpec = z.object({
  schemaVersion: z.literal(1),

  // 核心标题
  title: z.string(),
  subtitle: z.string(),
  hook: z.string(), // 开场钩子文案

  // 老店信息
  originalStore: z.object({
    name: z.string(),
    price: z.number(),
    cost: z.number(),
    quality: z.enum(['high', 'medium', 'low']),
    principle: z.string(), // "规矩不能坏" / "不烧心"
  }),

  // 新店（隔壁）信息
  competitorStore: z.object({
    name: z.string(),
    price: z.number(),
    cost: z.number(),
    quality: z.enum(['high', 'medium', 'low']),
    strategy: z.string(), // "九块九管饱" / "便宜两块"
  }),

  // 市场参数
  market: z.object({
    entryBarrier: z.enum(['low', 'medium', 'high']),
    customerSensitivity: z.number().min(0).max(1), // 价格敏感度 0-1
    qualityVisible: z.boolean(), // 品质是否购买前可见
    repeatPurchaseRate: z.number().min(0).max(1), // 复购率
  }),

  // 经济学概念标注
  concepts: z.object({
    freeEntry: z.string(), // "自由进入"
    hotelling: z.string(), // "霍特林空间竞争"
    bertrand: z.string(), // "伯特兰价格竞争"
    lemonMarket: z.string(), // "柠檬市场"
    redQueen: z.string(), // "红皇后假说"
  }),

  // 视觉主题（深色系 + 高对比度）
  theme: z.object({
    accent: z.string(), // 主强调色
    danger: z.string(), // 危险/警告色
    success: z.string(), // 成功/良心色
    background: z.string(), // 深色背景
    surface: z.string(), // 表面层
    text: z.string(), // 主文本色
    textMuted: z.string(), // 次要文本色
  }),
}).strict();

export type BurningHeartSpec = z.infer<typeof burningHeartSpec>;

export const burningHeartMetadata = (input: BurningHeartSpec) => {
  const props = burningHeartSpec.parse(input);
  return {
    props,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 30 * 150, // 150秒 = 2分30秒 = BGM循环5次
  };
};
