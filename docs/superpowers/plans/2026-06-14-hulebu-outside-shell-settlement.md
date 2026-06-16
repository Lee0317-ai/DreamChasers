# 胡了卜局外首页和结算面板实施计划

## 目标

把 `/games/hulebu` 从“直接打开 iframe”推进到“先进入局外页，再进入主线，结束后回到结算”的完整壳层。

## 实施步骤

1. 先补 Web 侧测试，锁定：
   - `开始挑战 / 继续本轮 / 升级 / 图鉴 / 无尽 / 每日`
   - `结算`
   - `embed=shell`
   - 静态 Demo 的父页面消息桥接
2. 实现 `HulebuGamePage` 的三态壳层：
   - `lobby`
   - `playing`
   - `settlement`
3. 给静态 Demo 增加 `embed=shell` 模式和 `postMessage` 最小事件。
4. 同步静态副本 `apps/web/public/games/hulebu-demo/index.html`。
5. 跑 `apps/web` 测试、内联脚本语法检查、浏览器桌面/移动验证。
6. 更新模块文档、任务分片、领取分片、当天进展和完成记录。

## 验收重点

- 玩家进入 `/games/hulebu` 先看到局外页，而不是裸牌桌。
- 牌桌结束后一定回到站内结算，而不是只停在 iframe 内部按钮。
- `升级 / 图鉴 / 无尽 / 每日` 已有可见入口，但不会假装已经实现。
- 不压缩或破坏现有 20 关主线牌桌体验。
