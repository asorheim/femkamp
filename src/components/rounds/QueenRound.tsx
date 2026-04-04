import { useState } from "react";
import type { Player, RoundScore } from "../../types";
import { ROUND_LABELS, ROUND_DESCRIPTIONS } from "../../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const QUEENS = [
  { suit: "spades", symbol: "♠", label: "Spar dame", color: "border-violet-500" },
  { suit: "hearts", symbol: "♥", label: "Hjerter dame", color: "border-red-500" },
  { suit: "diamonds", symbol: "♦", label: "Ruter dame", color: "border-orange-500" },
  { suit: "clubs", symbol: "♣", label: "Kløver dame", color: "border-green-500" },
] as const;

interface QueenRoundProps {
  players: Player[];
  roundScore: RoundScore & { type: "dame" };
  onUpdate: (score: RoundScore) => void;
}

export function QueenRound({ players, roundScore, onUpdate }: QueenRoundProps) {
  const [openSuit, setOpenSuit] = useState<string | null>(null);
  const assignments = roundScore.queenAssignments;

  const assignQueen = (suit: string, playerId: string | null) => {
    const updated = { ...assignments };
    if (playerId === null) {
      delete updated[suit];
    } else {
      updated[suit] = playerId;
    }
    onUpdate({ type: "dame", queenAssignments: updated });
    setOpenSuit(null);
  };

  const getAssignedPlayer = (suit: string): Player | undefined => {
    const id = assignments[suit];
    return id ? players.find((p) => p.id === id) : undefined;
  };

  // Calculate points per player for display
  const pointsByPlayer: Record<string, number> = {};
  for (const p of players) {
    pointsByPlayer[p.id] = 0;
  }
  for (const [, playerId] of Object.entries(assignments)) {
    if (playerId && pointsByPlayer[playerId] !== undefined) {
      pointsByPlayer[playerId] += 4;
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">{ROUND_LABELS.dame}</h2>
        <p className="text-sm text-muted-foreground">
          {ROUND_DESCRIPTIONS.dame}
        </p>
      </div>

      {/* Queen cards */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {QUEENS.map(({ suit, symbol, label, color }) => {
          const assigned = getAssignedPlayer(suit);
          const isAssigned = !!assigned;

          return (
            <Popover
              key={suit}
              open={openSuit === suit}
              onOpenChange={(open) => setOpenSuit(open ? suit : null)}
            >
              <PopoverTrigger
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                    isAssigned
                      ? `${color} bg-card`
                      : "border-border bg-card/50 opacity-60"
                  }`}
                >
                  <span className="text-3xl">{symbol}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs mt-1">
                    {assigned ? `${assigned.icon} ${assigned.name}` : "—"}
                  </span>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground mb-1 px-2">
                    Hvem tok {label.toLowerCase()}?
                  </p>
                  {players.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => assignQueen(suit, p.id)}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors ${
                        assignments[suit] === p.id ? "bg-accent" : ""
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                  {isAssigned && (
                    <button
                      onClick={() => assignQueen(suit, null)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors mt-1"
                    >
                      ✕ Fjern
                    </button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {/* Points summary */}
      <div className="flex justify-center gap-4 text-sm">
        {players.map((p) => (
          <div key={p.id} className="text-center">
            <span className="text-xs text-muted-foreground">
              {p.icon} {p.name}
            </span>
            <div className="font-bold">{pointsByPlayer[p.id]}p</div>
          </div>
        ))}
      </div>
    </div>
  );
}
