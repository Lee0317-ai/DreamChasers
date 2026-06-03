# T105 完成记录：胡了卜震落牌平铺和遮挡点击修复

- 任务编号：T105
- 负责人：Lee
- 完成日期：2026-06-03
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/web/public/games/hulebu-demo/index.html`
- `packages/shared/src/mahjong-config.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md`
- `docs/tasks/claims/T105-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T105-hulebu-loose-tile-layer-blocking-fix.md`

## 实现内容

- 为震落牌增加全局递增的平铺序号，连续多次 `杠 / 胡` 不再复用同一组落点。
- 震落牌落地时清理旧 `stackColumn / stackBridge / blockedBy` 等堆叠元数据，保持为桌面平铺层可点击牌。
- 运行态普通牌遮挡判定计入震落牌；震落牌盖住普通下层牌时，下层牌不可点击。
- 保留震落牌自身可点击入槽的口径。
- 同步站内静态 Demo 副本，并保留 `/games/hulebu-demo/config/*.json` 绝对 fetch 路径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config`
- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w apps/web -- hulebu`
- HTML 内联脚本 `node --check` 语法检查
- Kimi WebBridge 打开 `http://localhost:3000/games/hulebu-demo/index.html` 执行震落牌行为检查
- Chrome 390px 截图和 DOM 布局检查
- `npm run docs:sync`
- 占位符扫描
- `git diff --check`

## 验证结果

- `mahjong-config`：34 个测试通过。新增回归覆盖连续震落牌 0 重叠、震落牌自身可点击、被震落牌覆盖的普通下层牌不可点击。
- `mahjong-config-playable-prototype`：11 个测试通过。
- `apps/web hulebu`：3 个测试通过。
- HTML 内联脚本语法检查通过。
- Kimi WebBridge 行为检查：发布副本使用 `/games/hulebu-demo/config/levels.json`，连续 6 张震落牌 `overlapPairs=0`，震落牌全部可点击，被覆盖普通牌 `underBlocked=true`。
- 390px 检查：无横向溢出；卡槽本体位于固定道具栏上方，0 个槽位被遮盖；截图保存到 `/tmp/hulebu-t105-mobile.png` 和 `/tmp/hulebu-t105-cdp-mobile.png`。

## 遗留问题

- 本任务只修复 HTML 原型和站内静态副本，未同步到 Cocos 正式工程；如后续 Cocos 也落地 `杠 / 胡` 开山震落，需要单独迁移同样的平铺和遮挡规则。
- T104 的 `悬台窄腰` 模板仍待 Lee 试玩验收后决定是否加入默认高压关 auto 池。
