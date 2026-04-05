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
    <div className="flex flex-col gap-6 p-5 sm:gap-10 sm:p-8 max-w-6xl mx-auto w-full">
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-fk-ink">{ROUND_LABELS.kabal}</h2>
        <p className="text-sm sm:text-xl md:text-2xl text-muted-foreground mt-1 sm:mt-2">
          {ROUND_DESCRIPTIONS.kabal}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
        {players.map((p) => {
          const passCount = passes[p.id] ?? 0;
          const remainCount = remaining[p.id] ?? 0;
          const subtotal = passCount + remainCount;

          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-3 sm:gap-5 rounded-2xl border border-border bg-card p-4 sm:p-7 fk-card-shadow min-w-[140px] sm:min-w-[250px]"
            >
              <span className="text-sm sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
                {p.icon} {p.name}
              </span>

              {/* Prikker row */}
              <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 text-lg sm:h-14 sm:w-14 sm:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("passes", p.id, -1)}
                  disabled={passCount === 0}
                >
                  −
                </Button>
                <div className="flex flex-col items-center min-w-[50px] sm:min-w-[80px]">
                  <span className="text-[10px] sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">Prikker</span>
                  <span className="text-2xl sm:text-5xl md:text-6xl font-extrabold tabular-nums leading-none">{passCount}</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 text-lg sm:h-14 sm:w-14 sm:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("passes", p.id, 1)}
                >
                  +
                </Button>
              </div>

              {/* Restkort row */}
              <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 text-lg sm:h-14 sm:w-14 sm:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("remaining", p.id, -1)}
                  disabled={remainCount === 0}
                >
                  −
                </Button>
                <div className="flex flex-col items-center min-w-[50px] sm:min-w-[80px]">
                  <span className="text-[10px] sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">Restkort</span>
                  <span className="text-2xl sm:text-5xl md:text-6xl font-extrabold tabular-nums leading-none">{remainCount}</span>
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 text-lg sm:h-14 sm:w-14 sm:text-2xl font-bold rounded-xl transition-transform active:scale-90"
                  onClick={() => updateValue("remaining", p.id, 1)}
                >
                  +
                </Button>
              </div>

              <div className="border-t border-border pt-2 sm:pt-3 w-full text-center">
                <span className="text-sm sm:text-xl md:text-2xl font-extrabold">= {subtotal} poeng</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
