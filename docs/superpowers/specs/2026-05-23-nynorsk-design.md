# Omgjering til nynorsk (+ resume-feilretting) — design

**Dato:** 2026-05-23
**Status:** Godkjent design, klar for implementasjonsplan

## Bakgrunn

Eigaren sin far ønskjer at all synleg tekst i appen er **god nynorsk** i staden for
bokmål. Same jobb buntar inn ei lita feilretting som vart oppdaga tidlegare: eit
ferdigspelt spel blir lagra og dukkar opp att som vinnar-skjerm ved omlasting i
staden for å gå til oppsett.

CLAUDE.md sin regel «UI text is Norwegian — keep it that way» blir oppdatert til å
seie nynorsk.

## Omfang

**Endrast:**
- Alle synlege UI-strengar i: `types.ts`, `lib/scoring.ts`, `App.tsx`,
  `components/PlayerSetup.tsx`, `components/Scoreboard.tsx`,
  `components/GameSummary.tsx`, `components/History.tsx`,
  `components/rounds/SolitaireRound.tsx`, `components/rounds/QueenRound.tsx`.
- Datolokalet i `History.tsx`: `"nb-NO"` → `"nn-NO"`.
- `CLAUDE.md`: endre «Norwegian»-regelen til «Nynorsk».
- Resume-feilretting i `hooks/useGameState.ts`.

**Endrast IKKJE:**
- Kodekommentarar, variabel-/funksjonsnamn, typenamn, localStorage-nøklar.
- Kortuttrykk som «stikk», «kløver», «kabal», «pass», «grand», «restkort».
- Appnamnet «Femkamp». Rundenamna «Passrunda», «Kløverrunda», «Damerunda»,
  «Grangrunda», «Kabalrunda» (suffikset «-runda» er gangbart på nynorsk).

## Ordliste (bokmål → nynorsk) — godkjend

| Bokmål | Nynorsk |
|--------|---------|
| spill (subst.) | spel |
| spille (verb) | spele |
| spiller / spillere | spelar / spelarar |
| spillernavn | spelarnamn |
| hver / hvert | kvar / kvart |
| hvem | kven |
| velge | velje |
| bytte / bytt | byte / byt |
| lavest | lågast |
| vinner! (verb) | vinn! |
| forrige | førre |
| nylige | nylege |
| fra | frå |
| ennå | enno |
| allerede | allereie |
| pågående | pågåande |
| fortsette / fortsett | halde fram / hald fram |
| se historikk | sjå historikk |
| et / en | eit / ein |
| runder (fleirtal av runde) | rundar |
| Prikker (fleirtal) | Prikkar |
| gir (gjev kort) | gjev |
| Hjerter dame | Hjarter dame |

## Eksakte streng-endringar per fil

### `src/types.ts` — `ROUND_DESCRIPTIONS`
- pass: `"Hver stikk = 1 poeng"` → `"Kvart stikk = 1 poeng"`
- klover: `"Hver kløver = 1 poeng"` → `"Kvar kløver = 1 poeng"`
- dame: `"Hver dame = 4 poeng"` → `"Kvar dame = 4 poeng"`
- grand: `"Hver stikk = −1 poeng"` → `"Kvart stikk = −1 poeng"`
- kabal: `"Prikker + restkort = poeng"` → `"Prikkar + restkort = poeng"`

`ROUND_LABELS` er uendra.

### `src/lib/scoring.ts` — `getRoundIncompleteHint`
- `` `Mangler ${expected - total} av ${expected} ${unit}` `` → `` `Manglar ${expected - total} av ${expected} ${unit}` ``
- `` `Mangler ${4 - assigned} av 4 damer` `` → `` `Manglar ${4 - assigned} av 4 damer` ``
- `unit`-verdiane `"kløver"`/`"stikk"` er uendra.

### `src/App.tsx`
- `"Fortsette spill?"` → `"Halde fram med spelet?"`
- `"Du har et pågående spill med "` → `"Du har eit pågåande spel med "`
- `". Vil du fortsette eller starte på nytt?"` → `". Vil du halde fram eller starte på nytt?"`
- `"Nytt spill"` → `"Nytt spel"`
- `"Fortsett"` → `"Hald fram"`
- `"← Forrige"` → `"← Førre"`
- `"Avslutt spill"` → `"Avslutt spel"` (i `isLastRound`-uttrykket)
- `"Neste runde →"` er uendra.

### `src/components/PlayerSetup.tsx`
- `"Fem runder · lavest poeng vinner"` → `"Fem rundar · lågast poeng vinn"`
- placeholder `"Spillernavn..."` → `"Spelarnamn..."`
- `"Navnet er allerede lagt til"` → `"Namnet er allereie lagt til"`
- `"Nylige spillere:"` → `"Nylege spelarar:"`
- title `"Trykk for å bytte ikon"` → `"Trykk for å byte ikon"`
- aria-label `"Bytt ikon"` → `"Byt ikon"`
- title `"Fjern fra nylige"` → `"Fjern frå nylege"`
- aria-label `` `Fjern ${r.name} fra nylige` `` → `` `Fjern ${r.name} frå nylege` ``
- `` `Start spill (${players.length} ${players.length === 1 ? "spiller" : "spillere"})` `` → `` `Start spel (${players.length} ${players.length === 1 ? "spelar" : "spelarar"})` ``
- `"Legg til minst 3 spillere"` → `"Legg til minst 3 spelarar"`
- `` `Legg til ${3 - players.length} spiller${3 - players.length === 1 ? "" : "e"} til` `` → `` `Legg til ${3 - players.length} spelar${3 - players.length === 1 ? "" : "ar"} til` ``
- `"Legg til"`-knappeteksten er uendra.

### `src/components/Scoreboard.tsx`
- `"🃏 gir"` → `"🃏 gjev"`
- tabelloverskrifta `"Runde"` er uendra.

### `src/components/GameSummary.tsx`
- `"vinner!"` → `"vinn!"`
- tabelloverskrifta `"Spiller"` → `"Spelar"`
- `"Nytt spill"` → `"Nytt spel"`
- `"Se historikk"` → `"Sjå historikk"`
- `"Totalt"` og `"poeng totalt"` er uendra.

### `src/components/History.tsx`
- `"Ingen spill ennå. Spill en runde femkamp!"` → `"Ingen spel enno. Spel ein runde femkamp!"`
- `toLocaleDateString("nb-NO", …)` → `toLocaleDateString("nn-NO", …)`
- `"Historikk"`, `"← Tilbake"`, title `"Slett"` er uendra.

### `src/components/rounds/SolitaireRound.tsx`
- labelen `"Prikker"` → `"Prikkar"`
- `"Restkort"` og `"= {subtotal} poeng"` er uendra.

### `src/components/rounds/QueenRound.tsx`
- QUEENS-label `"Hjerter dame"` → `"Hjarter dame"` (Spar/Ruter/Kløver uendra)
- `"Trykk for å velge"` → `"Trykk for å velje"`
- `"Hvem tok {label.toLowerCase()}?"` → `"Kven tok {label.toLowerCase()}?"`
- `"✕ Fjern"` er uendra.

## Resume-feilretting

`src/hooks/useGameState.ts`, persisterings-effekten:

```ts
useEffect(() => {
  if (state.status !== "setup") { saveGameState(state); }
}, [state]);
```

**Rotårsak:** Når `nextRound` avsluttar siste runde, kallar han `clearGameState()`
og set `status: "finished"`. Effekten over køyrer etterpå, ser `status !== "setup"`,
og lagrar den ferdige tilstanden på nytt — så `clearGameState()` blir overskriven.
Ved omlasting lastar `loadGameState()` den ferdige tilstanden og viser vinnar-
skjermen i staden for oppsett.

**Retting:** lagre berre medan spelet er i gang:

```ts
useEffect(() => {
  if (state.status === "playing") { saveGameState(state); }
}, [state]);
```

Då overlever `clearGameState()` ved avslutning, og omlasting går til oppsett.
Eit pågåande spel blir framleis lagra og gjev resume-dialogen som før.

### `CLAUDE.md`
Oppdater Project-avsnittet og regelen så dei seier «Nynorsk» i staden for berre
«Norwegian».

## Testing

- `npm run build` (type-sjekk) + `npm run lint` (ingen nye feil; dei 2 i
  `badge.tsx`/`button.tsx` er kjende frå før).
- Manuell verifisering live (Playwright) etter deploy: gå gjennom kvar skjerm og
  stadfest at tekstane er nynorske, og at eit ferdigspelt spel går til oppsett ved
  omlasting (resume-feilrettinga).
- `src/lib/scoring.ts` har testar; strengendringa der gjeld berre hint-tekst og
  bryt ikkje testane (dei sjekkar ikkje hint-strengane).

## Utanfor scope

- Omsetjing av kodekommentarar/identifikatorar.
- Endring av kortterminologi eller rundenamn.
- Fleirspråkstøtte / språkval (berre nynorsk no).
