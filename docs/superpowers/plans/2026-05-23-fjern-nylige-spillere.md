# Fjern nylige spillere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users remove individual recent players from the setup page via a small ✕ on each recent-player chip.

**Architecture:** A new `removeRecentPlayer(name)` in `src/lib/storage.ts` filters the player out of the `femkamp-recent-players` localStorage list (matched by lowercased name). `PlayerSetup.tsx` holds the recent list in React state (so removal re-renders), and each recent chip gains a ✕ button styled exactly like the existing remove ✕ used in `History.tsx`. No confirmation dialog — consistent with the rest of the app.

**Tech Stack:** React 19, TypeScript, Vite, Vitest 4 (node env — no DOM mock), Tailwind v4. All user-facing text is Norwegian.

---

## File Structure

- **Modify** `src/lib/storage.ts` — add `removeRecentPlayer(name)`. The module owns all localStorage access; this is the right home.
- **Modify** `src/components/PlayerSetup.tsx` — recent list becomes state; each chip gets an add-target + a ✕ remove-target.

Spec reference: `docs/superpowers/specs/2026-05-23-fjern-nylige-spillere-design.md`.

**Note on testing:** `storage.ts` has no unit tests in this repo because Vitest runs in a node environment with no `localStorage`, and CLAUDE.md says not to invent new test infrastructure unprompted. So Task 1 is verified by type-check, and the behavior is exercised by the Task 2 manual check. Components are not tested either (existing practice).

---

## Task 1: `removeRecentPlayer` in storage

**Files:**
- Modify: `src/lib/storage.ts`

- [ ] **Step 1: Add the function**

In `src/lib/storage.ts`, add this function immediately after the existing `saveRecentPlayers` function (it is the last function in the file):

```ts
export function removeRecentPlayer(name: string): void {
  const remaining = loadRecentPlayers().filter(
    (p) => p.name.toLowerCase() !== name.toLowerCase()
  );
  localStorage.setItem(KEYS.recentPlayers, JSON.stringify(remaining));
}
```

This reuses the existing `loadRecentPlayers()` (which already dedupes on read) and the existing `KEYS.recentPlayers` constant. It matches on lowercased name because that is the identity key for the recent-players system (`saveRecentPlayers` dedupes by name, and recent-player `id`s are regenerated on add).

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: PASS — `tsc -b` reports no errors and the Vite build completes. (An exported-but-not-yet-used function is fine; it is wired up in Task 2.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: add removeRecentPlayer to storage"
```

---

## Task 2: ✕ remove on recent-player chips

**Files:**
- Modify: `src/components/PlayerSetup.tsx`

Verification is via type-check + lint + a manual visual check (the repo does not unit-test components).

- [ ] **Step 1: Import `removeRecentPlayer`**

In `src/components/PlayerSetup.tsx`, change the storage import (currently `import { loadRecentPlayers } from "../lib/storage";`) to:

```ts
import { loadRecentPlayers, removeRecentPlayer } from "../lib/storage";
```

- [ ] **Step 2: Make the recent list stateful**

Replace this line (currently near the top of the component body):

```ts
  const recentPlayers = loadRecentPlayers();
```

with:

```ts
  const [recentPlayers, setRecentPlayers] = useState<Player[]>(loadRecentPlayers);
```

`useState` is already imported (`import { useState } from "react";`) and `Player` is already imported (`import type { Player } from "../types";`), so no new imports are needed for this step.

- [ ] **Step 3: Add the `removeRecent` handler**

Add this handler next to the other handlers in the component (e.g. directly after the existing `removePlayer` function):

```ts
  const removeRecent = (name: string) => {
    removeRecentPlayer(name);
    setRecentPlayers(loadRecentPlayers());
  };
```

This mirrors the `History.tsx` pattern (`deleteGame(...)` then `setGames(loadHistory())`).

- [ ] **Step 4: Restructure the recent-player chip**

Replace the entire recent-chip block. The current code is:

```tsx
              {availableRecent.map((r) => (
                <button
                  key={r.id}
                  onClick={() => addRecentPlayer(r)}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base bg-card border border-border text-foreground fk-btn-lift"
                >
                  <span>{r.icon}</span>
                  <span className="font-medium">{r.name}</span>
                </button>
              ))}
```

Replace it with (a chip container `<div>` with an add-target button and a ✕ remove button — two tap targets, no nested buttons):

```tsx
              {availableRecent.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-1 rounded-full pl-4 pr-2 py-2 sm:pl-5 sm:py-3 text-sm sm:text-base bg-card border border-border text-foreground fk-card-shadow"
                >
                  <button
                    onClick={() => addRecentPlayer(r)}
                    className="flex items-center gap-1.5"
                  >
                    <span>{r.icon}</span>
                    <span className="font-medium">{r.name}</span>
                  </button>
                  <button
                    onClick={() => removeRecent(r.name)}
                    className="ml-0.5 p-1 rounded-full text-xs text-muted-foreground hover:text-destructive transition-all active:scale-90"
                    title="Fjern fra nylige"
                    aria-label={`Fjern ${r.name} fra nylige`}
                  >
                    ✕
                  </button>
                </div>
              ))}
```

(The wrapper switches from `fk-btn-lift` to `fk-card-shadow` because it is no longer a single pressable button — same shadow class the player-list rows and the name input already use.)

- [ ] **Step 5: Type-check and lint**

Run: `npm run build`
Expected: PASS — `tsc -b` reports no errors and the Vite build completes.

Run: `npm run lint`
Expected: no NEW errors. (There are two pre-existing ESLint errors in `src/components/ui/badge.tsx` and `src/components/ui/button.tsx` — unrelated and out of scope. Confirm the count/locations are unchanged.)

- [ ] **Step 6: Manual visual check**

Run: `npm run dev`, open the app. To have recent players to remove, you may need to complete a game once first (recent players are saved when a game starts). With at least one recent player showing under "Nylige spillere":
Expected: each recent chip shows the name (tappable to add) and a small ✕. Tapping ✕ removes that chip immediately without a dialog. Removing the last one makes the whole "Nylige spillere" section disappear. Tapping the name (not the ✕) still adds the player as before.

- [ ] **Step 7: Commit**

```bash
git add src/components/PlayerSetup.tsx
git commit -m "feat: remove recent players with per-chip ✕ on setup page"
```

---

## Self-Review notes

- **Spec coverage:** `removeRecentPlayer(name)` storage fn → Task 1; recent list in state → Task 2 Step 2; per-chip ✕ matching History styling, no confirmation → Task 2 Steps 3–4; section auto-hides when empty → already handled by the existing `availableRecent.length > 0` guard (unchanged). Out-of-scope items (clear-all, confirm dialog, undo) intentionally have no task.
- **Type consistency:** `removeRecentPlayer(name: string): void` — same signature in the storage definition (Task 1) and both call sites (`removeRecentPlayer` import and `removeRecent` handler in Task 2). `setRecentPlayers(loadRecentPlayers())` matches the `useState<Player[]>` declaration.
- **No new test infra:** consistent with the spec — storage/components untested in this repo; verification is build + lint + manual.
- **Tailwind tokens** used (`fk-card-shadow`, `bg-card`, `border-border`, `text-muted-foreground`, `hover:text-destructive`) all already exist in the codebase.
