# Giver-indikator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show whose turn it is to shuffle and deal cards by highlighting that player's cell in the scoreboard, auto-rotating one player per round.

**Architecture:** The dealer is purely derived — `players[currentRound % players.length]` — so there is no new persisted state. A new pure helper `getDealer` lives in `src/lib/dealer.ts` with unit tests. `Scoreboard.tsx` (which already receives `players` and `currentRound`) reads it and adds a colored highlight + a "🃏 gir" badge to the dealer's cell in the totals row.

**Tech Stack:** React 19, TypeScript, Vite, Vitest 4, Tailwind v4. All user-facing text is Norwegian.

---

## File Structure

- **Create** `src/lib/dealer.ts` — single pure function `getDealer(players, roundIndex)`. One responsibility: map a round to its dealer.
- **Create** `src/lib/__tests__/dealer.test.ts` — unit tests for the rotation and edge cases.
- **Modify** `src/components/Scoreboard.tsx` — render the dealer highlight in the existing totals row. No new props (it already has `players` and `currentRound`).

Spec reference: `docs/superpowers/specs/2026-05-23-giver-indikator-design.md`.

---

## Task 1: `getDealer` pure helper (TDD)

**Files:**
- Create: `src/lib/dealer.ts`
- Test: `src/lib/__tests__/dealer.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/dealer.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getDealer } from "../dealer";
import type { Player } from "../../types";

const mkPlayers = (n: number): Player[] =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `P${i}`, icon: "🦊" }));

const dealersOver5Rounds = (players: Player[]): (string | undefined)[] =>
  [0, 1, 2, 3, 4].map((round) => getDealer(players, round)?.id);

describe("getDealer", () => {
  it("rotates through 5 players, one each over 5 rounds", () => {
    expect(dealersOver5Rounds(mkPlayers(5))).toEqual(["p0", "p1", "p2", "p3", "p4"]);
  });

  it("wraps around with 3 players over 5 rounds", () => {
    expect(dealersOver5Rounds(mkPlayers(3))).toEqual(["p0", "p1", "p2", "p0", "p1"]);
  });

  it("wraps around with 4 players over 5 rounds", () => {
    expect(dealersOver5Rounds(mkPlayers(4))).toEqual(["p0", "p1", "p2", "p3", "p0"]);
  });

  it("with 6 players, the 6th never deals in a 5-round game", () => {
    const dealers = dealersOver5Rounds(mkPlayers(6));
    expect(dealers).toEqual(["p0", "p1", "p2", "p3", "p4"]);
    expect(dealers).not.toContain("p5");
  });

  it("returns undefined for an empty player list", () => {
    expect(getDealer([], 0)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/dealer.test.ts`
Expected: FAIL — cannot resolve `../dealer` / `getDealer is not a function`.

- [ ] **Step 3: Write the minimal implementation**

Create `src/lib/dealer.ts`:

```ts
import type { Player } from "../types";

/**
 * Whose turn it is to shuffle and deal in a given round.
 *
 * The dealer rotates one player per round, in the order players were added.
 * The app is the source of truth for whose turn it is, so physical seating
 * order is irrelevant. Round 0 (Pass) is dealt by the first player.
 *
 * Returns undefined only when there are no players (never happens once a game
 * is in the "playing" state, but kept defensive).
 */
export function getDealer(players: Player[], roundIndex: number): Player | undefined {
  if (players.length === 0) return undefined;
  return players[roundIndex % players.length];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/dealer.test.ts`
Expected: PASS — 5 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/dealer.ts src/lib/__tests__/dealer.test.ts
git commit -m "feat: add getDealer helper for dealer rotation"
```

---

## Task 2: Render dealer highlight in the scoreboard

**Files:**
- Modify: `src/components/Scoreboard.tsx`

This task changes a React component. Components are not unit-tested in this repo (see CLAUDE.md), so verification is via type-check + lint + a manual visual check in `npm run dev`.

- [ ] **Step 1: Import `getDealer`**

In `src/components/Scoreboard.tsx`, add the import below the existing scoring import (around line 4):

```ts
import { calculateRoundScore } from "../lib/scoring";
import { getDealer } from "../lib/dealer";
```

- [ ] **Step 2: Compute the dealer id**

Inside the `Scoreboard` component body, after the `getColor` helper (around line 32, before the `return`), add:

```ts
  const dealerId = getDealer(players, currentRound)?.id;
```

- [ ] **Step 3: Highlight the dealer's cell in the totals row**

Replace the entire totals-row `players.map(...)` block (currently lines 41–50):

```tsx
        {players.map((p) => (
          <div key={p.id} className="text-center min-w-[60px] sm:min-w-[90px] lg:min-w-[110px]">
            <div className="text-xs sm:text-sm lg:text-xl text-muted-foreground font-semibold leading-tight">
              {p.icon} {p.name}
            </div>
            <div className={`text-2xl sm:text-3xl lg:text-5xl font-extrabold tabular-nums leading-none ${getColor(totalScores[p.id] ?? 0)}`}>
              {totalScores[p.id] ?? 0}
            </div>
          </div>
        ))}
```

with this version (padding is applied to every cell so the score numbers stay vertically aligned; only the dealer gets the background ring and the badge):

```tsx
        {players.map((p) => {
          const isDealer = p.id === dealerId;
          return (
            <div
              key={p.id}
              className={`text-center min-w-[60px] sm:min-w-[90px] lg:min-w-[110px] rounded-xl px-1.5 py-1 sm:px-2 transition-colors ${
                isDealer ? "bg-fk-aurora/70 ring-1 ring-fk-ink/15" : ""
              }`}
            >
              <div className="text-xs sm:text-sm lg:text-xl text-muted-foreground font-semibold leading-tight">
                {p.icon} {p.name}
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-5xl font-extrabold tabular-nums leading-none ${getColor(totalScores[p.id] ?? 0)}`}>
                {totalScores[p.id] ?? 0}
              </div>
              {isDealer && (
                <div className="mt-0.5 text-[10px] sm:text-xs lg:text-sm font-bold text-fk-ink leading-none whitespace-nowrap">
                  🃏 gir
                </div>
              )}
            </div>
          );
        })}
```

- [ ] **Step 4: Type-check and lint**

Run: `npm run build`
Expected: PASS — `tsc -b` reports no errors and Vite build completes.

Run: `npm run lint`
Expected: PASS — no new ESLint errors.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open the app, start a game with 3+ players.
Expected: the first player's cell in the top scoreboard has a soft highlight box and a "🃏 gir" badge under their score. Press "Neste runde →" and confirm the highlight moves to the next player, wrapping back to the first player after the last player.

- [ ] **Step 6: Commit**

```bash
git add src/components/Scoreboard.tsx
git commit -m "feat: show dealer (giver) highlight in scoreboard"
```

---

## Self-Review notes

- **Spec coverage:** derivation logic → Task 1; scoreboard badge + color highlight → Task 2; "no new persisted state" → satisfied (nothing written to localStorage); edge cases (3/4/5/6 players, empty list) → Task 1 tests. Out-of-scope items (history, manual override, per-player colors) intentionally have no task.
- **Type consistency:** `getDealer(players, roundIndex)` signature is identical in the helper, its tests, and the Scoreboard call site. It returns `Player | undefined`; the call site uses optional chaining `?.id`.
- **Tailwind tokens used** (`fk-aurora`, `fk-ink`) already exist in the codebase (used in `PlayerSetup.tsx` and `Scoreboard.tsx`).
