import { describe, expect, it } from "vitest";
import { createMahjongState, createMahjongTile } from "./mahjong-game";
import { createMahjongPresentationSnapshot } from "./mahjong-presentation";

describe("胡了卜正式表现层快照", () => {
  it("把规则状态转换为 Cocos/GDevelop 可消费的牌山、槽位、按钮和 HUD 快照", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("covered", "wan", 9, {
          location: "board",
          layer: 0,
          blockedBy: ["cover"],
        }),
        createMahjongTile("cover", "honor", 1, {
          location: "board",
          layer: 1,
        }),
        createMahjongTile("peng-a", "tong", 2),
        createMahjongTile("peng-b", "tong", 2),
        createMahjongTile("peng-c", "tong", 2),
        createMahjongTile("reserve-a", "tiao", 5, {
          location: "reserve",
        }),
      ],
      slot: ["peng-a", "peng-b", "peng-c"],
      reserve: ["reserve-a"],
      reserveLimit: 2,
      shields: 1,
      score: 30,
      coins: 4,
      tools: {
        shuffle: 1,
        undo: 0,
        vision: 2,
      },
    });

    const snapshot = createMahjongPresentationSnapshot(state, {
      layoutByTileId: {
        covered: {
          x: 120,
          y: 160,
          sourcePackage: "stack-a",
          stackDepth: 2,
        },
        cover: {
          x: 124,
          y: 152,
          sourcePackage: "stack-a",
          stackDepth: 1,
        },
      },
    });

    expect(snapshot.board).toEqual([
      expect.objectContaining({
        id: "covered",
        label: "9万",
        layer: 0,
        x: 120,
        y: 160,
        sourcePackage: "stack-a",
        stackDepth: 2,
        blocked: true,
        available: false,
        blockers: ["cover"],
      }),
      expect.objectContaining({
        id: "cover",
        label: "东",
        layer: 1,
        x: 124,
        y: 152,
        sourcePackage: "stack-a",
        stackDepth: 1,
        blocked: false,
        available: true,
        blockers: [],
      }),
    ]);
    expect(snapshot.slot.capacity).toBe(8);
    expect(snapshot.slot.cells.slice(0, 4)).toEqual([
      expect.objectContaining({ index: 0, tileId: "peng-a", label: "2筒" }),
      expect.objectContaining({ index: 1, tileId: "peng-b", label: "2筒" }),
      expect.objectContaining({ index: 2, tileId: "peng-c", label: "2筒" }),
      expect.objectContaining({ index: 3, tileId: null, label: null }),
    ]);
    expect(snapshot.reserve.cells).toEqual([
      expect.objectContaining({ index: 0, tileId: "reserve-a", label: "5条" }),
      expect.objectContaining({ index: 1, tileId: null, label: null }),
    ]);
    expect(snapshot.comboButtons).toEqual([
      expect.objectContaining({
        type: "hu",
        enabled: false,
        candidateCount: 0,
      }),
      expect.objectContaining({
        type: "gang",
        enabled: false,
        candidateCount: 0,
      }),
      expect.objectContaining({
        type: "peng",
        enabled: true,
        candidateCount: 1,
        firstCandidateKey: "peng:peng-a,peng-b,peng-c",
      }),
      expect.objectContaining({
        type: "chi",
        enabled: false,
        candidateCount: 0,
      }),
    ]);
    expect(snapshot.hud).toEqual(expect.objectContaining({
      boardRemaining: 2,
      slotStatus: "open",
      score: 30,
      coins: 4,
      tools: {
        shuffle: 1,
        undo: 0,
        vision: 2,
      },
      shields: 1,
    }));
    expect(snapshot.remaining.honor.total).toBe(1);
    expect(snapshot.remaining.tong.ranks[2]).toBe(3);
  });
});
