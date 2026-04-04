import type { Player, RoundScore } from "../../types";
import { ROUND_LABELS, ROUND_DESCRIPTIONS } from "../../types";
import { Button } from "@/components/ui/button";

interface SolitaireRoundProps {
  players: Player[];
  roundScore: RoundScore & { type: "kabal" };
  onUpdate: (score: RoundScore) => void;
}

export function SolitaireRound({
  players,
  roundScore,
  onUpdate,
}: SolitaireRoundProps) {
  const { passes, remaining } = roundScore;

  const updateValue = (
    field: "passes" | "remaining",
    playerId: string,
    delta: number
  ) => {
    const current = roundScore[field][playerId] ?? 0;
    const newValue = Math.max(0, current + delta);
    onUpdate({
      ...roundScore,
      [field]: { ...roundScore[field], [playerId]: newValue },
    });
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">{ROUND_LABELS.kabal}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {ROUND_DESCRIPTIONS.kabal}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center">
        {players.map((p) => {
          const passCount = passes[p.id] ?? 0;
          const remainCount = remaining[p.id] ?? 0;
          const subtotal = passCount + remainCount;

          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 min-w-[140px] shadow-lg shadow-black/20"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {p.icon} {p.name}
              </span>

              <div className="flex gap-5">
                {/* Passes counter */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Prikker
                  </span>
                  <span className="text-4xl font-extrabold tabular-nums">{passCount}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-12 w-12 text-xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                      onClick={() => updateValue("passes", p.id, 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 text-xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                      onClick={() => updateValue("passes", p.id, -1)}
                      disabled={passCount === 0}
                    >
                      −
                    </Button>
                  </div>
                </div>

                {/* Remaining cards counter */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Restkort
                  </span>
                  <span className="text-4xl font-extrabold tabular-nums">{remainCount}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-12 w-12 text-xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                      onClick={() => updateValue("remaining", p.id, 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 text-xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                      onClick={() => updateValue("remaining", p.id, -1)}
                      disabled={remainCount === 0}
                    >
                      −
                    </Button>
                  </div>
                </div>
              </div>

              <span className="text-sm font-bold text-muted-foreground">
                = {subtotal} poeng
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
