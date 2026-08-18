# Cocos 接入说明

## 节点结构

```text
DiscardFlowRoot
├── DiscardEntryButton
├── HelperRibbon
├── HandSelectionOverlay
│   └── SelectionFrame
├── ConfirmBar
│   ├── CancelButton
│   └── ConfirmButton
├── RiverPanel
└── SuccessBadge
```

## 关键规则

- `DiscardFlowRoot` 应位于主槽之上、牌山之下，不创建全屏遮罩。
- `SelectionFrame` 跟随被选中的槽位牌，不替换牌面 Sprite。
- `ConfirmBar` 只在存在选中牌时显示。
- 点击其他手牌可直接切换选中项；点击取消或再次点击弃牌入口退出模式。
- 执行确认前继续由现有规则层校验河牌容量，UI 不自行修改容量或牌局状态。
- 按钮和长条可使用 `Sliced`，选择框保持 `Simple`。

具体九宫格边距与 Sprite 类型以 `manifest.json` 为准；资源锚点统一为 `(0.5, 0.5)`。
