export const color = {bg: '#090c0b', accent: '#b5ff38', paper: '#f1f0e8', panel: '#1c2220', muted: '#aab4ad', line: '#39443c'};
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const progress = (seconds: number, start: number, duration: number) => clamp((seconds - start) / duration);
export const timing = {scan: 2.4, scanGap: 0.22, beam: 3.6, beamGap: 0.12, activation: 5.2, result: 6.1};

export const layout = (portrait: boolean, count: number) => {
  // ponytail: two deliberate layouts; add another format only for a real composition.
  const cards = Array.from({length: count}, (_, i) => portrait
    ? {x: 90 + (i % 2) * 470, y: 560 + Math.floor(i / 2) * 250, w: 430, h: 210}
    : {x: 112 + (i % 2) * 380, y: 398 + Math.floor(i / 2) * 240, w: 340, h: 210});
  const agent = portrait ? {x: 540, y: count > 2 ? 1100 : 1120} : {x: 1460, y: 470};
  return {cards, agent};
};
