# TikHub Endpoint 白名单

> 目标：只把已确认 method/path/参数的平台接口接入 `source-router`。不确认的 endpoint 只能作为 planned/stub，不能冒充已抓取内容。

## 通用约定

- Base URL：
  - 海外：`https://api.tikhub.io`
  - 国内：`https://api.tikhub.dev`
- Auth：`Authorization: Bearer <TIKHUB_API_KEY>`
- 通用错误：`400/401/402/403/404/429/500`；OpenAPI 常见响应：`200/422`
- 接入原则：
  1. creator 内容抓取优先走 `search_user/profile -> content list -> detail -> comments`。
  2. 搜索接口只能作为定位入口，不能冒充“已抓账号全部内容”。
  3. 每个平台独立 action，独立分页策略，独立 schema 映射。

---

## Xiaohongshu / XHS / RedNote

TikHub 文档优先级：`App V2 > App > Web V3 > Web V2 > Web`。

### 推荐链路 A：Web V3 username -> user_id -> notes

#### 1. 搜索用户
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/web_v3/fetch_search_users`
- Params：
  - `keyword` required string
  - `page` optional integer default `1`
- Pagination：page-based
- 用途：用户名/昵称/关键词 -> user candidates
- 注意：不是精确 username lookup，需要在返回结果中做 display_name/handle/user_id 匹配。

#### 2. 用户信息
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/web_v3/fetch_user_info`
- Params：
  - `user_id` required string
- 用途：user_id -> profile

#### 3. 用户笔记列表
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/web_v3/fetch_user_notes`
- Params：
  - `user_id` required string
  - `cursor` optional string default `""`
  - `num` optional integer default `30`
- Pagination：cursor-based；`num` 文档描述最大 30
- 用途：user_id -> notes

#### 4. 笔记详情
- Status：confirmed but requires token
- Method：`GET`
- Path：`/api/v1/xiaohongshu/web_v3/fetch_note_detail`
- Params：
  - `note_id` required string
  - `xsec_token` required string
- 注意：仅有 note_id 不够，xsec_token 通常来自分享链接。

#### 5. 一级评论
- Status：confirmed but requires token
- Method：`GET`
- Path：`/api/v1/xiaohongshu/web_v3/fetch_note_comments`
- Params：
  - `note_id` required string
  - `cursor` optional string default `""`
  - `xsec_token` required string
- Pagination：cursor-based

#### 6. 二级评论
- Status：confirmed but requires token
- Method：`GET`
- Path：`/api/v1/xiaohongshu/web_v3/fetch_sub_comments`
- Params：
  - `note_id` required string
  - `root_comment_id` required string
  - `num` optional integer default `10`
  - `cursor` optional string default `""`
  - `xsec_token` required string

### 推荐链路 B：App V2 user_id/share_text -> notes

#### 用户信息
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/app_v2/get_user_info`
- Params：
  - `user_id` optional string default `""`
  - `share_text` optional string default `""`
- Rule：`user_id` / `share_text` 二选一；同时传以 `user_id` 为准。

#### 用户发布笔记
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/app_v2/get_user_posted_notes`
- Params：
  - `user_id` optional string default `""`
  - `share_text` optional string default `""`
  - `cursor` optional string default `""`
- Pagination：cursor-based；文档示例 `$.data.data.notes[-1].cursor`

#### 图文详情
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/app_v2/get_image_note_detail`
- Params：`note_id` or `share_text`

#### 视频详情
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/app_v2/get_video_note_detail`
- Params：`note_id` or `share_text`

#### 评论
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/xiaohongshu/app_v2/get_note_comments`
- Params：
  - `note_id` optional string
  - `share_text` optional string
  - `cursor` optional string default `""`
  - `index` optional integer default `0`
  - `pageArea` optional string default `"UNFOLDED"`
  - `sort_strategy` optional string default `"latest_v2"`

---

## Douyin

### username / 抖音号 -> profile
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/douyin/web/handler_user_profile_v2`
- Params：`unique_id` required string

### sec_user_id -> profile
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/douyin/web/handler_user_profile`
- Params：`sec_user_id` required string

### share URL -> sec_user_id
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/douyin/web/get_sec_user_id`
- Params：`url` required string

### user posts
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/douyin/web/fetch_user_post_videos`
- Params：
  - `sec_user_id` required string
  - `max_cursor` optional string default `"0"`
  - `count` optional integer default `20`
  - `filter_type` optional string default `"0"` (`3` popularity sort)
  - `cookie` optional string
- Pagination：cursor-based `max_cursor`

### video detail
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/douyin/web/fetch_one_video`
- Params：`aweme_id` required string; `need_anchor_info` optional bool

### comments
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/douyin/web/fetch_video_comments`
- Params：`aweme_id`, `cursor`, `count`

---

## Bilibili

### share link -> user ID
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/bilibili/web/fetch_get_user_id`
- Params：`share_link` required string

### user profile
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/bilibili/web/fetch_user_profile`
- Params：`uid` required string

### user videos
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/bilibili/web/fetch_user_post_videos`
- Params：
  - `uid` required string
  - `pn` optional integer default `1`
  - `order` optional string default `"pubdate"`
- Pagination：page-based `pn`

### video detail
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/bilibili/web/fetch_one_video`
- Params：`bv_id` required string

### comments
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/bilibili/web/fetch_video_comments`
- Params：`bv_id` required string; `pn` optional integer default `1`

---

## WeChat Channels / 视频号

### user search
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_channels/fetch_user_search`
- Params：`keywords` required string; `page` optional integer default `1`

### user search v2
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_channels/fetch_user_search_v2`
- Params：`keywords` optional string default `""`; `page` optional integer default `0`

### creator homepage / videos
- Status：confirmed
- Method：`POST`
- Path：`/api/v1/wechat_channels/fetch_home_page`
- Body：
  - `username` required string
  - `last_buffer` optional string default `""`
- Pagination：`object_list[-1].last_buffer`

### video detail
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_channels/fetch_video_detail`
- Params：`id` optional string; `exportId` optional string

### comments
- Status：confirmed
- Method：`POST`
- Path：`/api/v1/wechat_channels/fetch_comments`
- Body：
  - `id` required string
  - `lastBuffer` optional string default `""`
  - `comment_id` optional string

---

## WeChat MP / 公众号

### search official account
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_mp/web/fetch_search_official_account`
- Params：
  - `keyword` required string
  - `offset` optional integer default `0`
  - `sort_type` optional string default `"_0"`; `_2` 最新，`_4` 最热
- Pagination：offset-based，每页 +20

### account articles
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_mp/web/fetch_mp_article_list`
- Params：`ghid` required string; `offset` optional string default `""`

### article detail JSON
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_mp/web/fetch_mp_article_detail_json`
- Params：`url` required string

### article detail HTML
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_mp/web/fetch_mp_article_detail_html`
- Params：`url` required string

### article comments
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/wechat_mp/web/fetch_mp_article_comment_list`
- Params：`url` required string; `comment_id` optional; `buffer` optional

---

## Instagram V3

### username -> user_id
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/instagram/v3/get_user_id_by_username`
- Params：`username` required string

### user profile
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/instagram/v3/get_user_profile`
- Params：`user_id` or `username`

### user posts
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/instagram/v3/get_user_posts`
- Params：
  - `username` required string
  - `first` optional integer default `12`
  - `after` optional string
  - `before` optional string
  - `last` optional integer
  - `count` optional integer default `12`
- Pagination：cursor-based `after=end_cursor` / `before=start_cursor`

### post detail
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/instagram/v3/get_post_info`
- Params：`media_id` required string

### post comments
- Status：confirmed
- Method：`GET`
- Path：`/api/v1/instagram/v3/get_post_comments`
- Params：`code` required string; `min_id` optional; `sort_order` optional `popular|newest`

## Reddit APP

### dynamic search
- Status：confirmed by docs search result
- Method：`GET`
- Path：`/api/v1/reddit/app/fetch_dynamic_search`
- Params：
  - `query` required string
  - `search_type` optional string, e.g. `post`
  - `sort` optional string, e.g. `RELEVANCE|NEW|TOP`
  - `time_range` optional string
  - `after` optional cursor
  - `need_format` optional bool
- 用途：关键词 -> Reddit 帖子列表。
- 代码状态：已接入 `search_tikhub_social(platform="reddit")`，支持 after 翻页尝试。

### user posts
- Status：docs search confirmed, endpoint path needs runtime verification
- Page：`https://docs.tikhub.io/369454693e0`
- 用途：用户名 -> 用户发布帖子列表。
- 代码状态：planned。

### single post detail
- Status：docs search confirmed, endpoint path needs runtime verification
- Page：`https://docs.tikhub.io/369454680e0`
- 用途：post id/url -> 帖子详情与评论。
- 代码状态：planned。

---

## X / Twitter

### search timeline
- Status：confirmed by docs search result
- Method：`GET`
- Path：`/api/v1/twitter/web/fetch_search_timeline`
- Params：
  - `keyword` required string
  - `search_type` optional string, e.g. `Top|Latest`
  - `cursor` optional string
- 用途：关键词 -> X 搜索时间线。
- 代码状态：已接入 `search_tikhub_social(platform="x")`，支持 cursor 翻页尝试。

### user media / highlights / single tweet
- Status：docs search confirmed, endpoint path needs runtime verification
- Pages：
  - `https://docs.tikhub.io/215701676e0` highlights
  - `https://docs.tikhub.io/191321709e0` single tweet
- 用途：账号媒体、单推详情、线程/评论扩展。
- 代码状态：planned。

---

## YouTube

### search video
- Status：confirmed by docs search result
- Paths attempted：
  - `/api/v1/youtube/web_v2/search_video`
  - `/api/v1/youtube/web/search_video`
- Params：
  - `search_query` required string
  - `language_code` optional
  - `country_code` optional
  - `order_by` optional
  - `continuation_token` optional
- 用途：关键词 -> 视频列表。
- 代码状态：已接入 `search_tikhub_social(platform="youtube")`，支持 continuation token 翻页尝试。

### search channel / channel videos
- Status：docs search confirmed
- Docs：
  - `https://docs.tikhub.io/443673044e0` shows YouTube Web V2 search channel/get channel videos entries
  - `https://docs.tikhub.io/419083089e0` get channel videos
- Paths attempted：
  - `/api/v1/youtube/web_v2/search_channel`
  - `/api/v1/youtube/web_v2/get_channel_videos`
  - `/api/v1/youtube/web/get_channel_videos`
- 用途：频道名 -> channel_id -> 视频列表。
- 代码状态：已接入 `search_tikhub_username_content(platform="youtube")`，但 endpoint 参数仍需 TIKHUB_API_KEY 真实验证。

---



1. XHS：`fetch_search_users -> fetch_user_info -> fetch_user_notes`，App V2 `get_user_posted_notes` 作为补充。
2. Douyin：`handler_user_profile_v2 -> fetch_user_post_videos`。
3. Bilibili：需要 user search 或 share link；若无 username search，先保留 search URL + share link path。
4. WeChat MP/Channels：拆成 `wechat_mp` 和 `wechat_channels` 两个 platform。
5. Instagram：`get_user_posts` 可直接按 username 打通。
