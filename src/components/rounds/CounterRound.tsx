import type { Player, RoundScore } from "../../types";
import { ROUND_LABELS, ROUND_DESCRIPTIONS } from "../../types";
import { getExpectedCounterTotal } from "../../lib/scoring";
import { Button } from "@/components/ui/button";

interface CounterRoundProps {
  roundType: "pass" | "klover" | "grand";
  players: Player[];
  roundScore: RoundScore & { type: "pass" | "klover" | "grand" };
  onUpdate: (score: RoundScore) => void;
}

export function CounterRound({
  roundType,
  players,
  roundScore,
  onUpdate,
}: CounterRoundProps) {
  const counts = roundScore.counts;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const expected = getExpectedCounterTotal(roundType, players.length);
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
    <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-5 lg:p-5 max-w-6xl mx-auto w-full">
      <div className="text-center">
        <h2 className="font-display text-xl sm:text-2xl lg:text-4xl font-black tracking-tight text-fk-ink">{ROUND_LABELS[roundType]}</h2>
        <p className="text-xs sm:text-sm lg:text-xl text-muted-foreground mt-0.5 sm:mt-1">
          {ROUND_DESCRIPTIONS[roundType]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 lg:gap-6">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 lg:p-5 min-w-[100px] sm:min-w-[150px] lg:min-w-[180px] fk-card-shadow"
          >
            <span className="text-xs sm:text-base lg:text-2xl font-semibold text-muted-foreground">
              {p.icon} {p.name}
            </span>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tabular-nums leading-none">{counts[p.id] ?? 0}</span>
            <div className="flex gap-2 sm:gap-3 lg:gap-4">
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 text-lg sm:h-12 sm:w-12 sm:text-2xl lg:h-14 lg:w-14 lg:text-3xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
                onClick={() => updateCount(p.id, 1)}
                disabled={isFull}
              >
                +
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 text-lg sm:h-12 sm:w-12 sm:text-2xl lg:h-14 lg:w-14 lg:text-3xl font-bold rounded-xl transition-transform active:scale-90 hover:brightness-110"
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
      <div className="text-center text-xs sm:text-sm lg:text-lg font-medium text-muted-foreground">
        Totalt: {total}
        {expected !== null && ` / ${expected}`}
      </div>
    </div>
  );
}
