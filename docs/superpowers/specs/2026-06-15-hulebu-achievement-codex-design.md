# 胡了卜成就图鉴第一版设计稿

## 1. 背景

T171 已补完每日牌局第一版，`/games/hulebu` 现已具备主线、局外结算、铜钱、升级、路线型奖励、无尽和每日入口，但 `图鉴` 面板仍是壳层占位。T172 的目标是先补一个本地可见的成就图鉴，把这些长期进度沉淀出来。

## 2. 范围

本任务只做成就图鉴第一版：

- `图鉴` 面板从占位改成可查看内容。
- 基于浏览器本地存档展示一组成就卡。
- 成就至少覆盖主线、无尽、每日和升级四类信号。
- 已解锁和未解锁状态有明确区分。
- 局外结算、升级购买和已有持久化数据可以驱动解锁。

不做完整事件词条库、Boss 详情页、奖励路线收藏页、云同步、排行榜、付费、广告或 Cocos 正式工程追平，也不改 `levels.json`、`rewards.json`、无尽规则、每日规则和升级价格。

## 3. 交互

局外页切到 `图鉴` 面板后，右侧预览和主面板都不再显示占位说明，而是展示：

- 图鉴总览：已解锁数量 / 总数量
- 成就卡网格：名称、简述、状态
- 当前建议目标：离下一个可达成成就还差什么

第一版不做单独详情页，不做二级分类跳转，也不做复杂筛选。

## 4. 数据

外层本地存档 `dreamchasers:hulebu-shell:v1` 新增：

- `achievements: Record<string, string>`

key 为成就 id，value 为首次解锁时间的 ISO 字符串。

第一版成就建议至少包含：

- `mainline-first-clear`
- `boss-hulebu-king`
- `endless-first-step`
- `endless-layer-25`
- `daily-first-checkin`
- `daily-clear`
- `upgrade-first-buy`
- `upgrade-all-basic`

旧存档没有 `achievements` 时按空对象处理；已有 `bestEndlessLayer`、`dailyBestLevels`、`upgrades` 和历史结算可以在 hydration 后补算首批解锁状态。

## 5. 解锁原则

- 主线相关：基于主线结算和历史完成状态。
- 无尽相关：基于 `bestEndlessLayer`。
- 每日相关：基于 `dailyBestLevels` 和每日结算。
- 升级相关：基于三项升级等级总和。

第一版优先保证“稳定可解释”，不追求全量覆盖所有玩法细节。

## 6. 测试

- Web 测试锁定 `图鉴` 面板不再是占位文案。
- 测试锁定成就存档字段、成就卡文案和至少一组成就 id。
- `/games/hulebu` 桌面端和 390px 移动端都要能看到图鉴面板、成就状态和总览。
