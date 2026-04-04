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
    // 52 cards, dealt evenly. Tricks = cards / playerCount rounded
    return Math.floor(52 / playerCount);
  }
  if (roundType === "klover") {
    return 13; // always 13 clubs
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
  const showWarning = expected !== null && total !== expected && total > 0;

  const updateCount = (playerId: string, delta: number) => {
    const current = counts[playerId] ?? 0;
    const newValue = Math.max(0, current + delta);
    onUpdate({
      ...roundScore,
      counts: { ...counts, [playerId]: newValue },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">{ROUND_LABELS[roundType]}</h2>
        <p className="text-sm text-muted-foreground">
          {ROUND_DESCRIPTIONS[roundType]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
        {players.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 min-w-[100px]"
          >
            <span className="text-xs text-muted-foreground">
              {p.icon} {p.name}
            </span>
            <span className="text-3xl font-bold">{counts[p.id] ?? 0}</span>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 text-lg"
                onClick={() => updateCount(p.id, 1)}
              >
                +
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 text-lg"
                onClick={() => updateCount(p.id, -1)}
                disabled={(counts[p.id] ?? 0) === 0}
              >
                −
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and validation */}
      <div className="text-center text-sm text-muted-foreground">
        Totalt: {total}
        {expected !== null && ` / ${expected}`}
      </div>
      {showWarning && (
        <p className="text-center text-xs text-amber-400">
          ⚠ Forventet {expected}, men {total} er registrert
        </p>
      )}
    </div>
  );
}
