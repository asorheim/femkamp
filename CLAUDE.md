# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Femkamp is a Norwegian-language scorekeeper (PWA-style, single-page) for a 5-round card game played on mobile. All state lives in `localStorage`; there is no backend. UI text is Norwegian — keep it that way when editing user-facing strings.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — type-check (`tsc -b`) then Vite build
- `npm run lint` — ESLint over the repo
- `npm test` — run Vitest once
- `npm run test:watch` — Vitest watch mode
- Run a single test file: `npx vitest run src/lib/__tests__/scoring.test.ts`
- Filter tests by name: `npx vitest run -t "pattern"`

## Stack notes

- React 19, TypeScript, Vite 8, Vitest 4
- Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.*` — config lives in `src/index.css`)
- UI primitives in `src/components/ui/` are shadcn-style components built on `@base-ui/react` (not Radix). When adding primitives, follow the existing wrappers rather than assuming Radix APIs.
- Path alias: `@/*` → `src/*` (see `vite.config.ts` and `tsconfig.app.json`)

## Architecture

The app is a finite state machine driven by one hook, `useGameState` (`src/hooks/useGameState.ts`), which owns the entire `GameState` and persists it to `localStorage` on every change. `App.tsx` is a pure view-switcher over `state.status` (`setup` → `playing` → `finished`) and a separate `screen` local state for the history view.

**Rounds** are the core domain concept. `ROUND_ORDER` in `src/types.ts` defines the fixed sequence (`pass`, `klover`, `kabal`, `dame`, `grand`) and each round has a distinct `RoundScore` shape:
- `pass` / `klover` / `grand` — counter-based (`counts: Record<playerId, number>`), rendered by `CounterRound`. `grand` scores *negative*.
- `dame` — `queenAssignments: Record<queenId, playerId>`, each queen worth +4, rendered by `QueenRound`.
- `kabal` — `passes` + `remaining` per player, rendered by `SolitaireRound`.

When adding a new round type or changing scoring, three places must stay in sync:
1. The `RoundScore` discriminated union in `src/types.ts` (+ `ROUND_ORDER`, `ROUND_LABELS`, `ROUND_DESCRIPTIONS`).
2. `createInitialRounds` in `useGameState.ts` (zero-state factory for the new shape).
3. `calculateRoundScore` in `src/lib/scoring.ts` (+ covering tests in `src/lib/__tests__/scoring.test.ts`).

`App.tsx` also needs a new conditional block wiring the round type to its component. The discriminated union makes TypeScript surface missing cases — lean on exhaustiveness rather than runtime guards.

**Persistence** (`src/lib/storage.ts`) uses three localStorage keys: `femkamp-game-state` (in-progress game, cleared on finish), `femkamp-history` (completed games, newest first), and `femkamp-recent-players` (deduped by lowercased name, capped at 10). `loadRecentPlayers` defensively dedupes on read to repair legacy data — preserve that behavior.

**Winners** are players with the *lowest* total score (`getWinners` in `scoring.ts`) — this is a low-score-wins game, which is easy to get wrong when adding summary UI.

## Tests

Only `src/lib/scoring.ts` has tests today. Scoring is pure and the natural place to add coverage when touching round logic. Components are not tested — don't invent a React testing setup unless asked.
