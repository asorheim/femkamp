import { useState } from "react";
import type { Player } from "../types";
import { ROUND_ORDER, ROUND_LABELS } from "../types";
import { assignIcon, nextIcon } from "../lib/icons";
import { loadRecentPlayers } from "../lib/storage";

interface PlayerSetupProps {
  onStart: (players: Player[]) => void;
}

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [nameInput, setNameInput] = useState("");
  const recentPlayers = loadRecentPlayers();

  const isDuplicate = (name: string) =>
    players.some((p) => p.name.toLowerCase() === name.toLowerCase());

  const addPlayer = () => {
    const name = nameInput.trim();
    if (!name || isDuplicate(name)) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      icon: assignIcon(players.length),
    };
    setPlayers([...players, newPlayer]);
    setNameInput("");
  };

  const addRecentPlayer = (recent: Player) => {
    if (isDuplicate(recent.name)) return;
    setPlayers([...players, { ...recent, id: crypto.randomUUID() }]);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const cycleIcon = (id: string) => {
    setPlayers(
      players.map((p) =>
        p.id === id ? { ...p, icon: nextIcon(p.icon) } : p
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  const availableRecent = recentPlayers.filter((r) => !isDuplicate(r.name));

  // Round chips under the title: show the actual round names in order, so
  // the setup screen is self-explanatory without relying on hover tooltips
  // (which don't exist on mobile/tablet). "Pass · Kløver · Kabal · Dame · Grang"
  // reads as a five-step agenda for the game.
  const roundChips = ROUND_ORDER.map((type) => ROUND_LABELS[type].replace("runda", ""));

  const canStart = players.length >= 3;
  const startLabel = canStart
    ? `Start spill (${players.length} ${players.length === 1 ? "spiller" : "spillere"})`
    : players.length === 0
      ? "Legg til minst 3 spillere"
      : `Legg til ${3 - players.length} spiller${3 - players.length === 1 ? "" : "e"} til`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Giant spade watermark bleeding off the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 sm:-top-32 sm:-right-32 text-[20rem] sm:text-[28rem] md:text-[36rem] leading-none select-none text-fk-ink opacity-[0.06]"
      >
        ♠
      </div>

      <div className="relative flex flex-col items-center gap-5 sm:gap-8 p-6 sm:p-10 max-w-md sm:max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center pt-4 sm:pt-8">
          <h1 className="font-display font-black tracking-tight text-5xl sm:text-7xl md:text-8xl leading-none text-fk-ink">
            Femkamp
          </h1>

          {/* Subtitle: one-line identity + the key scoring rule. Explains
              what this app is without being twee. */}
          <p className="mt-2 sm:mt-3 font-display italic text-sm sm:text-base md:text-lg text-muted-foreground">
            Fem runder · lavest poeng vinner
          </p>

          {/* Round chips — the actual round names in playing order. Serves as
              a self-explanatory agenda so users know what the game consists
              of without needing to hover (hover doesn't exist on touch). */}
          <div className="mt-3 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {roundChips.map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full font-display font-semibold text-[11px] sm:text-sm px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-fk-aurora text-fk-ink border border-fk-ink/10"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="flex gap-3 w-full">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spillernavn..."
            className="flex-1 rounded-xl px-4 py-3 sm:py-4 text-base sm:text-lg outline-none transition-all focus:ring-2 focus:ring-fk-aurora bg-card border border-border text-foreground fk-card-shadow"
            maxLength={20}
          />
          <button
            onClick={addPlayer}
            disabled={!nameInput.trim() || isDuplicate(nameInput.trim())}
            className="rounded-xl px-5 sm:px-7 font-display font-bold text-base sm:text-lg transition-transform active:scale-95 whitespace-nowrap bg-fk-berry text-fk-paper fk-card-shadow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            Legg til
          </button>
        </div>

        {/* Duplicate warning */}
        {nameInput.trim() && isDuplicate(nameInput.trim()) && (
          <p className="text-sm -mt-6 text-fk-berry">
            Navnet er allerede lagt til
          </p>
        )}

        {/* Recent players */}
        {availableRecent.length > 0 && (
          <div className="w-full">
            <p className="text-sm sm:text-base mb-2 sm:mb-3 font-display italic text-muted-foreground">
              Nylige spillere:
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {availableRecent.map((r) => (
                <button
                  key={r.id}
                  onClick={() => addRecentPlayer(r)}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base hover:scale-[1.03] active:scale-95 transition-all bg-card border border-border text-foreground fk-card-shadow"
                >
                  <span>{r.icon}</span>
                  <span className="font-medium">{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player list */}
        {players.length > 0 && (
          <div className="w-full space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 bg-card border border-border fk-card-shadow"
              >
                <button
                  onClick={() => cycleIcon(p.id)}
                  className="relative text-2xl sm:text-3xl hover:scale-110 active:scale-90 transition-transform"
                  title="Trykk for å bytte ikon"
                  aria-label="Bytt ikon"
                >
                  {p.icon}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 -right-1 text-[9px] sm:text-[10px] leading-none text-muted-foreground"
                  >
                    ↻
                  </span>
                </button>
                <span className="flex-1 font-display font-semibold text-base sm:text-xl text-foreground">
                  {p.name}
                </span>
                <button
                  onClick={() => removePlayer(p.id)}
                  className="text-lg sm:text-xl p-1.5 rounded-lg transition-all active:scale-90 hover:bg-muted text-muted-foreground"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Start button */}
        <button
          onClick={() => onStart(players)}
          disabled={!canStart}
          className="w-full rounded-xl py-3.5 sm:py-5 font-display font-extrabold text-lg sm:text-2xl transition-transform active:scale-[0.98] bg-fk-ink text-fk-paper fk-card-shadow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}
