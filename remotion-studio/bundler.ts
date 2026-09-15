import type {BundlerOverrideFn} from '@remotion/bundler';
import {enableTailwind} from '@remotion/tailwind-v4';
import {resolve} from 'node:path';
export const configureBundler:BundlerOverrideFn=(config)=>{
 const next=enableTailwind(config);
 return {...next,resolve:{...next.resolve,alias:{...next.resolve?.alias,'@':resolve(process.cwd(),'src')}}};
};
