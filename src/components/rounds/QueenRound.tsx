import { useState } from "react";
import type { Player, RoundScore } from "../../types";
import { ROUND_LABELS, ROUND_DESCRIPTIONS } from "../../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const QUEENS = [
  { suit: "spades", symbol: "♠", label: "Spar dame", color: "border-fk-ink" },
  { suit: "hearts", symbol: "♥", label: "Hjerter dame", color: "border-fk-berry" },
  { suit: "diamonds", symbol: "♦", label: "Ruter dame", color: "border-fk-fjord" },
  { suit: "clubs", symbol: "♣", label: "Kløver dame", color: "border-fk-aurora" },
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
    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-5 lg:p-5 max-w-6xl mx-auto w-full">
      <div className="text-center">
        <h2 className="font-display text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-fk-ink">{ROUND_LABELS.dame}</h2>
        <p className="text-xs sm:text-sm lg:text-xl text-muted-foreground mt-0.5 sm:mt-1">
          {ROUND_DESCRIPTIONS.dame}
        </p>
      </div>

      {/* Queen cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-sm sm:max-w-xl lg:max-w-3xl mx-auto w-full">
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
                  className={`flex flex-col items-center gap-1 sm:gap-2 lg:gap-3 rounded-2xl border-2 p-3 sm:p-4 lg:p-6 transition-all cursor-pointer fk-card-shadow hover:scale-[1.03] active:scale-95 ${
                    isAssigned
                      ? `${color} bg-card`
                      : "border-border bg-card/50 opacity-70 hover:opacity-90"
                  }`}
                >
                  <span className="text-3xl sm:text-5xl lg:text-7xl leading-none">{symbol}</span>
                  <span className="text-xs sm:text-sm lg:text-xl text-muted-foreground font-medium">{label}</span>
                  <span className="text-xs sm:text-sm lg:text-xl font-semibold">
                    {assigned ? `${assigned.icon} ${assigned.name}` : "Trykk for å velge"}
                  </span>
              </PopoverTrigger>
              <PopoverContent className="w-52 sm:w-72 p-2 sm:p-3">
                <div className="flex flex-col gap-1">
                  <p className="text-xs sm:text-base text-muted-foreground mb-1 px-2">
                    Hvem tok {label.toLowerCase()}?
                  </p>
                  {players.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => assignQueen(suit, p.id)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-lg hover:bg-accent transition-all active:scale-95 ${
                        assignments[suit] === p.id ? "bg-accent font-medium" : ""
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                  {isAssigned && (
                    <button
                      onClick={() => assignQueen(suit, null)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-lg text-destructive hover:bg-destructive/10 transition-all active:scale-95 mt-1"
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
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-10 text-sm">
        {players.map((p) => (
          <div key={p.id} className="text-center">
            <span className="text-xs sm:text-sm lg:text-xl text-muted-foreground">
              {p.icon} {p.name}
            </span>
            <div className="font-extrabold text-lg sm:text-2xl lg:text-4xl tabular-nums">{pointsByPlayer[p.id]}p</div>
          </div>
        ))}
      </div>
    </div>
  );
}
