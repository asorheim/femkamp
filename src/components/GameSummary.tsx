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

// Multi-burst fireworks backdrop in Midnatt palette. Bursts are positioned in
// viewport %, each with its own color and delay. Particles fan out evenly.
const FIREWORKS = [
  { left: "20%", color: "#6FB7A6", delay: "0s" },     // aurora
  { left: "50%", color: "#B13B5A", delay: "0.6s" },   // berry
  { left: "78%", color: "#3A6B8A", delay: "1.2s" },   // fjord
  { left: "35%", color: "#D4637E", delay: "1.8s" },   // berry-soft
  { left: "65%", color: "#A8D4C8", delay: "2.4s" },   // aurora-soft
];
const PARTICLES_PER_BURST = 14;
const BURST_RADIUS = 90;

function Fireworks() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {FIREWORKS.map((fw, i) => (
        <div
          key={i}
          className="firework"
          style={{
            left: fw.left,
            top: "30%",
            ["--delay" as string]: fw.delay,
            ["--color" as string]: fw.color,
          }}
        >
          {Array.from({ length: PARTICLES_PER_BURST }).map((_, j) => {
            const angle = (j / PARTICLES_PER_BURST) * Math.PI * 2;
            const tx = Math.cos(angle) * BURST_RADIUS;
            const ty = Math.sin(angle) * BURST_RADIUS;
            return (
              <span
                key={j}
                style={{
                  ["--tx" as string]: `${tx}px`,
                  ["--ty" as string]: `${ty}px`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
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
  const winnerPlayers = winners
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => !!p);

  return (
    <div className="relative flex flex-col items-center gap-8 p-6 sm:gap-12 sm:p-10 max-w-lg sm:max-w-3xl mx-auto min-h-screen justify-center">
      <Fireworks />
      {/* Winner announcement */}
      <div className="relative text-center z-10">
        <div className="text-6xl sm:text-8xl md:text-9xl mb-3 sm:mb-5 animate-bounce">🏆</div>
        <div className="font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-3xl sm:text-6xl md:text-7xl font-black tracking-tight">
          {winnerPlayers.map((p, i) => (
            <span key={p.id} className="flex items-center gap-2">
              <span>{p.icon}</span>
              <span className="bg-gradient-to-r from-fk-aurora to-fk-fjord bg-clip-text text-transparent">
                {p.name}
              </span>
              {i < winnerPlayers.length - 1 && <span className="text-fk-ink">&</span>}
            </span>
          ))}
          <span className="bg-gradient-to-r from-fk-aurora to-fk-fjord bg-clip-text text-transparent">
            vinner!
          </span>
        </div>
        <p className="text-sm sm:text-xl md:text-2xl text-muted-foreground mt-1 sm:mt-3">
          {totalScores[winners[0]]} poeng totalt
        </p>
      </div>

      {/* Score table */}
      <div className="relative z-10 w-full overflow-x-auto rounded-2xl bg-background/80 backdrop-blur p-2 sm:p-4">
        <table className="w-full text-sm sm:text-lg md:text-xl border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2 sm:py-4">Spiller</th>
              {ROUND_ORDER.map((type) => (
                <th key={type} className="text-center py-2 px-2 sm:py-4">
                  {ROUND_LABELS[type].replace("runda", "")}
                </th>
              ))}
              <th className="text-right py-2 px-2 sm:py-4 font-bold">Totalt</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const isWinner = winners.includes(p.id);
              const isLoser = totalScores[p.id] === maxScore && !isWinner;
              const rowColor = isWinner
                ? "text-emerald-700 font-bold"
                : isLoser
                  ? "text-fk-berry"
                  : "text-foreground";

              return (
                <tr key={p.id} className={`border-b border-border/50 ${rowColor}`}>
                  <td className="py-2 px-2 sm:py-3">
                    {isWinner && "🏆 "}
                    {p.icon} {p.name}
                  </td>
                  {ROUND_ORDER.map((_, i) => {
                    const roundScores = calculateRoundScore(rounds[i], players);
                    return (
                      <td key={i} className="text-center py-2 px-2 sm:py-3 tabular-nums">
                        {roundScores[p.id] ?? 0}
                      </td>
                    );
                  })}
                  <td className="text-right py-2 px-2 sm:py-3 font-bold tabular-nums">
                    {totalScores[p.id] ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex gap-3 sm:gap-5">
        <Button onClick={onNewGame} size="lg" className="sm:h-16 sm:px-8 sm:text-xl md:h-20 md:px-10 md:text-2xl">
          Nytt spill
        </Button>
        <Button onClick={onShowHistory} variant="secondary" size="lg" className="sm:h-16 sm:px-8 sm:text-xl md:h-20 md:px-10 md:text-2xl">
          Se historikk
        </Button>
      </div>
    </div>
  );
}
