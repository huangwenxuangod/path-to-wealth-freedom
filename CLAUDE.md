 # AI 知识库项目

 ## 项目概述
 在飞书中创建 AI 知识库，用于存储和管理 AI 相关知识。

 ## 已完成工作

 ### 1. 知识库空间
 - **名称**: AI 知识库
 - **空间 ID**: `7622564892733656025`
 - **描述**: 用于存储和管理 AI 相关知识的知识库
 - **类型**: team (团队空间)
 - **可见性**: private (私有)

 ### 2. 知识库首页文档
 - **标题**: AI 知识库首页
 - **节点 Token**: `X0UFwrFFkiq3AhkxUnfcvJxNnPg`
 - **文档 Token**: `AlLSdyZDJogBGhx3GrhcnhT6nqe`
 - **类型**: docx (新版云文档)

 ### 3. 知识库目录多维表格
 - **标题**: AI 知识库目录
 - **节点 Token**: `OeM9weydwiMb7pkp4lbcOetQnmd`
 - **Base Token**: `AAjGbmynCaRtz6sGB0qcBYAtnOg`
 - **表名**: 知识库目录
 - **表 ID**: `tblVM1gQIBSlQNIA`

 #### 表格字段配置
 | 字段名 | 类型 | 说明 |
 |--------|------|------|
 | 内容名称 | text | 主字段 |
 | 文档链接 | text (url) | 文档链接 |
 | 备注 | text | 备注信息 |
 | 更新时间 | datetime | 更新时间 |
 | ~~内容分类~~ | ~~select~~ | (待创建) |
 | ~~状态~~ | ~~select~~ | (待创建) |

 ## 常用命令参考

 ### 知识库操作
 ```bash
 # 获取知识空间列表
 lark-cli api GET wiki/v2/spaces

 # 创建知识库节点
 lark-cli api POST wiki/v2/spaces/<space_id>/nodes \
   --data '{"obj_type":"docx","node_type":"origin","title":"标题"}'

 # 获取知识库节点列表
 lark-cli api GET wiki/v2/spaces/<space_id>/nodes
 ```

 ### 文档操作
 ```bash
 # 读取文档内容
 lark-cli docs +fetch --doc <obj_token> --format pretty

 # 更新文档内容 (追加)
 lark-cli docs +update --doc <obj_token> --mode append --markdown "内容"

 # 更新文档内容 (覆盖)
 lark-cli docs +update --doc <obj_token> --mode overwrite --markdown "内容"
 ```

 ### 多维表格操作
 ```bash
 # 获取表列表
 lark-cli base +table-list --base-token <base_token>

 # 获取字段列表
 lark-cli base +field-list --base-token <base_token> --table-id <table_id>

 # 创建字段
 lark-cli base +field-create --base-token <base_token> --table-id <table_id> --json
 '{"type":"text","name":"字段名"}'

 # 获取记录列表
 lark-cli base +record-list --base-token <base_token> --table-id <table_id>

 # 创建/更新记录
 lark-cli base +record-upsert --base-token <base_token> --table-id <table_id> --json
 '{"字段名":"值"}'
 ```

 ## 后续待办
 - [ ] 完成多维表格的"内容分类"和"状态"字段创建
 - [ ] 添加示例数据到多维表格
 - [ ] 创建更多知识库文档节点
 - [ ] 配置知识库权限

 ## 相关 Token 速查表
 | 项目 | Token |
 |------|-------|
 | 知识库 Space ID | `7622564892733656025` |
 | 首页文档 obj_token | `AlLSdyZDJogBGhx3GrhcnhT6nqe` |
 | 目录多维表格 base_token | `AAjGbmynCaRtz6sGB0qcBYAtnOg` |
 | 目录表 table_id | `tblVM1gQIBSlQNIA` |