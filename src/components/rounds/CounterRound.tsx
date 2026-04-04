import type { Player, RoundScore, RoundType } from "../../types";
import { ROUND_LABELS, ROUND_DESCRIPTIONS } from "../../types";
import { Button } from "@/components/ui/button";

interface CounterRoundProps {
  roundType: "pass" | "klover" | "grand";
  players: Player[];
  roundScore: RoundScore & { type: "pass" | "klover" | "grand" };
  onUpdate: (score: RoundScore) => void;
}

function getExpectedTotal(roundType: RoundType, playerCount: number): number | null {
  if (roundType === "pass" || roundType === "grand") {
    return Math.floor(52 / playerCount);
  }
  if (roundType === "klover") {
    return 13;
  }
  return null;
}

export function CounterRound({
  roundType,
  players,
  roundScore,
  onUpdate,
}: CounterRoundProps) {
  const counts = roundScore.counts;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const expected = getExpectedTotal(roundType, players.length);
  const isFull = expected !== null && total >= expected;

  const updateCount = (playerId: string, delta: number) => {
    const current = counts[playerId] ?? 0;
    const newValue = Math.max(0, current + delta);
    onUpdate({
      ...roundScore,
      counts: { ...counts, [playerId]: newValue },
    });
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">{ROUND_LABELS[roundType]}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {ROUND_DESCRIPTIONS[roundType]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 min-w-[110px] shadow-lg shadow-black/20"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {p.icon} {p.name}
            </span>
            <span className="text-5xl font-extrabold tabular-nums">{counts[p.id] ?? 0}</span>
            <div className="flex gap-3">
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 text-xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                onClick={() => updateCount(p.id, 1)}
                disabled={isFull}
              >
                +
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 text-xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                onClick={() => updateCount(p.id, -1)}
                disabled={(counts[p.id] ?? 0) === 0}
              >
                −
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Total display */}
      <div className="text-center text-sm font-medium text-muted-foreground">
        Totalt: {total}
        {expected !== null && ` / ${expected}`}
      </div>
    </div>
  );
}
