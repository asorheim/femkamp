import { useState } from "react";
import type { Player, RoundScore } from "../types";
import { ROUND_ORDER, ROUND_LABELS } from "../types";
import { calculateRoundScore } from "../lib/scoring";

interface ScoreboardProps {
  players: Player[];
  rounds: RoundScore[];
  currentRound: number;
  totalScores: Record<string, number>;
  onGoToRound: (index: number) => void;
}

export function Scoreboard({
  players,
  rounds,
  currentRound,
  totalScores,
  onGoToRound,
}: ScoreboardProps) {
  const [expanded, setExpanded] = useState(false);

  const scores = Object.entries(totalScores);
  const minScore = Math.min(...scores.map(([, s]) => s));
  const maxScore = Math.max(...scores.map(([, s]) => s));

  const getColor = (score: number) => {
    if (scores.length <= 1) return "text-foreground";
    if (score === minScore) return "text-green-400";
    if (score === maxScore) return "text-red-400";
    return "text-foreground";
  };

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border shadow-md shadow-black/10">
      {/* Totals row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex flex-wrap justify-around w-full px-3 py-4 gap-2"
      >
        {players.map((p) => (
          <div key={p.id} className="text-center min-w-[60px]">
            <div className="text-sm text-muted-foreground font-medium">
              {p.icon} {p.name}
            </div>
            <div className={`text-2xl font-extrabold tabular-nums ${getColor(totalScores[p.id] ?? 0)}`}>
              {totalScores[p.id] ?? 0}
            </div>
          </div>
        ))}
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-3 pb-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-1">Runde</th>
                {players.map((p) => (
                  <th key={p.id} className="text-center py-1">
                    {p.icon}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUND_ORDER.map((type, i) => {
                const roundScore = rounds[i];
                const scores = roundScore
                  ? calculateRoundScore(roundScore, players)
                  : null;
                return (
                  <tr
                    key={type}
                    className={i === currentRound ? "bg-accent/50" : ""}
                  >
                    <td className="py-1 text-muted-foreground">
                      {ROUND_LABELS[type]}
                    </td>
                    {players.map((p) => (
                      <td key={p.id} className="text-center py-1">
                        {scores ? scores[p.id] ?? 0 : "–"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Round progress pills */}
      <div className="flex justify-center gap-2 pb-3 px-3 flex-wrap">
        {ROUND_ORDER.map((type, i) => (
          <button
            key={type}
            onClick={() => onGoToRound(i)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all active:scale-90 ${
              i === currentRound
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/30"
                : i < currentRound
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {ROUND_LABELS[type].replace("runda", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
