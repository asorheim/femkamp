export type RoundType = "pass" | "klover" | "dame" | "grand" | "kabal";

export interface Player {
  id: string;
  name: string;
  icon: string;
}

export type RoundScore =
  | { type: "pass" | "klover" | "grand"; counts: Record<string, number> }
  | { type: "dame"; queenAssignments: Record<string, string> }
  | { type: "kabal"; passes: Record<string, number>; remaining: Record<string, number> };

export type GameStatus = "setup" | "playing" | "finished";

export interface GameState {
  players: Player[];
  currentRound: number;
  rounds: RoundScore[];
  status: GameStatus;
}

export interface CompletedGame {
  id: string;
  date: string;
  players: Player[];
  rounds: RoundScore[];
  totalScores: Record<string, number>;
  winners: string[];
}

export const ROUND_ORDER: RoundType[] = ["pass", "klover", "kabal", "dame", "grand"];

export const ROUND_LABELS: Record<RoundType, string> = {
  pass: "Passrunda",
  klover: "Kløverrunda",
  dame: "Damerunda",
  grand: "Grandrunda",
  kabal: "Kabalrunda",
};

export const ROUND_DESCRIPTIONS: Record<RoundType, string> = {
  pass: "Hver stikk = 1 poeng",
  klover: "Hver kløver = 1 poeng",
  dame: "Hver dame = 4 poeng",
  grand: "Hver stikk = −1 poeng",
  kabal: "Prikker + restkort = poeng",
};
