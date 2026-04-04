import type { Player, RoundScore } from "../types";

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
