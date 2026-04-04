import { describe, it, expect } from "vitest";
import { calculateRoundScore, calculateTotalScores, getWinners } from "../scoring";
import type { Player, RoundScore } from "../../types";

const players: Player[] = [
  { id: "p1", name: "Kreps", icon: "🃏" },
  { id: "p2", name: "Bestemor", icon: "🎴" },
  { id: "p3", name: "Bestefar", icon: "👑" },
  { id: "p4", name: "Solveig", icon: "🎩" },
];

describe("calculateRoundScore", () => {
  it("pass: 1 point per trick", () => {
    const round: RoundScore = { type: "pass", counts: { p1: 3, p2: 5, p3: 2, p4: 3 } };
    expect(calculateRoundScore(round, players)).toEqual({ p1: 3, p2: 5, p3: 2, p4: 3 });
  });

  it("klover: 1 point per club", () => {
    const round: RoundScore = { type: "klover", counts: { p1: 4, p2: 3, p3: 6, p4: 0 } };
    expect(calculateRoundScore(round, players)).toEqual({ p1: 4, p2: 3, p3: 6, p4: 0 });
  });

  it("dame: 4 points per queen", () => {
    const round: RoundScore = { type: "dame", queenAssignments: { spades: "p1", hearts: "p1", diamonds: "p2", clubs: "p3" } };
    expect(calculateRoundScore(round, players)).toEqual({ p1: 8, p2: 4, p3: 4, p4: 0 });
  });

  it("dame: unassigned queens give no points", () => {
    const round: RoundScore = { type: "dame", queenAssignments: { spades: "p1" } };
    expect(calculateRoundScore(round, players)).toEqual({ p1: 4, p2: 0, p3: 0, p4: 0 });
  });

  it("grand: -1 point per trick", () => {
    const round: RoundScore = { type: "grand", counts: { p1: 5, p2: 3, p3: 4, p4: 1 } };
    expect(calculateRoundScore(round, players)).toEqual({ p1: -5, p2: -3, p3: -4, p4: -1 });
  });

  it("kabal: passes + remaining cards", () => {
    const round: RoundScore = { type: "kabal", passes: { p1: 4, p2: 2, p3: 1, p4: 6 }, remaining: { p1: 2, p2: 0, p3: 3, p4: 1 } };
    expect(calculateRoundScore(round, players)).toEqual({ p1: 6, p2: 2, p3: 4, p4: 7 });
  });
});

describe("calculateTotalScores", () => {
  it("sums scores across all rounds", () => {
    const rounds: RoundScore[] = [
      { type: "pass", counts: { p1: 3, p2: 1, p3: 2, p4: 7 } },
      { type: "klover", counts: { p1: 2, p2: 5, p3: 3, p4: 3 } },
      { type: "dame", queenAssignments: { spades: "p1", hearts: "p2", diamonds: "p3", clubs: "p4" } },
      { type: "grand", counts: { p1: 5, p2: 3, p3: 4, p4: 1 } },
      { type: "kabal", passes: { p1: 1, p2: 2, p3: 0, p4: 3 }, remaining: { p1: 0, p2: 1, p3: 2, p4: 0 } },
    ];
    expect(calculateTotalScores(rounds, players)).toEqual({ p1: 5, p2: 10, p3: 7, p4: 16 });
  });

  it("returns zeros for empty rounds array", () => {
    expect(calculateTotalScores([], players)).toEqual({ p1: 0, p2: 0, p3: 0, p4: 0 });
  });
});

describe("getWinners", () => {
  it("returns single winner with lowest score", () => {
    expect(getWinners({ p1: 5, p2: 10, p3: 7, p4: 16 })).toEqual(["p1"]);
  });

  it("returns multiple winners on tie", () => {
    expect(getWinners({ p1: 5, p2: 5, p3: 7, p4: 16 })).toEqual(["p1", "p2"]);
  });
});
