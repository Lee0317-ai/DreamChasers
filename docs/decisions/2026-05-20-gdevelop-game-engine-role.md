# 决策记录：GDevelop 在游戏模块中的定位

**日期**：2026-05-20  
**状态**：已确认  
**相关任务**：T019, T020

## 背景

团队希望同时发展 Web 小游戏和微信/抖音小游戏。原规划使用 Cocos Creator 作为游戏主框架。调研 `4ian/GDevelop` 后，确认它适合 Web H5 原型和轻量小游戏快速生产，但不适合作为微信/抖音小游戏正式发布路径的唯一基础。

## 决策

- 保留 Cocos Creator 作为正式小游戏发布主线。
- 引入 GDevelop 作为 Web H5 原型和轻量小游戏生产通道。
- 网站侧游戏嵌入能力保持引擎无关，后续通过统一组件接入 Cocos Web 导出或 GDevelop HTML5 导出。
- 麻将 Roguelike 消除可以先用 GDevelop 验证 Web 原型，但关卡、奖励、规则配置必须保持可迁移到 Cocos。

## 不做

- 不用 GDevelop 替代 Cocos Creator。
- 不承诺 GDevelop 原生支持微信小游戏和抖音小游戏发布。
- 不在当前任务中导入 GDevelop 工程或实现游戏代码。

## 影响

- `T011` 游戏发布基础需要补充 GDevelop Web 导出说明。
- `T017` 麻将 Roguelike 消除需要保持规则和配置可迁移。
- 新增 `T020`，后续接入 GDevelop Web 游戏原型通道。

## 回滚

如果后续验证 GDevelop 不适合团队流程，可以撤销 `T020`，保留 Cocos Creator 单引擎路线。已写入的决策文档只需更新状态为“废弃”，不影响当前 Web 平台基础任务。
