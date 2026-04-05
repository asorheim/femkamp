import { useState, useEffect } from "react";
import { useGameState } from "./hooks/useGameState";
import { ROUND_ORDER } from "./types";
import { PlayerSetup } from "./components/PlayerSetup";
import { Scoreboard } from "./components/Scoreboard";
import { CounterRound } from "./components/rounds/CounterRound";
import { QueenRound } from "./components/rounds/QueenRound";
import { SolitaireRound } from "./components/rounds/SolitaireRound";
import { GameSummary } from "./components/GameSummary";
import { History } from "./components/History";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RoundScore } from "./types";

type Screen = "game" | "history";

function App() {
  const {
    state,
    currentRoundType,
    currentRoundScore,
    totalScores,
    canAdvance,
    incompleteHint,
    startGame,
    updateRound,
    goToRound,
    nextRound,
    newGame,
  } = useGameState();

  const [screen, setScreen] = useState<Screen>("game");
  const [showResumeDialog, setShowResumeDialog] = useState(
    () => state.status === "playing"
  );

  // Scroll to top when switching rounds or game status, so users don't land
  // halfway down the next screen.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.currentRound, state.status, screen]);

  // History screen
  if (screen === "history") {
    return <History onBack={() => setScreen("game")} />;
  }

  // Setup screen
  if (state.status === "setup") {
    return <PlayerSetup onStart={startGame} />;
  }

  // Finished screen
  if (state.status === "finished") {
    return (
      <GameSummary
        players={state.players}
        rounds={state.rounds}
        onNewGame={newGame}
        onShowHistory={() => setScreen("history")}
      />
    );
  }

  // Playing screen
  const handleUpdate = (score: RoundScore) => {
    updateRound(state.currentRound, score);
  };

  const isLastRound = state.currentRound >= ROUND_ORDER.length - 1;

  return (
    <div className="min-h-screen">
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fortsette spill?</DialogTitle>
            <DialogDescription>
              Du har et pågående spill med{" "}
              {state.players.map((p) => p.name).join(", ")}. Vil du fortsette
              eller starte på nytt?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                newGame();
                setShowResumeDialog(false);
              }}
            >
              Nytt spill
            </Button>
            <Button onClick={() => setShowResumeDialog(false)}>
              Fortsett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Scoreboard
        players={state.players}
        rounds={state.rounds}
        currentRound={state.currentRound}
        totalScores={totalScores}
        onGoToRound={goToRound}
      />

      {(currentRoundType === "pass" ||
        currentRoundType === "klover" ||
        currentRoundType === "grand") &&
        currentRoundScore?.type === currentRoundType && (
          <CounterRound
            roundType={currentRoundType}
            players={state.players}
            roundScore={currentRoundScore as RoundScore & { type: "pass" | "klover" | "grand" }}
            onUpdate={handleUpdate}
          />
        )}

      {currentRoundType === "dame" && currentRoundScore?.type === "dame" && (
        <QueenRound
          players={state.players}
          roundScore={currentRoundScore as RoundScore & { type: "dame" }}
          onUpdate={handleUpdate}
        />
      )}

      {currentRoundType === "kabal" && currentRoundScore?.type === "kabal" && (
        <SolitaireRound
          players={state.players}
          roundScore={currentRoundScore as RoundScore & { type: "kabal" }}
          onUpdate={handleUpdate}
        />
      )}

      <div className="flex flex-col items-center gap-3 p-5 pb-10 sm:pb-14">
        {!canAdvance && incompleteHint && (
          <p className="text-sm sm:text-lg md:text-xl text-amber-600 font-medium">
            {incompleteHint}
          </p>
        )}
        <div className="flex justify-center gap-4 sm:gap-6">
          {state.currentRound > 0 && (
            <Button
              variant="secondary"
              size="lg"
              className="rounded-xl font-semibold transition-transform active:scale-95 sm:h-16 sm:px-8 sm:text-xl md:h-20 md:px-10 md:text-2xl"
              onClick={() => goToRound(state.currentRound - 1)}
            >
              ← Forrige
            </Button>
          )}
          <Button
            size="lg"
            className="rounded-xl font-semibold transition-transform active:scale-95 shadow-lg sm:h-16 sm:px-8 sm:text-xl md:h-20 md:px-10 md:text-2xl"
            onClick={nextRound}
            disabled={!canAdvance}
          >
            {isLastRound ? "Avslutt spill" : "Neste runde →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
