import type { GameState, CompletedGame, Player } from "../types";

const KEYS = {
  gameState: "femkamp-game-state",
  history: "femkamp-history",
  recentPlayers: "femkamp-recent-players",
} as const;

export function saveGameState(state: GameState): void {
  localStorage.setItem(KEYS.gameState, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  const raw = localStorage.getItem(KEYS.gameState);
  if (!raw) return null;
  try { return JSON.parse(raw) as GameState; } catch { return null; }
}

export function clearGameState(): void {
  localStorage.removeItem(KEYS.gameState);
}

export function loadHistory(): CompletedGame[] {
  const raw = localStorage.getItem(KEYS.history);
  if (!raw) return [];
  try { return JSON.parse(raw) as CompletedGame[]; } catch { return []; }
}

export function saveCompletedGame(game: CompletedGame): void {
  const history = loadHistory();
  history.unshift(game);
  localStorage.setItem(KEYS.history, JSON.stringify(history));
}

export function deleteGame(gameId: string): void {
  const history = loadHistory().filter((g) => g.id !== gameId);
  localStorage.setItem(KEYS.history, JSON.stringify(history));
}

const MAX_RECENT_PLAYERS = 10;

export function loadRecentPlayers(): Player[] {
  const raw = localStorage.getItem(KEYS.recentPlayers);
  if (!raw) return [];
  try { return JSON.parse(raw) as Player[]; } catch { return []; }
}

export function saveRecentPlayers(players: Player[]): void {
  const existing = loadRecentPlayers();
  const newIds = new Set(players.map((p) => p.id));
  const merged = [...players, ...existing.filter((p) => !newIds.has(p.id))].slice(0, MAX_RECENT_PLAYERS);
  localStorage.setItem(KEYS.recentPlayers, JSON.stringify(merged));
}
