import { describe, expect, it } from "vitest";
import { createMahjongState, createMahjongTile } from "./mahjong-game";
import { createMahjongPresentationSnapshot } from "./mahjong-presentation";
import { createMahjongCocosSceneModel } from "./mahjong-cocos-scene";

describe("胡了卜 Cocos 场景视图模型", () => {
  it("把表现层快照转换成 Cocos 节点、控件和 HUD 可绑定的数据", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("base", "wan", 9, {
          location: "board",
          layer: 0,
          blockedBy: ["top"],
        }),
        createMahjongTile("top", "honor", 5, {
          location: "board",
          layer: 1,
        }),
        createMahjongTile("peng-a", "tong", 2),
        createMahjongTile("peng-b", "tong", 2),
        createMahjongTile("peng-c", "tong", 2),
      ],
      slot: ["peng-a", "peng-b", "peng-c"],
      score: 42,
      coins: 7,
    });
    const snapshot = createMahjongPresentationSnapshot(state, {
      layoutByTileId: {
        base: {
          x: 80,
          y: 110,
          sourcePackage: "stack-01",
          stackDepth: 2,
        },
        top: {
          x: 88,
          y: 102,
          sourcePackage: "stack-01",
          stackDepth: 1,
        },
      },
    });

    const sceneModel = createMahjongCocosSceneModel(snapshot, {
      boardOrigin: { x: -310, y: 190 },
      tileSize: { width: 72, height: 98 },
      boardScale: 0.8,
    });

    expect(sceneModel.boardNodes).toEqual([
      expect.objectContaining({
        name: "Tile_base",
        tileId: "base",
        label: "9万",
        position: { x: -246, y: 102 },
        zIndex: 0,
        interactable: false,
        dimmed: true,
        prefabKey: "tile.wan.9",
        sourcePackage: "stack-01",
        stackDepth: 2,
      }),
      expect.objectContaining({
        name: "Tile_top",
        tileId: "top",
        label: "中",
        position: { x: -240, y: 108 },
        zIndex: 100,
        interactable: true,
        dimmed: false,
        prefabKey: "tile.honor.5",
        sourcePackage: "stack-01",
        stackDepth: 1,
      }),
    ]);
    expect(sceneModel.slotNodes.slice(0, 4)).toEqual([
      expect.objectContaining({ name: "Slot_0", tileId: "peng-a", label: "2筒", occupied: true }),
      expect.objectContaining({ name: "Slot_1", tileId: "peng-b", label: "2筒", occupied: true }),
      expect.objectContaining({ name: "Slot_2", tileId: "peng-c", label: "2筒", occupied: true }),
      expect.objectContaining({ name: "Slot_3", tileId: null, label: null, occupied: false }),
    ]);
    expect(sceneModel.comboControls).toEqual([
      expect.objectContaining({ name: "Combo_Hu", combo: "hu", interactable: false, badgeText: "0" }),
      expect.objectContaining({ name: "Combo_Gang", combo: "gang", interactable: false, badgeText: "0" }),
      expect.objectContaining({ name: "Combo_Peng", combo: "peng", interactable: true, badgeText: "1" }),
      expect.objectContaining({ name: "Combo_Chi", combo: "chi", interactable: false, badgeText: "0" }),
    ]);
    expect(sceneModel.hud).toEqual(expect.objectContaining({
      boardRemainingText: "余牌 2",
      slotStatusText: "可继续",
      scoreText: "分 42",
      coinsText: "铜钱 7",
    }));
  });
});
