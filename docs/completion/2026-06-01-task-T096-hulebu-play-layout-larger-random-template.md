# T096 胡了卜玩家页布局、牌面放大和模板随机调参完成记录

- 任务编号：T096
- 负责人：Lee
- 完成日期：2026-06-01
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md`, `docs/tasks/claims/T096-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`

## 实现内容

- 默认玩家页进一步压缩外层留白、顶部 HUD、卡槽和状态栏，主栏调整为 `480px`，右侧道具栏调整为 `72px`。
- 密集牌山规则牌尺寸从 `45x60` 放大为 `52x70`，CSS 牌宽同步调整为 `9.2857142857%`。
- 默认普通密集关 `auto` 模板改为按 seed/重开随机选择。
- 新增 auto 模板候选回退：候选模板生成失败或首轮可点超过 8 时，会按确定顺序尝试下一个安全模板。
- 调牌器保留完整 8 模板手动指定能力；玩家页 auto 候选池用于朋友试玩稳定性。
- 牌山主堆权重从 `1.8` 提高到 `2.45`，让多数牌更集中在主牌山中。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- Kimi WebBridge 打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?level=5&mode=mountain&seed=epsilon`
- `curl -I -s http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md docs/tasks/claims/T096-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`
- `git diff --check`

## 验证结果

- `mahjong-config-playable-prototype` 测试通过。
- `mahjong-config` 测试通过，2 个测试文件 28 个测试通过。
- HTML 脚本 `node --check` 通过。
- 本地 3031 页面返回 `HTTP/1.0 200 OK`。
- Kimi WebBridge 验证第 5 关 `seed=epsilon`：1512x682 视口无横向/纵向溢出，牌桌约 `396x452`，牌面约 `37x49`，生成 240 张、可见 43 张、首轮可点 8 张，模板显示为 `环形`。

## 遗留问题

- 本任务没有实现 T094 的残局收官、牌引或牌河。
- 前 4 关教学仍需要改为必须真实发动教学组合才过关。
- `丢弃` 仍是移除主槽末尾牌，后续应改为玩家选择槽位任意一张。
- 玩家页记牌器仍未实现。
