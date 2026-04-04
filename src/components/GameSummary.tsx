import type { Player, RoundScore } from "../types";
import { ROUND_ORDER, ROUND_LABELS } from "../types";
import { calculateRoundScore, calculateTotalScores, getWinners } from "../lib/scoring";
import { Button } from "@/components/ui/button";

interface GameSummaryProps {
  players: Player[];
  rounds: RoundScore[];
  onNewGame: () => void;
  onShowHistory: () => void;
}

export function GameSummary({
  players,
  rounds,
  onNewGame,
  onShowHistory,
}: GameSummaryProps) {
  const totalScores = calculateTotalScores(rounds, players);
  const winners = getWinners(totalScores);

  // Sort players by total score ascending
  const sorted = [...players].sort(
    (a, b) => (totalScores[a.id] ?? 0) - (totalScores[b.id] ?? 0)
  );

  const maxScore = Math.max(...Object.values(totalScores));
  const winnerNames = winners
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => `${p!.icon} ${p!.name}`)
    .join(" & ");

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-lg mx-auto min-h-screen justify-center">
      {/* Winner announcement */}
      <div className="text-center">
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          {winnerNames} vinner!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {totalScores[winners[0]]} poeng totalt
        </p>
      </div>

      {/* Score table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2">Spiller</th>
              {ROUND_ORDER.map((type) => (
                <th key={type} className="text-center py-2 px-2">
                  {ROUND_LABELS[type].replace("runda", "")}
                </th>
              ))}
              <th className="text-right py-2 px-2 font-bold">Totalt</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const isWinner = winners.includes(p.id);
              const isLoser = totalScores[p.id] === maxScore && !isWinner;
              const rowColor = isWinner
                ? "text-green-400 font-bold"
                : isLoser
                  ? "text-red-400"
                  : "text-foreground";

              return (
                <tr key={p.id} className={`border-b border-border/50 ${rowColor}`}>
                  <td className="py-2 px-2">
                    {isWinner && "🏆 "}
                    {p.icon} {p.name}
                  </td>
                  {ROUND_ORDER.map((_, i) => {
                    const roundScores = calculateRoundScore(rounds[i], players);
                    return (
                      <td key={i} className="text-center py-2 px-2">
                        {roundScores[p.id] ?? 0}
                      </td>
                    );
                  })}
                  <td className="text-right py-2 px-2 font-bold">
                    {totalScores[p.id] ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={onNewGame} size="lg">
          Nytt spill
        </Button>
        <Button onClick={onShowHistory} variant="secondary" size="lg">
          Se historikk
        </Button>
      </div>
    </div>
  );
}
