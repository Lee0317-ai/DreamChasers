# T104 完成记录：胡了卜悬台窄腰模板调牌器实现

- 任务编号：T104
- 负责人：Lee
- 完成日期：2026-06-02
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/web/public/games/hulebu-demo/index.html`
- `apps/web/public/games/hulebu-demo/tuner.html`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `packages/shared/src/mahjong-config.test.ts`
- `docs/tasks/items/T104-hulebu-suspended-waist-template.md`
- `docs/tasks/claims/T104-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-02-lee.md`
- `docs/completion/2026-06-02-task-T104-hulebu-suspended-waist-template.md`

## 实现内容

- 新增 `suspended-waist` 密集牌山模板，中文名为 `悬台窄腰`。
- 模板包含 `top-platform / waist / support-column / side-scatter` 四类结构区域。
- 调牌器和 URL 参数支持 `template=suspended-waist`。
- 默认玩家页 auto 模板池暂不包含 `suspended-waist`。
- `suspended-waist` 固定模板生成后会强制重排首轮同解组暴露数，避免开局直接露出完整胡牌组。
- 同步站内静态副本，并保留 `/games/hulebu-demo/config/*.json` 绝对 fetch 路径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `npm run test -w apps/web -- hulebu`
- HTML 内联脚本 `node --check` 语法检查
- Kimi WebBridge 打开 `http://127.0.0.1:3000/games/hulebu-demo/tuner.html?template=suspended-waist&level=10&seed=waist-check`
- 390px Playwright 截图检查

## 验证结果

- `mahjong-config-playable-prototype`：11 个测试通过。
- `mahjong-config`：34 个测试通过。
- `hulebu`：3 个测试通过。
- HTML 内联脚本 `node --check` 语法检查通过。
- 桌面浏览器验证：模板为 `suspended-waist`，标题显示 `悬台窄腰`，生成 240 张牌，首轮可点 8 张，同组最多露出 2 张，未出现横向溢出。
- 390px 验证：无横向溢出，牌面和记牌器可读；截图保存到 `/tmp/hulebu-t104-suspended-waist-mobile.png`。

## 遗留问题

- `suspended-waist` 暂未加入默认玩家页 auto 随机池；需 Lee 验收读牌和入口节奏后另开任务决定。
- 当前只接入 HTML 原型和站内静态调牌器，未同步到 Cocos 共享生成器。
