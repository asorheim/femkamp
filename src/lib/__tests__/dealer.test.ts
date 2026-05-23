import { describe, it, expect } from "vitest";
import { getDealer } from "../dealer";
import type { Player } from "../../types";

const mkPlayers = (n: number): Player[] =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `P${i}`, icon: "🦊" }));

const dealersOver5Rounds = (players: Player[]): (string | undefined)[] =>
  [0, 1, 2, 3, 4].map((round) => getDealer(players, round)?.id);

describe("getDealer", () => {
  it("rotates through 5 players, one each over 5 rounds", () => {
    expect(dealersOver5Rounds(mkPlayers(5))).toEqual(["p0", "p1", "p2", "p3", "p4"]);
  });

  it("wraps around with 3 players over 5 rounds", () => {
    expect(dealersOver5Rounds(mkPlayers(3))).toEqual(["p0", "p1", "p2", "p0", "p1"]);
  });

  it("wraps around with 4 players over 5 rounds", () => {
    expect(dealersOver5Rounds(mkPlayers(4))).toEqual(["p0", "p1", "p2", "p3", "p0"]);
  });

  it("with 6 players, the 6th never deals in a 5-round game", () => {
    const dealers = dealersOver5Rounds(mkPlayers(6));
    expect(dealers).toEqual(["p0", "p1", "p2", "p3", "p4"]);
    expect(dealers).not.toContain("p5");
  });

  it("returns undefined for an empty player list", () => {
    expect(getDealer([], 0)).toBeUndefined();
  });
});
