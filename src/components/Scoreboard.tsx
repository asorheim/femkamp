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
    if (scores.length <= 1 || minScore === maxScore) return "text-foreground";
    if (score === minScore) return "text-emerald-700";
    if (score === maxScore) return "text-fk-berry";
    return "text-foreground";
  };

  return (
    <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border shadow-sm">
      {/* Totals row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex flex-wrap justify-around w-full px-3 py-4 gap-2 sm:px-6 sm:py-6 sm:gap-4 md:py-8"
      >
        {players.map((p) => (
          <div key={p.id} className="text-center min-w-[60px] sm:min-w-[110px]">
            <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-semibold leading-tight">
              {p.icon} {p.name}
            </div>
            <div className={`text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tabular-nums leading-none ${getColor(totalScores[p.id] ?? 0)}`}>
              {totalScores[p.id] ?? 0}
            </div>
          </div>
        ))}
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-3 pb-3 sm:px-6 sm:pb-4 overflow-x-auto">
          <table className="w-full text-xs sm:text-base md:text-lg">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-1 sm:py-2">Runde</th>
                {players.map((p) => (
                  <th key={p.id} className="text-center py-1 sm:py-2 sm:text-xl">
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
                    <td className="py-1 sm:py-2 text-muted-foreground">
                      {ROUND_LABELS[type]}
                    </td>
                    {players.map((p) => (
                      <td key={p.id} className="text-center py-1 sm:py-2 tabular-nums">
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
      <div className="flex justify-center gap-2 pb-3 px-3 sm:gap-3 sm:pb-5 sm:px-6 flex-wrap">
        {ROUND_ORDER.map((type, i) => (
          <button
            key={type}
            onClick={() => onGoToRound(i)}
            className={`text-xs px-3 py-1.5 sm:text-base sm:px-5 sm:py-2.5 md:text-lg md:px-6 md:py-3 rounded-full font-semibold transition-all active:scale-90 ${
              i === currentRound
                ? "bg-fk-berry text-fk-paper shadow-md"
                : i < currentRound
                  ? "bg-fk-ink text-fk-paper hover:brightness-110"
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
