import { useState, useCallback, useEffect } from "react";
import type { GameState, Player, RoundScore, CompletedGame } from "../types";
import { ROUND_ORDER } from "../types";
import { calculateTotalScores, getWinners, isRoundComplete, getRoundIncompleteHint } from "../lib/scoring";
import { saveGameState, loadGameState, clearGameState, saveCompletedGame, saveRecentPlayers } from "../lib/storage";

function createInitialRounds(players: Player[]): RoundScore[] {
  const ids = players.map((p) => p.id);
  const zeroCounts = Object.fromEntries(ids.map((id) => [id, 0]));
  return ROUND_ORDER.map((type): RoundScore => {
    switch (type) {
      case "pass":
      case "klover":
      case "grand":
        return { type, counts: { ...zeroCounts } };
      case "dame":
        return { type, queenAssignments: {} };
      case "kabal":
        return { type, passes: { ...zeroCounts }, remaining: { ...zeroCounts } };
    }
  });
}

const INITIAL_STATE: GameState = { players: [], currentRound: 0, rounds: [], status: "setup" };

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadGameState() ?? INITIAL_STATE);

  useEffect(() => {
    if (state.status !== "setup") { saveGameState(state); }
  }, [state]);

  const startGame = useCallback((players: Player[]) => {
    const newState: GameState = { players, currentRound: 0, rounds: createInitialRounds(players), status: "playing" };
    saveRecentPlayers(players);
    setState(newState);
  }, []);

  const updateRound = useCallback((roundIndex: number, score: RoundScore) => {
    setState((prev) => {
      const rounds = [...prev.rounds];
      rounds[roundIndex] = score;
      return { ...prev, rounds };
    });
  }, []);

  const goToRound = useCallback((roundIndex: number) => {
    setState((prev) => ({ ...prev, currentRound: Math.max(0, Math.min(roundIndex, ROUND_ORDER.length - 1)) }));
  }, []);

  const nextRound = useCallback(() => {
    setState((prev) => {
      const current = prev.rounds[prev.currentRound];
      if (current && !isRoundComplete(current, prev.players.length)) {
        return prev; // guarded by UI, but belt-and-braces
      }
      if (prev.currentRound >= ROUND_ORDER.length - 1) {
        const totalScores = calculateTotalScores(prev.rounds, prev.players);
        const winners = getWinners(totalScores);
        const completed: CompletedGame = {
          id: crypto.randomUUID(), date: new Date().toISOString(),
          players: prev.players, rounds: prev.rounds, totalScores, winners,
        };
        saveCompletedGame(completed);
        clearGameState();
        return { ...prev, status: "finished" };
      }
      return { ...prev, currentRound: prev.currentRound + 1 };
    });
  }, []);

  const newGame = useCallback(() => { clearGameState(); setState(INITIAL_STATE); }, []);

  const currentRoundType = ROUND_ORDER[state.currentRound];
  const currentRoundScore = state.rounds[state.currentRound];
  const totalScores = calculateTotalScores(state.rounds, state.players);
  const canAdvance = currentRoundScore
    ? isRoundComplete(currentRoundScore, state.players.length)
    : true;
  const incompleteHint = currentRoundScore
    ? getRoundIncompleteHint(currentRoundScore, state.players.length)
    : null;

  return { state, currentRoundType, currentRoundScore, totalScores, canAdvance, incompleteHint, startGame, updateRound, goToRound, nextRound, newGame };
}
