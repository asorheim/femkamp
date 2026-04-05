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
    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-5 lg:p-5 max-w-6xl mx-auto w-full">
      <div className="text-center">
        <h2 className="font-display text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-fk-ink">{ROUND_LABELS.kabal}</h2>
        <p className="text-xs sm:text-sm lg:text-xl text-muted-foreground mt-0.5 sm:mt-1">
          {ROUND_DESCRIPTIONS.kabal}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 lg:gap-6">
        {players.map((p) => {
          const passCount = passes[p.id] ?? 0;
          const remainCount = remaining[p.id] ?? 0;
          const subtotal = passCount + remainCount;

          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4 lg:p-5 fk-card-shadow min-w-[140px] sm:min-w-[190px] lg:min-w-[210px]"
            >
              <span className="text-xs sm:text-base lg:text-2xl font-semibold text-muted-foreground">
                {p.icon} {p.name}
              </span>

              {/* Prikker row */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-xl lg:h-12 lg:w-12 lg:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("passes", p.id, -1)}
                  disabled={passCount === 0}
                >
                  −
                </Button>
                <div className="flex flex-col items-center min-w-[50px] sm:min-w-[60px] lg:min-w-[70px]">
                  <span className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium uppercase tracking-wide">Prikker</span>
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tabular-nums leading-none">{passCount}</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-xl lg:h-12 lg:w-12 lg:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("passes", p.id, 1)}
                >
                  +
                </Button>
              </div>

              {/* Restkort row */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-xl lg:h-12 lg:w-12 lg:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("remaining", p.id, -1)}
                  disabled={remainCount === 0}
                >
                  −
                </Button>
                <div className="flex flex-col items-center min-w-[50px] sm:min-w-[60px] lg:min-w-[70px]">
                  <span className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium uppercase tracking-wide">Restkort</span>
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tabular-nums leading-none">{remainCount}</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9 text-base sm:h-11 sm:w-11 sm:text-xl lg:h-12 lg:w-12 lg:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("remaining", p.id, 1)}
                >
                  +
                </Button>
              </div>

              <div className="border-t border-border pt-1.5 sm:pt-2 lg:pt-3 w-full text-center">
                <span className="text-xs sm:text-base lg:text-xl font-extrabold">= {subtotal} poeng</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
