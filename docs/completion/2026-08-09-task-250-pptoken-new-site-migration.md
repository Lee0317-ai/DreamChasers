# T250 完成记录：PPTOKEN 图片生成切换新站

- 任务编号：T250
- 负责人：Lee
- 完成日期：2026-08-09

## 修改文件

- `/Users/lee/.codex/skills/pptoken-imagegen/SKILL.md`
- `/Users/lee/.codex/skills/pptoken-imagegen/scripts/pptoken_imagegen.py`
- `.env.example`
- `apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T250-pptoken-new-site-migration.md`
- `docs/tasks/claims/T250-lee.md`
- `docs/progress/2026-08-09-lee.md`
- 本完成记录及 `npm run docs:sync` 自动生成的主文档摘要

## 实现内容

- 图片生成默认切换到 PPTOKEN 新站直连 API，仍使用 Bearer 鉴权。
- 增加网页代理 transport，按新站协议发送 `manual_key`、空 `saved_key_id` 和嵌套 `payload`。
- 支持 `url` 与 `b64_json` 两种结果；可信 PPTOKEN HTTPS 下载地址自动携带 Bearer，解决此前 403。
- 错误信息中的 API Key 自动脱敏，真实密钥不落盘。
- 项目默认 PPTOKEN base URL 和测试样例同步切换到 `.cc`。

## 验证命令

- `python3 /tmp/pptoken-imagegen-update/test_pptoken_imagegen.py`
- `python3 /Users/lee/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/lee/.codex/skills/pptoken-imagegen`
- `npm run test -w apps/web -- provider-readiness`
- `npm run docs:sync`
- 旧域名残留扫描、UTF-8 无 BOM 检查、`git diff --check`

## 验证结果

- 技能本地测试 4 项通过。
- 技能结构校验通过。
- Web 目标测试 1 个文件、5 项测试全部通过。
- API Key 未写入仓库或个人技能文件。

## 遗留问题

- 当前 shell 未持久设置 `PPTOKEN_API_KEY`，因此本任务没有额外消耗额度做真实生成；此前新站直连请求已验证可达。
- 网页代理模式作为直连失败或显式要求时的备用路径，默认仍使用更直接的 API endpoint。
