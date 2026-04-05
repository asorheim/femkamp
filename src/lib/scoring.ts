import type { Player, RoundScore, RoundType } from "../types";

/**
 * Expected "full" total for counter-based rounds:
 * - pass / grand: all tricks in the deck distributed (floor(52 / players))
 * - klover: all 13 clubs
 */
export function getExpectedCounterTotal(roundType: RoundType, playerCount: number): number | null {
  if (roundType === "pass" || roundType === "grand") return Math.floor(52 / playerCount);
  if (roundType === "klover") return 13;
  return null;
}

/**
 * Whether a round has enough data entered to advance. Kabal has no hard
 * "done" state (0 is a valid perfect solitaire), so it always passes.
 */
export function isRoundComplete(round: RoundScore, playerCount: number): boolean {
  switch (round.type) {
    case "pass":
    case "klover":
    case "grand": {
      const expected = getExpectedCounterTotal(round.type, playerCount);
      if (expected === null) return true;
      const total = Object.values(round.counts).reduce((a, b) => a + b, 0);
      return total === expected;
    }
    case "dame":
      return Object.keys(round.queenAssignments).length === 4;
    case "kabal":
      return true;
  }
}

/**
 * Short Norwegian hint explaining what is missing, or null if the round is complete.
 */
export function getRoundIncompleteHint(round: RoundScore, playerCount: number): string | null {
  switch (round.type) {
    case "pass":
    case "klover":
    case "grand": {
      const expected = getExpectedCounterTotal(round.type, playerCount);
      if (expected === null) return null;
      const total = Object.values(round.counts).reduce((a, b) => a + b, 0);
      if (total === expected) return null;
      return `Mangler ${expected - total} av ${expected} stikk`;
    }
    case "dame": {
      const assigned = Object.keys(round.queenAssignments).length;
      if (assigned === 4) return null;
      return `Mangler ${4 - assigned} av 4 damer`;
    }
    case "kabal":
      return null;
  }
}


export function calculateRoundScore(round: RoundScore, players: Player[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const p of players) { scores[p.id] = 0; }

  switch (round.type) {
    case "pass":
      for (const p of players) { scores[p.id] = round.counts[p.id] ?? 0; }
      break;
    case "klover":
      for (const p of players) { scores[p.id] = round.counts[p.id] ?? 0; }
      break;
    case "dame":
      for (const [, playerId] of Object.entries(round.queenAssignments)) {
        if (playerId && scores[playerId] !== undefined) { scores[playerId] += 4; }
      }
      break;
    case "grand":
      for (const p of players) { scores[p.id] = -(round.counts[p.id] ?? 0); }
      break;
    case "kabal":
      for (const p of players) { scores[p.id] = (round.passes[p.id] ?? 0) + (round.remaining[p.id] ?? 0); }
      break;
  }
  return scores;
}

export function calculateTotalScores(rounds: RoundScore[], players: Player[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const p of players) { totals[p.id] = 0; }
  for (const round of rounds) {
    const roundScores = calculateRoundScore(round, players);
    for (const p of players) { totals[p.id] += roundScores[p.id] ?? 0; }
  }
  return totals;
}

export function getWinners(totalScores: Record<string, number>): string[] {
  const entries = Object.entries(totalScores);
  if (entries.length === 0) return [];
  const minScore = Math.min(...entries.map(([, score]) => score));
  return entries.filter(([, score]) => score === minScore).map(([id]) => id);
}
