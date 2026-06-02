# T095 胡了卜混合窗口牌山生成器完成记录

- 任务编号：T095
- 负责人：Lee
- 完成日期：2026-06-01
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`, `docs/tasks/claims/T095-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`

## 实现内容

- 将密集牌山可解路径拆成 `solutionGroup` 和 `solutionStep` 两层：`solutionGroup` 表示最终可消答案组，`solutionStep` 表示释放窗口。
- 新增混合窗口生成逻辑，让相邻答案组的牌分散到不同释放窗口，避免玩家首轮直接看到三张同组答案。
- 新增 `mixedWindowRole` 标记，区分 `hold / lure / finish / direct` 等窗口角色，后续可作为调牌器或调试信息。
- 默认普通密集关在运行态对首轮实际可点击窗口做重平衡，保证同一 `solutionGroup` 最多露出 2 张。
- 牌面 DOM 输出 `data-mixed-window-role`，测试可直接检查混合窗口信号。
- 保持胡牌重点关和 Boss 目标关不做运行态重平衡，避免破坏胡牌包和 Boss 目标可解性。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`
- 运行态 VM 抽样默认第 1 关首轮可点击窗口。
- Kimi WebBridge 打开真实页面第 5 关，检查首轮可点击窗口。
- `curl -I --max-time 3 http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md docs/tasks/claims/T095-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`
- `git diff --check`

## 验证结果

- `mahjong-config-playable-prototype` 测试通过，覆盖混合窗口函数、`mixedWindowRole` 和 DOM 数据标记。
- `mahjong-config` 测试通过，2 个测试文件 28 个测试通过，覆盖默认密集牌山和朋友试玩第 5 关首轮窗口。
- HTML 脚本 `node --check` 通过。
- 运行态抽样：第 1 关首轮 8 张可点、最大同组 2 张；Kimi WebBridge 打开真实页面第 5 关，首轮 7 张可点、最大同组 2 张。
- 本地 3031 服务返回 `HTTP/1.0 200 OK`。

## 遗留问题

- 本任务只解决“顶层三张就是答案”的顺序牌山问题，未实现 T094 的残局收官、牌引或牌河。
- 前 4 关教学仍需要后续改为必须真实发动教学组合才过关。
- `丢弃` 仍是移除主槽末尾牌，后续应改为玩家选择槽位任意一张。
- 玩家页记牌器、牌面放大和更强吃碰冲突诱饵仍应另开任务继续。
