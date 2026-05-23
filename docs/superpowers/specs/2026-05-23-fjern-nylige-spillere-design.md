# Fjern nylige spillere — design

**Dato:** 2026-05-23
**Status:** Godkjent design, klar for implementasjonsplan

## Bakgrunn

Tilbakemelding (fra eierens far): det er ingen måte å fjerne nylige spillere fra
setup-siden. Bruksscenario: neste gang man er på hytta med en annen gjeng vil man
bli kvitt forrige gruppes navn så forslag-chipsene er relevante.

I dag ligger nylige spillere i `localStorage` (`femkamp-recent-players`, maks 10,
deduplisert på lowercased navn). På setup-siden vises de som trykkbare chips
(`availableRecent` i `PlayerSetup.tsx`) som legger spilleren til når du trykker.
Det finnes ingen fjern-funksjon; navn faller bare av når 10 nye distinkte navn har
dyttet dem ut.

## Beslutning

Granularitet ble avklart med brukeren: **✕ på hver chip** (ikke en «tøm alt»-knapp).

Begrunnelse: appen har allerede et konsistent fjern-mønster — en liten ✕ uten
bekreftelsesdialog — i Historikk (`History.tsx`, slett spill) og i spillerlista på
setup-siden (`PlayerSetup.tsx`, fjern spiller). En ✕ per nylig-chip gjenbruker det
mønsteret, er fleksibelt (behold faste spillere, fjern engangsgjester, rett opp
skrivefeil-navn), og siden lista er kappet på 10 blir det aldri mange å fjerne.

Ingen «tøm alt» og ingen bekreftelsesdialog (utenfor scope) — en feilfjernet spiller
er triviell å legge til igjen.

## Komponenter

### 1. `src/lib/storage.ts` (endret)

Ny funksjon:

```ts
export function removeRecentPlayer(name: string): void {
  const remaining = loadRecentPlayers().filter(
    (p) => p.name.toLowerCase() !== name.toLowerCase()
  );
  localStorage.setItem(KEYS.recentPlayers, JSON.stringify(remaining));
}
```

Matcher på lowercased navn fordi det er identitetsnøkkelen i hele recent-systemet
(`loadRecentPlayers`/`saveRecentPlayers` dedupliserer på navn, og `addRecentPlayer`
i `PlayerSetup` lager en ny `id` ved tillegging, så `id` er ikke stabil for recent-
spillere). Skriver den filtrerte lista direkte med `setItem` (ikke via
`saveRecentPlayers`, som ville re-merget).

### 2. `src/components/PlayerSetup.tsx` (endret)

- Flytt `recentPlayers` fra en engangs-`loadRecentPlayers()` ved render til
  `useState(loadRecentPlayers)`, slik at en fjerning kan re-rendre lista. Speiler
  `History.tsx` sitt `const [games, setGames] = useState(loadHistory)` +
  `setGames(loadHistory())`.
- Ny handler:

  ```ts
  const removeRecent = (name: string) => {
    removeRecentPlayer(name);
    setRecentPlayers(loadRecentPlayers());
  };
  ```

- Hver nylig-chip blir en container med to trykkmål: navn/ikon = «legg til» (som
  før, kaller `addRecentPlayer`), og en liten ✕ = «fjern fra nylige» (kaller
  `removeRecent(r.name)`). ✕ bruker samme styling som Historikk
  (`text-muted-foreground hover:text-destructive`), med `aria-label` for
  tilgjengelighet. Ingen bekreftelse.

## Oppførsel / kanttilfeller

- `availableRecent` skjuler allerede spillere som er lagt til i gjeldende spill, så
  ✕ vises kun på forslag som ikke er brukt ennå.
- Fjernes alle, forsvinner hele «Nylige spillere»-seksjonen automatisk (den er alt
  betinget på `availableRecent.length > 0`).
- Fjerning påvirker ikke gjeldende spilleroppsett, kun forslagslista i
  `localStorage`.

## Utenfor scope

- «Tøm alle»-knapp (avvist til fordel for per-chip ✕).
- Bekreftelsesdialog ved fjerning (appen bruker ikke bekreftelse for ✕ ellers).
- Angre-funksjon.

## Testing

`src/lib/storage.ts` er ikke enhetstestet i repoet i dag — det krever en
DOM-/`localStorage`-mock (vitest kjører i node-miljø uten DOM), og CLAUDE.md sier vi
ikke skal finne opp ny testinfrastruktur uten å bli bedt om det. Logikken er ett
`filter`-kall. Verifiseres med `npm run build` (type-check) + `npm run lint`, og en
manuell sjekk live (Playwright) etter deploy. Komponenter testes ikke (eksisterende
praksis).
