# T268 胡了卜完整局外与引导 UI 体系设计完成记录

- 完成时间：2026-08-11
- 负责人：Lee
- 任务编号：T268
- 状态：已完成

## 修改文件

- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T268-hulebu-complete-ui-flow-design.md`
- `docs/tasks/claims/T268-lee.md`
- `docs/progress/2026-08-11-lee.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- 当前会话专属可视化目录中的交互稿与复用素材副本

## 实现内容

- 建立完整竖屏体验架构：账号进入、标题大厅、模式选择、主线地图、关卡准备、局内教学、提示、暂停设置、奖励和胜负结算。
- 将主线闯关、无尽牌山、每日牌局、高阶周目、成就图鉴统一到一个模式入口，并区分可用、进行中、可领取和未解锁状态。
- 复用 formal-v1 的青玉、金红、深木、象牙纸视觉基线和现有场景/牌面资源，避免另起一套视觉系统。
- 输出 formal-v1 可复用资产与后续必须新增的局外正式资源清单。

## 验证命令与结果

- HTML 字面量转义扫描：通过，无错误 `\\"` 或 `\\n`。
- JavaScript `node --check`：通过。
- 九个核心页面 `390×844` 边界检查：通过，`bad=[]`，无横向或纵向溢出。
- 登录至结算八步关键交互检查：通过，`allPassed=true`。
- 浏览器控制台错误/警告检查：通过，无页面运行错误。
- `npm run docs:sync`：通过。
- UTF-8 无 BOM 检查：通过。
- `git diff --check`：通过。

## 遗留问题

- 当前交付是体验设计和交互原型，不是 Cocos Scene、Prefab 或正式 PNG 资源包。
- 登录品牌、局外卡片、模式徽章、关卡地图、图鉴分类和胜负结算仍需要正式切图与 Cocos 命名清单。
- 设计评审通过后，应另开局外资源生成任务与四批 Cocos 接入任务，避免一次性修改全部 Scene。
