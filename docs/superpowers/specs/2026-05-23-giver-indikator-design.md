# Giver-indikator — design

**Dato:** 2026-05-23
**Status:** Godkjent design, klar for implementasjonsplan

## Bakgrunn

Tilbakemelding fra brukere: det er ønskelig å visualisere hvem sin tur det er
å stokke og dele ut kort. Det går på rundgang — hver spiller gir kort i én
runde. Faren til eieren foreslo fargekoding; alt var åpent for forslag.

## Beslutninger

To valg ble avklart med brukeren:

1. **Visuell stil:** Badge i scoreboard (uthevet celle i totalraden), ikke egen
   rad. Valgt fordi det (a) er glanceable og dermed løser kjerneproblemet om at
   folk mister oversikten, (b) koster null ekstra høyde og respekterer det
   nylige «kompakt layout»-arbeidet, og (c) lar fargekodingen leve uten ny
   plass.
2. **Kontrollnivå:** Helautomatisk. Giveren utledes rent av runde + spiller­-
   rekkefølge. Ingen knapper, ingen ny `localStorage`.

## Domenelogikk

Giver i runde *i* (0-indeksert) = `players[i % players.length]`.

- Runde 1 (Pass) gis av spiller 1 — den som ble lagt til først i oppsettet.
- Deretter ruller det automatisk runde for runde.
- Appen er fasit for hvem sin tur det er, så fysisk bordplassering er
  irrelevant. Vi trenger ikke seteplassering som input.

### Kanttilfeller

- **5 spillere:** perfekt — alle gir nøyaktig én gang.
- **3–4 spillere:** de første spillerne gir to ganger. Uunngåelig i et
  5-runders spill; appen viser det bare.
- **6+ spillere:** noen rekker aldri å gi i løpet av 5 runder. Også uunngåelig.
- **Tom spillerliste:** funksjonen må returnere `undefined` trygt (skjer ikke i
  `playing`-status, men holdes defensivt).

Appen prøver ikke å «fikse» urettferdigheten ved ulikt antall — den viser kun
hvem som gir akkurat nå.

## Komponenter

### 1. `src/lib/dealer.ts` (ny)

Ren funksjon med én jobb:

```ts
export function getDealer(players: Player[], roundIndex: number): Player | undefined {
  if (players.length === 0) return undefined;
  return players[roundIndex % players.length];
}
```

Isolert og enkel å teste. Avhenger kun av `Player`-typen.

### 2. `src/lib/__tests__/dealer.test.ts` (ny)

Dekker:
- Rotasjon for 3, 4, 5 og 6 spillere over alle 5 runder.
- Wrap-around (runde-indeks > antall spillere).
- Tom spillerliste → `undefined`.

### 3. `src/components/Scoreboard.tsx` (endret)

Scoreboard har allerede `players` og `currentRound` som props — ingen ny
prop-flyt nødvendig.

- Beregn `dealerId = getDealer(players, currentRound)?.id`.
- I totalraden får giverens celle:
  - en myk farget uthevingsboks (fargekoding) — distinkt fra poengfargene
    (grønn = lavest/leder, `fk-berry` = høyest), så semantikken ikke kolliderer.
  - et lite «🃏 gir»-merke under navnet.

Eksakt farge og merketekst («gir» vs. «stokker») finjusteres under
implementasjon. UI-tekst forblir norsk.

## Persistens

Ingen. Giveren er rent utledet av `currentRound` + `players`, som begge allerede
finnes og gjenopprettes ved «fortsett spill». Ingenting kan komme ut av synk.

## Utenfor scope

- Historikk og sammendrag viser ikke hvem som ga i hver runde. Tilbakemeldingen
  gjelder live spill («hvem sin tur nå»).
- Manuell overstyring / valg av første giver (avvist til fordel for
  helautomatisk).
- Per-spiller faste farger (spillerne har allerede distinkte emoji-ikoner som
  identitet).

## Testing

`dealer.ts` er ren og dekkes av Vitest som beskrevet over. `Scoreboard.tsx` er
en komponent og testes ikke (i tråd med eksisterende praksis i repoet).
