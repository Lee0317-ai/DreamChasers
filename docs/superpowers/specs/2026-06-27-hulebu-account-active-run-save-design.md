# 胡了卜账号级当前本轮存档设计

## 目标

登录用户的未完成胡了卜本轮不只保存在本地缓存，也保存到账号进度。用户换浏览器或换设备登录后，仍可看到 `继续本轮`，并恢复到当前关或无尽当前层开局。

## 范围

- 账号进度新增 `activeRun` JSON 字段。
- `GET /api/games/hulebu/progress` 返回 `activeRun`。
- `POST /api/games/hulebu/progress` 接受并保存 `activeRun`。
- 前端初始同步时合并本地和账号 `activeRun`，优先选择 `updatedAt` 更新的快照。
- 失败或通关后保存 `activeRun: null`。

## 不做

- 不保存完整牌桌中局状态。
- 不恢复卡槽、牌河、事件弹窗或奖励选择弹窗。
- 不做冲突解决 UI；先自动选择更新快照。

## 数据结构

`activeRun` 保存 T187 的 resume snapshot，并增加 `updatedAt`：

```ts
{
  sessionKey: string;
  runMode: "mainline" | "endless" | "daily";
  runArchetype: "chi" | "peng" | "gang" | "hu" | "tool" | "vision";
  ascensionLevel: number | null;
  ascensionName: string | null;
  ascensionPerks: string[];
  dailySeed: string | null;
  latestCoins: number;
  latestScore: number;
  latestLevelOrder: number;
  latestEndlessLayer: number;
  latestSummary: string;
  pickedRewards: number;
  updatedAt: string;
}
```

## 合并规则

- 本地有、账号无：使用本地，并回写账号。
- 账号有、本地无：使用账号，并写入本地。
- 两边都有：比较 `updatedAt`，选择较新的快照。
- 快照缺少 `sessionKey` 或 `updatedAt`：视为无效。

## 验证

- Prisma validate 通过。
- Web hulebu 测试覆盖 schema、API payload、account lib 和前端同步字符串。
- Typecheck 和 build 通过。
