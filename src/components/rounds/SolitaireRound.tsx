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

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
        {players.map((p) => {
          const passCount = passes[p.id] ?? 0;
          const remainCount = remaining[p.id] ?? 0;
          const subtotal = passCount + remainCount;

          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/5 min-w-[140px]"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {p.icon} {p.name}
              </span>

              {/* Prikker row */}
              <div className="flex items-center gap-2 w-full justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 text-lg font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("passes", p.id, -1)}
                  disabled={passCount === 0}
                >
                  −
                </Button>
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Prikker</span>
                  <span className="text-2xl font-extrabold tabular-nums">{passCount}</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 text-lg font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("passes", p.id, 1)}
                >
                  +
                </Button>
              </div>

              {/* Restkort row */}
              <div className="flex items-center gap-2 w-full justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 text-lg font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("remaining", p.id, -1)}
                  disabled={remainCount === 0}
                >
                  −
                </Button>
                <div className="flex flex-col items-center min-w-[50px]">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Restkort</span>
                  <span className="text-2xl font-extrabold tabular-nums">{remainCount}</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 text-lg font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("remaining", p.id, 1)}
                >
                  +
                </Button>
              </div>

              <div className="border-t border-border pt-2 w-full text-center">
                <span className="text-sm font-extrabold">= {subtotal} poeng</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
