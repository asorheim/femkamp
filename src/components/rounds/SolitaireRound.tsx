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
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">{ROUND_LABELS.kabal}</h2>
        <p className="text-sm text-muted-foreground">
          {ROUND_DESCRIPTIONS.kabal}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
        {players.map((p) => {
          const passCount = passes[p.id] ?? 0;
          const remainCount = remaining[p.id] ?? 0;
          const subtotal = passCount + remainCount;

          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 min-w-[130px]"
            >
              <span className="text-xs text-muted-foreground">
                {p.icon} {p.name}
              </span>

              <div className="flex gap-4">
                {/* Passes counter */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">
                    Prikker
                  </span>
                  <span className="text-2xl font-bold">{passCount}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8 text-sm"
                      onClick={() => updateValue("passes", p.id, 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 text-sm"
                      onClick={() => updateValue("passes", p.id, -1)}
                      disabled={passCount === 0}
                    >
                      −
                    </Button>
                  </div>
                </div>

                {/* Remaining cards counter */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">
                    Restkort
                  </span>
                  <span className="text-2xl font-bold">{remainCount}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8 text-sm"
                      onClick={() => updateValue("remaining", p.id, 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 text-sm"
                      onClick={() => updateValue("remaining", p.id, -1)}
                      disabled={remainCount === 0}
                    >
                      −
                    </Button>
                  </div>
                </div>
              </div>

              <span className="text-xs text-muted-foreground">
                = {subtotal} poeng
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
