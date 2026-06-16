# 基于金融新闻情绪与股票价格数据的市场趋势预测

本目录包含课程大作业的技术路线、论文初稿和可复现实验代码。

## Overleaf 直接编译

在 Overleaf 新建空白项目，上传以下任一单文件，并将 Compiler 设置为
`XeLaTeX`：

- `technical_route_2pages.tex`：两页技术路线。
- `paper_8pages.tex`：A4 双栏、目标 6-8 页，含真实结果、8 张实验图和研究流程图。
  图片已改为单栏就近浮动，并使用浮动屏障避免集中堆到参考文献前。

`technical_route_2pages.tex` 不依赖外部图片。`paper_8pages.tex` 需要同时上传
`figures/` 目录中的 PNG；不依赖 `.bib` 或本地字体。论文已在文档类中启用
`twocolumn`，标题与摘要跨栏，正文和参考文献为双栏。

## 其他文件

- `技术路线_2页.md`：下周打印提交的两页技术路线。
- `论文初稿_8页内.md`：最终报告正文初稿，实验后替换结果表中的占位符。
- `文献检索说明.md`：选题修正、核心文献和数据集选择依据。
- `code/market_trend_pipeline.py`：从清洗到评估的一体化实验脚本。
- `code/requirements.txt`：Python 依赖。

## 推荐数据

主实验采用 FNSPID。它同时包含新闻发布时间、股票代码、新闻文本和对应行情，
能完成新闻与交易日的严格对齐。原方案中的 SEntFiN 更适合训练情绪分类器，
但不适合作为主预测数据，因为其核心版本主要提供实体级情绪标注，缺少稳定的
逐条新闻发布时间。

FNSPID：

- 论文：https://arxiv.org/abs/2402.06698
- 数据：https://huggingface.co/datasets/Zihan1004/FNSPID
- 代码：https://github.com/Zdong104/FNSPID_Financial_News_Dataset

## 已完成的真实实验

由于 FNSPID 官方新闻文件为 5.7 GB 和 23.2 GB 的整块 CSV，当前下载链路无法可靠
按股票分片，本次可复现实验改用公开的 Combined News and DJIA 数据：

- `data/Combined_News_DJIA.csv`
- `data/upload_DJIA_table.csv`
- 实验脚本：`code/djia_experiment.py`
- 数值结果：`outputs/djia_real/`
- Overleaf 图表：`figures/`

主实验使用当天 25 条新闻的 VADER 情绪和当天量价指标预测下一交易日 DJIA 方向。
XGBoost 加入新闻后的平均 AUC 为 0.504，AUC 增量置信区间包含 0，回测不盈利。

## 快速运行

```powershell
cd "D:\path-to-wealth-freedom\内容\项目\金融新闻情绪股票趋势预测"
python -m pip install -r code\requirements.txt

# 无真实数据时，先生成演示数据并跑通全流程
python code\market_trend_pipeline.py --make-demo --output-dir outputs\demo

# 使用整理后的真实 CSV
python code\market_trend_pipeline.py `
  --news-csv data\news.csv `
  --prices-csv data\prices.csv `
  --output-dir outputs\real
```

新闻 CSV 至少包含：

```text
datetime,ticker,title
```

可选列为 `sentiment_score`。若没有该列，脚本默认使用轻量金融词典生成情绪分数；
正式实验建议先用 ProsusAI/finbert 批量推理，再将
`positive_probability - negative_probability` 写入该列。

价格 CSV 至少包含：

```text
date,ticker,open,high,low,close,volume
```

## 研究边界

任务是预测个股下一交易日相对市场的方向，不是预测精确价格，也不构成投资建议。
新闻发布时间晚于美东时间 16:00 的样本会顺延至下一交易日，防止未来信息泄漏。
