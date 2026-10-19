import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT_UI} from './theme';

const CN_FAMILY = 'ZCOOL KuaiLe';

if (typeof document !== 'undefined') {
  const handle = delayRender('load ZCOOL KuaiLe');
  const face = new FontFace(CN_FAMILY, `url(${staticFile('fonts/ZCOOLKuaiLe-Regular.ttf')})`);
  face
    .load()
    .then(() => {
      document.fonts.add(face);
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

/** 中文手写字体；拉丁字母也用它，保持同一套笔触 */
export const FONT_CN = `'${CN_FAMILY}', sans-serif`;
/** 代码/英文参数：Patrick Hand 优先，中文回落到站酷快乐体 */
export const FONT_CODE = `${FONT_UI}, '${CN_FAMILY}', monospace`;
