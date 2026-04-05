import { useState } from "react";
import type { Player } from "../types";
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

  // Five-pip ribbon under the title: numbered 1–5 in Fraunces serif.
  // Reinforces the "five rounds" concept; round name on hover.
  const rounds = [
    { label: "1", name: "Pass" },
    { label: "2", name: "Kløver" },
    { label: "3", name: "Kabal" },
    { label: "4", name: "Dame" },
    { label: "5", name: "Grang" },
  ];

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

          {/* Five-pip ribbon — numbered 1–5.
              Ink numerals on aurora bg gives ~6:1 contrast (passes WCAG AA). */}
          <div className="mt-3 sm:mt-5 flex items-center justify-center gap-2 sm:gap-3">
            {rounds.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-full font-display font-bold text-base sm:text-lg w-9 h-9 sm:w-11 sm:h-11 shadow-sm bg-fk-aurora text-fk-ink border border-fk-ink/10"
                title={r.name}
              >
                {r.label}
              </div>
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
                  className="text-2xl sm:text-3xl hover:scale-110 active:scale-90 transition-transform"
                  title="Bytt ikon"
                >
                  {p.icon}
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
          disabled={players.length < 3}
          className="w-full rounded-xl py-3.5 sm:py-5 font-display font-extrabold text-lg sm:text-2xl transition-transform active:scale-[0.98] bg-fk-ink text-fk-paper fk-card-shadow disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          Start spill ({players.length} {players.length === 1 ? "spiller" : "spillere"})
        </button>
      </div>
    </div>
  );
}
