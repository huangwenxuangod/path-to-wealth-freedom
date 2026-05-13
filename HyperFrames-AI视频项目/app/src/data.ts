export const composition = {
  id: "main",
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 76,
};

export const scriptLines = [
  {
    start: 0,
    end: 7,
    text: "我是文轩，一个 05 后大学生 AI 实战者。",
  },
  {
    start: 7,
    end: 16,
    text: "我做的不是收藏工具，而是把 AI 放进真实流程。",
  },
  {
    start: 16,
    end: 28,
    text: "选题、研究、写作、知识库、分发，每一步都可以被系统化。",
  },
  {
    start: 28,
    end: 42,
    text: "我用 Obsidian 和飞书搭双知识库，也用 Codex 和 Claude Code 做内容流水线。",
  },
  {
    start: 42,
    end: 54,
    text: "AI 不是炫技，而是让普通人更快理解行业、做出产品、验证机会。",
  },
  {
    start: 54,
    end: 64,
    text: "我想验证，普通大学生能不能靠 AI、技术和持续输出，在毕业前赚到 100 万。",
  },
  {
    start: 64,
    end: 76,
    text: "关注我，看我怎么用 AI 把路跑通。",
  },
];

export const narration = scriptLines.map((line) => line.text).join("");

export const floatingTools = [
  "Codex",
  "Claude Code",
  "Obsidian",
  "飞书",
  "Prompt",
  "知识库",
  "自媒体",
  "研究",
  "写作",
  "分发",
];

export const pipeline = ["选题", "研究", "写作", "知识库", "分发", "反馈"];

export const orbitTools = ["Obsidian", "飞书", "Codex", "Claude Code"];

export const accelerators = ["理解行业", "做出产品", "验证机会"];
