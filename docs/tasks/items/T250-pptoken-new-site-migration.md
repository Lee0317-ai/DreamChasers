# T250：PPTOKEN 图片生成切换新站

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：现有 OpenAI-compatible 图片 provider 和本机 `pptoken-imagegen` 技能
- 阻塞：无
- 允许修改文件：`.env.example`、`apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/tasks/items/T250-pptoken-new-site-migration.md`、`docs/tasks/claims/T250-lee.md`、`docs/progress/2026-08-09-lee.md`、`docs/completion/2026-08-09-task-250-pptoken-new-site-migration.md`、`docs/tasks/TASK_BOARD.md`、`docs/tasks/CLAIMS.md`、`docs/status/CURRENT_STATUS.md`、`docs/progress/2026-08-09.md`
- 禁止修改范围：真实 API Key、本地 `.env`、图片 provider 业务逻辑、AI 修图工作流、Cocos 工程、正式 UI 资源、历史进展事实记录和其他模块
- 验证方式：`npm run test -w apps/web -- provider-readiness`；旧域名残留扫描；`npm run docs:sync`；UTF-8 无 BOM 检查；`git diff --check`

## 目标

把可执行图片生成链路和项目默认配置统一切换到 PPTOKEN 新站：

1. 本机 `pptoken-imagegen` 技能默认使用 `https://api.pptoken.cc/v1`。
2. 生成命令兼容新站直连 Bearer 请求和网页代理封装。
3. 支持 `url` 与 `b64_json` 两种图片返回，并修复受保护 URL 下载时的 403。
4. 项目 `.env.example` 和 provider readiness 测试样例改用新站域名。

## 不做

- 不把 API Key 写入仓库或技能文件。
- 不改现有 OpenAI-compatible provider 的通用实现。
- 不重写历史文档中对旧站调用结果的事实记录。
- 不在本任务生成新的正式 UI 图片。

## 验收标准

- 技能中不存在 `api.pptoken.org`，默认直连新站，代理模式请求体包含 `manual_key`、`saved_key_id` 和 `payload`。
- 本地单元测试覆盖新站默认值、Base64 解码、鉴权 URL 下载和代理封装。
- 项目运行配置示例不再指向旧站，provider readiness 回归测试通过。
- 所有修改文件保持 UTF-8 无 BOM，文档同步和 diff 检查通过。

## 完成结果

- 本机 `pptoken-imagegen` 技能默认域名已改为 `https://api.pptoken.cc/v1`，并新增网页代理 transport。
- 技能脚本已支持 `b64_json` 和鉴权 URL 两种返回；鉴权只发送给 HTTPS 的可信 PPTOKEN 域名。
- 技能本地 4 项测试和 `quick_validate.py` 均通过。
- 项目 `.env.example` 与 provider readiness 测试样例已切换到新站域名，目标测试 5 项通过。
- API Key 未写入技能、仓库或生成文档。
