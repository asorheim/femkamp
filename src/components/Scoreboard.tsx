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
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      {/* Totals row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex justify-around w-full px-2 py-3"
      >
        {players.map((p) => (
          <div key={p.id} className="text-center">
            <div className="text-xs text-muted-foreground">
              {p.icon} {p.name}
            </div>
            <div className={`text-xl font-bold ${getColor(totalScores[p.id] ?? 0)}`}>
              {totalScores[p.id] ?? 0}
            </div>
          </div>
        ))}
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-3 pb-3">
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

      {/* Round progress */}
      <div className="flex justify-center gap-1.5 pb-2 px-2">
        {ROUND_ORDER.map((type, i) => (
          <button
            key={type}
            onClick={() => onGoToRound(i)}
            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
              i === currentRound
                ? "bg-amber-500 text-black font-medium"
                : i < currentRound
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {ROUND_LABELS[type].replace("runda", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
