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
    <div className="flex flex-col gap-6 p-5 sm:gap-10 sm:p-8 max-w-6xl mx-auto w-full">
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-fk-ink">{ROUND_LABELS[roundType]}</h2>
        <p className="text-sm sm:text-xl md:text-2xl text-muted-foreground mt-1 sm:mt-2">
          {ROUND_DESCRIPTIONS[roundType]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-3 sm:gap-5 rounded-2xl border border-border bg-card p-5 sm:p-8 min-w-[110px] sm:min-w-[200px] md:min-w-[230px] shadow-lg shadow-black/20"
          >
            <span className="text-sm sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
              {p.icon} {p.name}
            </span>
            <span className="text-5xl sm:text-8xl md:text-9xl font-extrabold tabular-nums leading-none">{counts[p.id] ?? 0}</span>
            <div className="flex gap-3 sm:gap-5">
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 text-xl sm:h-20 sm:w-20 sm:text-4xl font-bold rounded-xl sm:rounded-2xl transition-transform active:scale-90 hover:brightness-110"
                onClick={() => updateCount(p.id, 1)}
                disabled={isFull}
              >
                +
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 text-xl sm:h-20 sm:w-20 sm:text-4xl font-bold rounded-xl sm:rounded-2xl transition-transform active:scale-90 hover:brightness-110"
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
      <div className="text-center text-sm sm:text-xl md:text-2xl font-medium text-muted-foreground">
        Totalt: {total}
        {expected !== null && ` / ${expected}`}
      </div>
    </div>
  );
}
