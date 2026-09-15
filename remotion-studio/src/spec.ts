import {z} from 'zod';

export const graphemes = (text: string) => [...new Intl.Segmenter('zh', {granularity: 'grapheme'}).segment(text)].map((part) => part.segment);
const text = (max: number, allowEmpty = false) => z.string().trim().refine((value) => (allowEmpty || value.length > 0) && graphemes(value).length <= max, `Text must contain ${allowEmpty ? 0 : 1}–${max} graphemes`);
export const assetPath = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/).refine((value) => !value.split('/').some((part) => part === '..' || part === '.' || part === ''), 'Asset must be a relative path inside public');
export const videoSpec = z.object({
  schemaVersion: z.literal(1),
  template: z.enum(['agent-workflow', 'beam-overlay']),
  title: text(24),
  subtitle: text(48, true),
  productName: text(12),
  logo: assetPath,
  theme: z.literal('editorial-lime'),
  format: z.enum(['landscape', 'portrait']),
  fps: z.union([z.literal(30), z.literal(60)]),
  durationSeconds: z.union([z.literal(8), z.literal(3)]),
  seed: text(80),
  tools: z.array(z.object({id: z.string().regex(/^[a-z][a-z0-9-]*$/), label: text(8), icon: z.enum(['document','sheet','calendar','approval'])}).strict()).min(1).max(4),
  outputBackground: z.enum(['opaque', 'transparent']),
}).strict().superRefine((spec, ctx) => {
  if (new Set(spec.tools.map((tool) => tool.id)).size !== spec.tools.length) ctx.addIssue({code: 'custom', message: 'Tool ids must be unique', path: ['tools']});
  if (spec.durationSeconds !== (spec.template === 'agent-workflow' ? 8 : 3)) ctx.addIssue({code: 'custom', message: 'Template duration mismatch', path: ['durationSeconds']});
});
export type VideoSpec = z.infer<typeof videoSpec>;
export const metadata = (input: VideoSpec, expectedTemplate = input.template) => {
  const props = videoSpec.parse(input);
  if (props.template !== expectedTemplate) throw new Error(`Expected template: ${expectedTemplate}`);
  return {props, width: props.format === 'portrait' ? 1080 : 1920, height: props.format === 'portrait' ? 1920 : 1080, fps: props.fps, durationInFrames: props.fps * props.durationSeconds};
};
