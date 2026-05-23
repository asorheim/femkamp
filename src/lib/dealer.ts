import type { Player } from "../types";

/**
 * Whose turn it is to shuffle and deal in a given round.
 *
 * The dealer rotates one player per round, in the order players were added.
 * The app is the source of truth for whose turn it is, so physical seating
 * order is irrelevant. Round 0 (Pass) is dealt by the first player.
 *
 * Returns undefined only when there are no players (never happens once a game
 * is in the "playing" state, but kept defensive).
 */
export function getDealer(players: Player[], roundIndex: number): Player | undefined {
  if (players.length === 0) return undefined;
  return players[roundIndex % players.length];
}
