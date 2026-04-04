import { useState } from "react";
import type { Player } from "../types";
import { assignIcon, nextIcon } from "../lib/icons";
import { loadRecentPlayers } from "../lib/storage";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-md mx-auto min-h-screen justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Femkamp 🃏
        </h1>
        <p className="text-muted-foreground text-sm mt-2">Legg til 3+ spillere</p>
      </div>

      {/* Name input */}
      <div className="flex gap-3 w-full">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Spillernavn..."
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all outline-none"
          maxLength={20}
        />
        <Button
          onClick={addPlayer}
          disabled={!nameInput.trim() || isDuplicate(nameInput.trim())}
          className="rounded-xl px-5 transition-transform active:scale-95"
          size="lg"
        >
          Legg til
        </Button>
      </div>

      {/* Duplicate warning */}
      {nameInput.trim() && isDuplicate(nameInput.trim()) && (
        <p className="text-destructive text-xs -mt-6">Navnet er allerede lagt til</p>
      )}

      {/* Recent players */}
      {availableRecent.length > 0 && (
        <div className="w-full">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Nylige spillere:</p>
          <div className="flex flex-wrap gap-2">
            {availableRecent.map((r) => (
              <button
                key={r.id}
                onClick={() => addRecentPlayer(r)}
                className="flex items-center gap-1.5 rounded-full border border-input px-4 py-2 text-sm hover:bg-accent hover:scale-[1.03] active:scale-95 transition-all shadow-sm"
              >
                <span>{r.icon}</span>
                <span>{r.name}</span>
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
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-md shadow-black/10"
            >
              <button
                onClick={() => cycleIcon(p.id)}
                className="text-3xl hover:scale-110 active:scale-90 transition-transform"
                title="Bytt ikon"
              >
                {p.icon}
              </button>
              <span className="flex-1 font-semibold text-base">{p.name}</span>
              <button
                onClick={() => removePlayer(p.id)}
                className="text-muted-foreground hover:text-destructive text-base p-2 rounded-lg hover:bg-destructive/10 transition-all active:scale-90"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Start button */}
      <Button
        onClick={() => onStart(players)}
        disabled={players.length < 3}
        className="w-full rounded-xl text-base font-bold transition-transform active:scale-[0.98] shadow-lg"
        size="lg"
      >
        Start spill ({players.length} spillere)
      </Button>
    </div>
  );
}
