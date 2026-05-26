import { describe, expect, it } from "vitest";
import {
  applyReward,
  createMahjongState,
  createMahjongTile,
  executeCombo,
  getAvailableBoardTiles,
  getComboCandidates,
  getRemainingTileCounts,
  getSlotStatus,
  getHuCandidate,
  isBoardClear,
  isTileBlocked,
  moveTileToSlot,
  type MahjongReward,
} from "./mahjong-game";

describe("胡了卜麻将规则模型", () => {
  it("主槽默认固定为 8 格", () => {
    const state = createMahjongState();

    expect(state.slotLimit).toBe(8);
  });

  it("检测三张相同牌为碰", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("a", "wan", 5),
        createMahjongTile("b", "wan", 5),
        createMahjongTile("c", "wan", 5),
      ],
      slot: ["a", "b", "c"],
    });

    expect(getComboCandidates(state)).toEqual([
      expect.objectContaining({
        type: "peng",
        tileIds: ["a", "b", "c"],
        labels: ["5万", "5万", "5万"],
      }),
    ]);
  });

  it("检测同花色连续三张为吃", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("a", "tiao", 2),
        createMahjongTile("b", "tiao", 3),
        createMahjongTile("c", "tiao", 4),
        createMahjongTile("noise", "wan", 3),
      ],
      slot: ["a", "b", "c", "noise"],
    });

    expect(getComboCandidates(state)).toEqual([
      expect.objectContaining({
        type: "chi",
        tileIds: ["a", "b", "c"],
        labels: ["2条", "3条", "4条"],
      }),
    ]);
  });

  it("四张相同牌同时提供杠和碰候选，杠优先展示", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("a", "tong", 8),
        createMahjongTile("b", "tong", 8),
        createMahjongTile("c", "tong", 8),
        createMahjongTile("d", "tong", 8),
      ],
      slot: ["a", "b", "c", "d"],
    });

    const candidates = getComboCandidates(state);

    expect(candidates[0]).toEqual(expect.objectContaining({ type: "gang", tileIds: ["a", "b", "c", "d"] }));
    expect(candidates[1]).toEqual(expect.objectContaining({ type: "peng", tileIds: ["a", "b", "c"] }));
  });

  it("字牌可以碰和杠，但不能吃", () => {
    const gangState = createMahjongState({
      tiles: [
        createMahjongTile("east-a", "honor", 1),
        createMahjongTile("east-b", "honor", 1),
        createMahjongTile("east-c", "honor", 1),
        createMahjongTile("east-d", "honor", 1),
      ],
      slot: ["east-a", "east-b", "east-c", "east-d"],
    });

    const gangCandidates = getComboCandidates(gangState);

    expect(gangCandidates[0]).toEqual(expect.objectContaining({
      type: "gang",
      tileIds: ["east-a", "east-b", "east-c", "east-d"],
      labels: ["东", "东", "东", "东"],
    }));
    expect(gangCandidates[1]).toEqual(expect.objectContaining({
      type: "peng",
      tileIds: ["east-a", "east-b", "east-c"],
      labels: ["东", "东", "东"],
    }));

    const pengState = createMahjongState({
      tiles: [
        createMahjongTile("east-a", "honor", 1),
        createMahjongTile("east-b", "honor", 1),
        createMahjongTile("east-c", "honor", 1),
        createMahjongTile("south", "honor", 2),
        createMahjongTile("west", "honor", 3),
      ],
      slot: ["east-a", "east-b", "east-c", "south", "west"],
    });

    const pengCandidates = getComboCandidates(pengState);

    expect(pengCandidates).toEqual([
      expect.objectContaining({
        type: "peng",
        tileIds: ["east-a", "east-b", "east-c"],
        labels: ["东", "东", "东"],
      }),
    ]);

    const chiState = createMahjongState({
      tiles: [
        createMahjongTile("east", "honor", 1),
        createMahjongTile("south", "honor", 2),
        createMahjongTile("west", "honor", 3),
      ],
      slot: ["east", "south", "west"],
    });

    expect(getComboCandidates(chiState)).toEqual([]);
  });

  it("非法组合不会产生候选，满槽且无救场资源时失败", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("a", "wan", 1),
        createMahjongTile("b", "wan", 3),
        createMahjongTile("c", "tong", 5),
      ],
      slot: ["a", "b", "c"],
      slotLimit: 3,
    });

    expect(getComboCandidates(state)).toEqual([]);
    expect(getSlotStatus(state)).toEqual({ status: "failed", candidates: [] });
  });

  it("主槽满时如果有组合，不会直接判负", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("a", "wan", 1),
        createMahjongTile("b", "wan", 2),
        createMahjongTile("c", "wan", 3),
      ],
      slot: ["a", "b", "c"],
      slotLimit: 3,
    });

    expect(getSlotStatus(state).status).toBe("combo_available");
  });

  it("执行组合会移除牌并结算局内积分和铜钱", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("a", "wan", 1),
        createMahjongTile("b", "wan", 2),
        createMahjongTile("c", "wan", 3),
      ],
      slot: ["a", "b", "c"],
      bonuses: { chi: 8, peng: 0, gang: 0, hu: 0 },
    });
    const [candidate] = getComboCandidates(state);

    const next = executeCombo(state, candidate);

    expect(next.slot).toEqual([]);
    expect(next.score).toBe(18);
    expect(next.coins).toBe(3);
    expect(next.tiles.every((tile) => tile.location === "removed")).toBe(true);
  });

  it("槽内 8 张组成 3+3+2 时可以胡并一次消除 8 张", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("chi-1", "wan", 1),
        createMahjongTile("chi-2", "wan", 2),
        createMahjongTile("chi-3", "wan", 3),
        createMahjongTile("peng-1", "honor", 5),
        createMahjongTile("peng-2", "honor", 5),
        createMahjongTile("peng-3", "honor", 5),
        createMahjongTile("pair-1", "tong", 8),
        createMahjongTile("pair-2", "tong", 8),
      ],
      slot: ["chi-1", "chi-2", "chi-3", "peng-1", "peng-2", "peng-3", "pair-1", "pair-2"],
    });

    const candidate = getHuCandidate(state);
    const candidates = getComboCandidates(state);

    expect(candidate).toEqual(expect.objectContaining({
      type: "hu",
      tileIds: ["chi-1", "chi-2", "chi-3", "peng-1", "peng-2", "peng-3", "pair-1", "pair-2"],
      labels: ["1万", "2万", "3万", "中", "中", "中", "8筒", "8筒"],
    }));
    if (!candidate) {
      throw new Error("Expected a hu candidate.");
    }
    expect(candidates[0]?.type).toBe("hu");

    const next = executeCombo(state, candidate);

    expect(next.slot).toEqual([]);
    expect(next.score).toBe(120);
    expect(next.coins).toBe(12);
    expect(next.tiles.every((tile) => tile.location === "removed")).toBe(true);
  });

  it("备用槽不参与胡牌判定", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("chi-1", "wan", 1),
        createMahjongTile("chi-2", "wan", 2),
        createMahjongTile("chi-3", "wan", 3),
        createMahjongTile("peng-1", "honor", 5),
        createMahjongTile("peng-2", "honor", 5),
        createMahjongTile("peng-3", "honor", 5),
        createMahjongTile("pair-1", "tong", 8),
        createMahjongTile("pair-2", "tong", 8, { location: "reserve" }),
      ],
      slot: ["chi-1", "chi-2", "chi-3", "peng-1", "peng-2", "peng-3", "pair-1"],
      reserve: ["pair-2"],
    });

    expect(getHuCandidate(state)).toBeNull();
  });

  it("扩槽奖励不会把主槽推到 8 格以上", () => {
    const reward: MahjongReward = {
      id: "legacy_slot_plus",
      name: "旧扩槽",
      effects: [
        { type: "slot_limit_delta", value: 2 },
      ],
    };

    const next = applyReward(createMahjongState({ slotLimit: 8 }), reward);

    expect(next.slotLimit).toBe(8);
  });

  it("胜利条件只要求牌山清空，槽位孤张可以保留", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("slot", "wan", 1),
        createMahjongTile("reserve", "tiao", 2, { location: "reserve" }),
        createMahjongTile("removed", "tong", 3, { location: "removed" }),
      ],
      slot: ["slot"],
      reserve: ["reserve"],
    });

    expect(isBoardClear(state)).toBe(true);
  });

  it("余牌统计会排除已移除牌，保留牌面、槽位和备用槽", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("board", "wan", 1, { location: "board" }),
        createMahjongTile("slot", "wan", 1),
        createMahjongTile("reserve", "tiao", 2, { location: "reserve" }),
        createMahjongTile("removed", "tong", 3, { location: "removed" }),
      ],
      slot: ["slot"],
      reserve: ["reserve"],
    });

    const counts = getRemainingTileCounts(state);

    expect(counts.wan.total).toBe(2);
    expect(counts.wan.ranks[1]).toBe(2);
    expect(counts.tiao.total).toBe(1);
    expect(counts.tong.total).toBe(0);
  });

  it("只允许点击未被上层牌遮挡的牌", () => {
    const state = createMahjongState({
      tiles: [
        createMahjongTile("lower", "wan", 1, { location: "board", blockedBy: ["upper"] }),
        createMahjongTile("upper", "wan", 2, { location: "board" }),
      ],
    });

    expect(isTileBlocked(state, "lower")).toBe(true);
    expect(getAvailableBoardTiles(state).map((tile) => tile.id)).toEqual(["upper"]);

    const afterUpperMoved = moveTileToSlot(state, "upper");

    expect(isTileBlocked(afterUpperMoved, "lower")).toBe(false);
    expect(getAvailableBoardTiles(afterUpperMoved).map((tile) => tile.id)).toEqual(["lower"]);
  });

  it("Roguelike 奖励可以修改槽位、道具和组合倍率", () => {
    const reward: MahjongReward = {
      id: "starter_build",
      name: "顺手开局",
      effects: [
        { type: "slot_limit_delta", value: 1 },
        { type: "tool_delta", tool: "undo", value: 1 },
        { type: "combo_score_bonus", combo: "gang", value: 25 },
      ],
    };

    const next = applyReward(createMahjongState({ slotLimit: 8 }), reward);

    expect(next.slotLimit).toBe(8);
    expect(next.tools.undo).toBe(1);
    expect(next.bonuses.gang).toBe(25);
  });
});
