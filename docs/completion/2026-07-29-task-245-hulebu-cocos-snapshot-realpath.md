# T245 胡了卜 Cocos 快照真实路径完成记录

- 任务编号：T245
- 负责人：Lee
- 完成验证日期：2026-07-29
- 分支：`codex/t244-hulebu-core-architecture`

## 修改文件

- 构建包装器：`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`
- 发布回归测试：`packages/shared/src/hulebu-cocos-release.test.ts`
- T245 任务、领取、进展、完成和麻将 Roguelike 模块交接文档

## 实现内容

- production 构建在校验 source snapshot 和物化正式源码时统一解析工作树真实路径。
- symlink worktree 不再把链接路径与真实 snapshot 根目录混用，避免合法干净源码被错误拒绝或定位到错误目录。
- 新增回归测试覆盖符号链接工作树场景，固定 `realpath` 口径。

## 验证命令与结果

```bash
npm run test -w packages/shared -- hulebu-cocos-release
```

- 结果：通过，`189/189` 项测试。

```bash
npm run game:hulebu:build
npm run game:hulebu:verify-build
```

- 结果：精确提交 `1bc4867cf56919b1230307297d9d4600b4f6bb4f` 的 Creator 3.8.8 production build 与 verify-only 均通过；build id 为 `1bc4867cf569-20260729T150509Z`，source state 为 `clean`，5 条 HTTP smoke 均为 `200`。

```bash
git diff --check
```

- 结果：通过。

## 遗留问题

- T245 无自身遗留问题。
- `1280x720` 横屏下组合栏、卡槽和部分 HUD 超出可见区属于 T244 的正式包交互 smoke 阻塞，且需要独立 UI/layout 任务处理，不属于 T245 路径修复范围。
