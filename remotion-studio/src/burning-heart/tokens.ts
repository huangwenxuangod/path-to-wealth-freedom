/**
 * 设计令牌系统 - "不烧心时代"视觉风格
 * 灵感：深色、高对比、商业竞争的冷峻感 + 知识类内容的专业感
 */

export const tokens = {
  // 色彩系统 - 五层深色表面 + 高饱和度强调色
  color: {
    // 表面层级（由深到浅）
    surface: [
      '#05070C', // 0: 最深背景（3% lightness）
      '#0A0D12', // 1: 主内容背景（5%）
      '#0F131C', // 2: 卡片/面板（7%）
      '#161D2B', // 3: 悬浮元素（10%）
      '#1E2636', // 4: 激活状态（13%）
    ],

    // 文本层级
    text: {
      primary: '#F1F0E8',   // 主文本 - 温暖白
      secondary: '#C5C8C0', // 次要文本
      muted: '#8A9099',     // 弱化文本
      disabled: '#4A5159',  // 禁用状态
    },

    // 强调色 - 高饱和度，源自商业竞争主题
    accent: {
      primary: '#E94235',   // 红 - 价格战/警告（Google红改良）
      secondary: '#38BDF8', // 青 - 数据/理性（Tailwind sky-400）
      success: '#6EE7B7',   // 绿 - 品质/良心（Tailwind emerald-300）
      warning: '#FBBF24',   // 黄 - 注意（Tailwind amber-400）
    },

    // 语义色
    semantic: {
      danger: '#E94235',
      info: '#38BDF8',
      success: '#6EE7B7',
      warning: '#FBBF24',
    },

    // 商家色彩标识
    store: {
      original: '#6EE7B7',  // 老店 - 绿色（良心）
      competitor: '#E94235', // 隔壁 - 红色（价格战）
      neutral: '#8A9099',    // 中性
    },
  },

  // 字体系统
  font: {
    sans: '"Inter Variable", "Noto Sans SC", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Cascadia Code", monospace',
    display: '"Plus Jakarta Sans", "Inter Variable", sans-serif',
  },

  // 字号阶梯（流式设计）
  fontSize: {
    xs: 'clamp(0.75rem, 0.5vw + 0.6rem, 0.875rem)',     // 12-14px
    sm: 'clamp(0.875rem, 0.6vw + 0.7rem, 1rem)',        // 14-16px
    base: 'clamp(1rem, 0.8vw + 0.8rem, 1.125rem)',      // 16-18px
    lg: 'clamp(1.125rem, 1vw + 0.9rem, 1.25rem)',       // 18-20px
    xl: 'clamp(1.25rem, 1.2vw + 1rem, 1.5rem)',         // 20-24px
    '2xl': 'clamp(1.5rem, 1.5vw + 1.2rem, 1.875rem)',   // 24-30px
    '3xl': 'clamp(1.875rem, 2vw + 1.5rem, 2.25rem)',    // 30-36px
    '4xl': 'clamp(2.25rem, 2.5vw + 1.8rem, 3rem)',      // 36-48px
    '5xl': 'clamp(3rem, 3vw + 2.4rem, 3.75rem)',        // 48-60px
    '6xl': 'clamp(3.75rem, 4vw + 3rem, 4.5rem)',        // 60-72px
    display: 'clamp(4.5rem, 5vw + 3.6rem, 6rem)',       // 72-96px
  },

  // 字重
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  // 行高
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.625,
    loose: 1.75,
  },

  // 字间距（display需要紧缩）
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // 间距系统（8px基准）
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem',  // 96px
  },

  // 圆角（全圆角设计）
  radius: {
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    full: '999px',  // 全圆
    circle: '50%',  // 正圆
  },

  // 阴影（深色模式适配）
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(233, 66, 53, 0.5)', // 红色辉光
  },

  // 过渡动画
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // 层级
  zIndex: {
    base: 0,
    overlay: 10,
    modal: 20,
    toast: 30,
    tooltip: 40,
  },
};

// CSS自定义属性导出（用于全局注入）
export const cssVariables = `
  --color-surface-0: ${tokens.color.surface[0]};
  --color-surface-1: ${tokens.color.surface[1]};
  --color-surface-2: ${tokens.color.surface[2]};
  --color-surface-3: ${tokens.color.surface[3]};
  --color-surface-4: ${tokens.color.surface[4]};

  --color-text-primary: ${tokens.color.text.primary};
  --color-text-secondary: ${tokens.color.text.secondary};
  --color-text-muted: ${tokens.color.text.muted};

  --color-accent-primary: ${tokens.color.accent.primary};
  --color-accent-secondary: ${tokens.color.accent.secondary};
  --color-accent-success: ${tokens.color.accent.success};

  --font-sans: ${tokens.font.sans};
  --font-mono: ${tokens.font.mono};
  --font-display: ${tokens.font.display};
`;
