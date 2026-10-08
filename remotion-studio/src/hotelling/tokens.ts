// 视觉风格 tokens - 基于红黑白配色，适合经济学知识视频
export const tokens = {
  color: {
    bg: '#0A0D12',           // 深黑背景
    surface1: '#0F131C',     // 第一层表面
    surface2: '#161D2B',     // 第二层表面
    surface3: '#1E2636',     // 第三层表面
    accent: '#E94235',       // 红色强调（利润/竞争）
    accentMuted: '#E9423580', // 半透明红色
    secondary: '#F4B400',    // 黄色（警告/变化）
    text: '#F1F0E8',         // 主文字
    muted: '#AAB4AD',        // 次要文字
    success: '#34A853',      // 绿色（成功/验证）
    line: '#39443C',         // 分割线
  },

  // 缓动函数
  ease: (t: number, duration: number = 1) => {
    const x = Math.min(Math.max(t / duration, 0), 1);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  },

  // 进度计算
  progress: (seconds: number, start: number, duration: number) => {
    return Math.min(Math.max((seconds - start) / duration, 0), 1);
  },

  // 弹性缓动
  spring: (t: number, duration: number = 1) => {
    const x = Math.min(Math.max(t / duration, 0), 1);
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },

  // 字体大小
  fontSize: {
    display: 96,
    h1: 72,
    h2: 56,
    h3: 42,
    body: 32,
    caption: 24,
    small: 18,
  },

  // 间距
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },
};

// 布局辅助函数
export const layout = {
  // 街道视图布局（俯视图）
  street: {
    width: 1200,
    height: 600,
    storeWidth: 180,
    storeHeight: 120,
    gap: 40,
  },

  // 卡片布局
  card: {
    width: 480,
    height: 280,
    radius: 24,
  },

  // 安全边距
  padding: {
    horizontal: 112,
    vertical: 84,
  },
};
