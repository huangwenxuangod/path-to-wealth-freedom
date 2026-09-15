import {z} from 'zod';
import {assetPath,graphemes} from '../spec';
const label=(n:number)=>z.string().trim().refine(s=>s.length>0&&graphemes(s).length<=n,'Text length outside limits');
export const astraSpec=z.object({
 template:z.literal('astra-overview'),fps:z.union([z.literal(30),z.literal(60)]),durationSeconds:z.literal(36),format:z.literal('landscape'),
 title:label(24),summary:label(40),logo:assetPath,
 advantages:z.tuple([
  z.object({id:z.literal('computer-use'),title:label(24),subtitle:label(48),sourceId:z.literal('openai-computer')}).strict(),
  z.object({id:z.literal('coding'),title:label(24),subtitle:label(48),sourceId:z.literal('openai-coding')}).strict(),
  z.object({id:z.literal('artifacts'),title:label(24),subtitle:label(48),sourceId:z.literal('openai-artifacts')}).strict(),
 ]),benchmark:z.object({name:z.literal('Terminal-Bench 4.0'),astra:z.literal(57.9),sol:z.literal(37.3),unit:z.literal('%'),sourceId:z.literal('openai-coding')}).strict(),
}).strict();
export type AstraSpec=z.infer<typeof astraSpec>;
export const astraMetadata=(input:AstraSpec)=>{const props=astraSpec.parse(input);return {props,width:1920,height:1080,fps:props.fps,durationInFrames:props.fps*36};};
