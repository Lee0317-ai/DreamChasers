# T265：胡了卜 Cocos 顶部 HUD、记牌器与已碰牌池优化

- 任务编号：T265
- 负责人：Lee
- 状态：已完成
- 来源：Lee 对 T264 production 的五项 UI 验收反馈
- 目标：让记牌器展开层紧贴入口下方；消除关卡/分数 HUD 的程序化底板和烘焙值重叠；给余牌接正式 UI；在右上角提供退出；把现有副露数据呈现为明确的已碰牌池。
- 允许修改：`GameSceneController.ts`、`MeldRiverLayerBinder.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T265 分片、麻将模块文档、当天进展/完成记录及 docs:sync 主文档。
- 禁止修改：副露/补杠规则、计分规则、关卡配置、牌山生成、存档协议、正式原图、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：`npm run test -w packages/shared -- mahjong-cocos-project`；Cocos TypeScript；精确提交 production build；verify-only；竖屏 production HUD/记牌器/已碰牌池目检；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：记牌器面板顶部位于入口下方且不依赖牌山坐标；关卡和分数不再露出程序化白底或重复数字；余牌使用正式金边深绿 HUD；右上角退出可回到局外；碰/杠/补杠副露显示在带标题的牌池内且继续消费原 `openMeldNodes`。

## 进展

- 2026-08-11：任务登记并由 Lee 领取，已确认顶部重叠来自正式图片烘焙文字与运行时动态层叠加，副露数据与补杠识别链路已经存在。
- 2026-08-11：关卡、分数和余牌正式 HUD 已统一增加动态内容面，正式 Sprite 加载成功后清空程序化底板；图片内烘焙的 `1-1 / 0 / ×16` 不再与运行时值叠加。
- 2026-08-11：记牌器展开位置已固定为入口下方左对齐；右上角新增 `×` 退出入口并复用现有回局外流程。
- 2026-08-11：`MeldRiverLayerBinder` 会把既有 `openMeldNodes` 放入“已碰牌池”，空态明确显示暂无，最多紧凑展示四组碰/杠/补杠；补杠识别和副露数据结构未修改。
- 2026-08-11：共享测试 `40/40`、Cocos TypeScript、精确提交 production build 和 verify-only 均通过；build ID `e1733c74fff7-20260811T064949Z`，5 条 smoke 路径返回 `200`。内置自动化受本地 URL 策略限制，最终视觉留给 Lee 刷新 `http://127.0.0.1:4173/` 直接验收。

## 完成摘要

- 顶部 HUD 已从“烘焙文字图片再叠动态值”改成正式金边底图加单一动态内容面。
- 记牌器、余牌和退出入口都进入固定竖屏信息架构。
- 已碰牌池继续消费原 `openMeldNodes`，不会与补杠判定产生第二套状态。
