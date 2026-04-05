import { useState } from "react";
import type { CompletedGame } from "../types";
import { loadHistory, deleteGame } from "../lib/storage";
import { Button } from "@/components/ui/button";

interface HistoryProps {
  onBack: () => void;
}

export function History({ onBack }: HistoryProps) {
  const [games, setGames] = useState<CompletedGame[]>(loadHistory);

  const handleDelete = (gameId: string) => {
    deleteGame(gameId);
    setGames(loadHistory());
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-fk-ink">Historikk</h2>
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Tilbake
        </Button>
      </div>

      {games.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Ingen spill ennå. Spill en runde femkamp!
        </p>
      ) : (
        <div className="space-y-3">
          {games.map((game) => {
            const winnerPlayers = game.winners
              .map((id) => game.players.find((p) => p.id === id))
              .filter(Boolean);

            return (
              <div
                key={game.id}
                className="rounded-xl border border-border bg-card p-4 shadow-md shadow-black/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(game.date)}
                    </p>
                    <p className="font-medium text-emerald-700 mt-1">
                      🏆{" "}
                      {winnerPlayers
                        .map((p) => `${p!.icon} ${p!.name}`)
                        .join(" & ")}
                      {" — "}
                      {game.totalScores[game.winners[0]]}p
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="text-muted-foreground hover:text-destructive text-xs p-1"
                    title="Slett"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                  {game.players.map((p) => (
                    <span key={p.id}>
                      {p.icon} {p.name}: {game.totalScores[p.id]}p
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
