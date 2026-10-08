import {talkingHeadSchema} from '../spec';
import {z} from 'zod';
export const v5Schema=talkingHeadSchema.extend({
 transformationTitle:z.string().trim().min(1).max(4),
 studentTitle:z.string().trim().min(1).max(4),
 teacherTitle:z.string().trim().min(1).max(4),
 focusSize:z.number().int().min(220).max(340),
 titleSize:z.number().int().min(150).max(200),
 pairingStart:z.number().min(21.8).max(22.4),
 assistantStart:z.number().min(29.1).max(29.6),
}).strict();
export type V5Props=z.infer<typeof v5Schema>;
export const v5Metadata=({props}:{props:V5Props})=>({props:v5Schema.parse(props),width:1920,height:1080,fps:30,durationInFrames:960});
