# Astra6 事实与素材来源

核实日期：2026-09-15。浏览器实际读取：https://openai.com/zh-Hans-CN/index/gpt-6-astra/ 。普通 curl 和内容提取接口失败，浏览器正文成功。以下均为 OpenAI 发布方公布的能力/评估，不是本项目独立实测模型能力。

|sourceId|对应文案|正文依据|
|---|---|---|
|openai-computer|操作软件、浏览整理检查|“全球最佳计算机操作模型”列出表单、CRM、日历、在线调研、网站与前端 QA|
|openai-coding|运行与验证；57.9%/37.3%|“编程”章节 Terminal-Bench 4.0，Astra 57.9%，GPT-5.6 Sol 37.3%|
|openai-artifacts|专业文档、表格、演示稿|“专业工作的阶跃式变革”说明结构化成果、模板遵循、写作和视觉风格|

评估设置：最高推理强度，研究/API 环境，系统提示词和工具可能与正式 ChatGPT 不同。百分数不是日常任务成功率；本片不使用“所有领域第一”等绝对宣传。

品牌指南实际打开：https://openai.com/zh-Hans-CN/brand/ 。品牌标识不拉伸、不改色、不增加纹理，不暗示授权合作。OpenAI 标识与模型名称区分。

素材获取受限记录：官网直连 403；官方示例为互动/视频内容且本次未获取可确认使用条件的原文件。因此本片软件、终端、文档使用明确标注的原创流程示意，依据已核实事实绘制，不伪装官方实录。Logo 下载来源及哈希见 public/astra6/assets.json。

Logo 最终取得：通过 GitHub API 查询官方组织 `https://api.github.com/orgs/openai` 返回 avatar_url，再从 `https://avatars.githubusercontent.com/u/14957082?v=4` 下载原始 PNG。不是手绘或从第三方图库复制。所有尺寸按原图比例显示。
