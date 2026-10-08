import {z} from 'zod';

export const hotellingSpec = z.object({
  schemaVersion: z.literal(1),

  // 品牌信息
  title: z.string(),
  subtitle: z.string(),

  // 老店信息
  originalStore: z.object({
    name: z.string(),
    price: z.number(),
    cost: z.number(),
    quality: z.enum(['high', 'medium', 'low']),
    principle: z.string(), // "不烧心"
  }),

  // 新店信息
  newStore: z.object({
    name: z.string(),
    price: z.number(),
    cost: z.number(),
    quality: z.enum(['high', 'medium', 'low']),
    strategy: z.string(), // "便宜两块"
  }),

  // 市场参数
  market: z.object({
    entryBarrier: z.enum(['low', 'medium', 'high']),
    customerSensitivity: z.number().min(0).max(1), // 价格敏感度
    qualityVisible: z.boolean(), // 品质是否可见
    repeatPurchase: z.number().min(0).max(1), // 复购率
  }),

  // 视觉配置
  theme: z.object({
    accent: z.string(),
    background: z.string(),
    text: z.string(),
    muted: z.string(),
  }),
}).strict();

export type HotellingSpec = z.infer<typeof hotellingSpec>;

export const hotellingMetadata = (input: HotellingSpec) => {
  const props = hotellingSpec.parse(input);
  return {
    props,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 30 * 46, // 46秒
  };
};
