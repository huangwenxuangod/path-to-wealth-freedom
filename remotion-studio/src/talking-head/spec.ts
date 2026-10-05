import {z} from 'zod';
const copy = (n:number)=>z.string().trim().min(1).max(n);
export const talkingHeadSchema=z.object({
 videoSrc:z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/).refine(s=>!s.includes('..'),'Use a public asset path'),
 edited:z.boolean(), showSubtitles:z.boolean(), showSourceLabel:z.boolean(), fullScreenScenes:z.boolean(),
 accent:z.string().regex(/^#[0-9a-fA-F]{6}$/), background:z.string().regex(/^#[0-9a-fA-F]{6}$/),
 videoOffsetX:z.number().min(-500).max(500), videoOffsetY:z.number().min(-200).max(200), videoScale:z.number().min(1).max(1.5),
 overlayOffsetX:z.number().min(-100).max(150), overlayOffsetY:z.number().min(-90).max(100), overlayScale:z.number().min(.75).max(1.15),
 volume:z.number().min(0).max(1), subtitleSize:z.number().int().min(24).max(48),
 introTitle:copy(10),
 transformationTitle:copy(10), studentTitle:copy(10), teacherTitle:copy(10),
 scene2Start:z.number().min(8).max(12), scene3Start:z.number().min(16).max(20), scene4Start:z.number().min(24).max(28),
}).strict();
export type TalkingHeadProps=z.infer<typeof talkingHeadSchema>;
export const talkingHeadMetadata=({props}:{props:TalkingHeadProps})=>({props:talkingHeadSchema.parse(props),width:1920,height:1080,fps:30,durationInFrames:960});
