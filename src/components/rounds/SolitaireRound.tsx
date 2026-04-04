import type { Player, RoundScore } from "../../types";
import { ROUND_LABELS, ROUND_DESCRIPTIONS } from "../../types";
import { Button } from "@/components/ui/button";

interface SolitaireRoundProps {
  players: Player[];
  roundScore: RoundScore & { type: "kabal" };
  onUpdate: (score: RoundScore) => void;
}

function Counter({
  label,
  value,
  onIncrement,
  onDecrement,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 text-lg font-bold rounded-xl transition-transform active:scale-90"
        onClick={onDecrement}
        disabled={value === 0}
      >
        −
      </Button>
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className="text-3xl font-extrabold tabular-nums">{value}</span>
      </div>
      <Button
        variant="default"
        size="icon"
        className="h-10 w-10 text-lg font-bold rounded-xl transition-transform active:scale-90"
        onClick={onIncrement}
      >
        +
      </Button>
    </div>
  );
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

      <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
        {players.map((p) => {
          const passCount = passes[p.id] ?? 0;
          const remainCount = remaining[p.id] ?? 0;
          const subtotal = passCount + remainCount;

          return (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/5"
            >
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-lg">{p.icon}</span>
                <span className="text-xs font-medium truncate max-w-[60px]">{p.name}</span>
              </div>

              <Counter
                label="Prikker"
                value={passCount}
                onIncrement={() => updateValue("passes", p.id, 1)}
                onDecrement={() => updateValue("passes", p.id, -1)}
              />

              <Counter
                label="Restkort"
                value={remainCount}
                onIncrement={() => updateValue("remaining", p.id, 1)}
                onDecrement={() => updateValue("remaining", p.id, -1)}
              />

              <div className="flex flex-col items-center min-w-[40px]">
                <span className="text-xs text-muted-foreground">Sum</span>
                <span className="text-xl font-extrabold">{subtotal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
