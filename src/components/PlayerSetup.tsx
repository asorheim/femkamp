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
    if (!name || isDuplicate(name) || players.length >= 5) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      icon: assignIcon(players.length),
    };
    setPlayers([...players, newPlayer]);
    setNameInput("");
  };

  const addRecentPlayer = (recent: Player) => {
    if (isDuplicate(recent.name) || players.length >= 5) return;
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
    <div className="flex flex-col items-center gap-6 p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Femkamp 🃏</h1>
      <p className="text-muted-foreground text-sm">Legg til 3–5 spillere</p>

      {/* Name input */}
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Spillernavn..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          maxLength={20}
          disabled={players.length >= 5}
        />
        <Button
          onClick={addPlayer}
          disabled={!nameInput.trim() || isDuplicate(nameInput.trim()) || players.length >= 5}
        >
          Legg til
        </Button>
      </div>

      {/* Duplicate warning */}
      {nameInput.trim() && isDuplicate(nameInput.trim()) && (
        <p className="text-destructive text-xs -mt-4">Navnet er allerede lagt til</p>
      )}

      {/* Recent players */}
      {availableRecent.length > 0 && players.length < 5 && (
        <div className="w-full">
          <p className="text-xs text-muted-foreground mb-2">Nylige spillere:</p>
          <div className="flex flex-wrap gap-2">
            {availableRecent.map((r) => (
              <button
                key={r.id}
                onClick={() => addRecentPlayer(r)}
                className="flex items-center gap-1 rounded-full border border-input px-3 py-1 text-sm hover:bg-accent transition-colors"
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
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <button
                onClick={() => cycleIcon(p.id)}
                className="text-2xl hover:scale-110 transition-transform"
                title="Bytt ikon"
              >
                {p.icon}
              </button>
              <span className="flex-1 font-medium">{p.name}</span>
              <button
                onClick={() => removePlayer(p.id)}
                className="text-muted-foreground hover:text-destructive text-sm"
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
        className="w-full"
        size="lg"
      >
        Start spill ({players.length}/3–5)
      </Button>
    </div>
  );
}
