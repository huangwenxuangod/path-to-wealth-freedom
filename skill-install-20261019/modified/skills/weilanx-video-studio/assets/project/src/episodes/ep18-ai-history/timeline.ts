/**
 * 时间轴桌面的坐标。世界坐标单位是像素（相机 z=1 时一比一）。
 * 年份不按比例铺：节点越密的年代给得越宽，所以用分段线性映射。
 */
const ANCHORS: [number, number][] = [
  [1946, 300],
  [1950, 1200],
  [1956, 2600],
  [1958, 4000],
  [1969, 5600],
  [1973, 7000],
  [1980, 8200],
  [1985, 9300],
  [1986, 10400],
  [1987, 11500],
  [1993, 12400],
  [1997, 13500],
  [2012, 15300],
  [2016, 17000],
  [2017, 18400],
  [2020, 19800],
  [2022, 21200],
  [2024, 22700],
  [2026, 24100],
  [2030, 25000],
];

export const WORLD_W = 25000;
export const WORLD_H = 1080;

/** 年份 → 桌面横坐标 */
export const yx = (year: number) => {
  for (let i = 1; i < ANCHORS.length; i++) {
    const [y0, x0] = ANCHORS[i - 1];
    const [y1, x1] = ANCHORS[i];
    if (year <= y1) return x0 + ((year - y0) / (y1 - y0)) * (x1 - x0);
  }
  return ANCHORS[ANCHORS.length - 1][1];
};

/** 桌面横坐标 → 年份（yx 的反函数，屏幕上的年份计数器用） */
export const xy = (x: number) => {
  for (let i = 1; i < ANCHORS.length; i++) {
    const [y0, x0] = ANCHORS[i - 1];
    const [y1, x1] = ANCHORS[i];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return ANCHORS[ANCHORS.length - 1][0];
};

/** 纵向布局：上面规则派，下面学习派，底部时间尺 */
export const LANE = {
  rulesTop: 60,
  divider: 470,
  learnTop: 500,
  ruler: 880,
};

/** 两次寒冬 */
export const WINTERS = [
  {from: 1974, to: 1980, name: '第一次寒冬'},
  {from: 1987, to: 1993, name: '第二次寒冬'},
];
