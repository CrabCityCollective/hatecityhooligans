# Hate City Hooligans — CLAUDE.md

Zie [`hate-city-hooligans-design.md`](./hate-city-hooligans-design.md) voor het volledige spelontwerp.

## Stack

- **Next.js (App Router) + TypeScript** — `app/` bevat routes, geen `src/`-map.
- **Zustand** voor lokale state management (zie ADR hieronder).
- Geen backend/database: de MVP is volledig client-side. State kan later
  gepersisteerd worden via `zustand/middleware`'s `persist` (localStorage) —
  dat is nu bewust nog niet toegevoegd.

## ADR: State management — Zustand i.p.v. React Context

**Status:** geaccepteerd.

**Context:** de game-state (gang, roster, geld, beruchtheid, politie-meter,
week/divisie) wordt vanuit veel verschillende plekken gelezen en bijgewerkt
(gevecht-simulatie, recruitment, inkopen, weekprogressie), en verandert
regelmatig tijdens een sessie.

**Beslissing:** Zustand.

**Waarom niet React Context:**
- Context re-rendert elke consumer bij elke state-wijziging, tenzij je zelf
  gaat splitsen in meerdere contexts/providers of memoization toevoegt. Voor
  frequent wisselende waarden (politie-meter, gevecht-ticks) is dat onnodige
  complexiteit.
- Context + `useReducer` betekent zelf boilerplate schrijven voor iets dat
  Zustand out-of-the-box biedt (acties naast state, selectors).
- State buiten React-componenten lezen/updaten (bv. game-loop/simulatielogica
  in `lib/`) is met Context onhandig; met Zustand kan dat direct via de store.

**Waarom Zustand past:**
- Minimale boilerplate: 1 hook (`useGameStore`) met state + acties.
- Selectors (`useGameStore((s) => s.gang)`) voorkomen onnodige re-renders.
- `persist`-middleware maakt latere localStorage-persistentie triviaal
  zonder de store-structuur te hoeven aanpassen.

## Projectstructuur

```
app/                  Next.js App Router: routes, layout, globale CSS
components/           Herbruikbare UI-componenten
lib/store/            Zustand store(s) — lokale state management
types/                Kern-datamodellen (Hooligan, Gang, GameState)
```

### Kern-datamodellen (`types/`)

- `Hooligan` (`types/hooligan.ts`) — traits (achtergrond, middelen,
  haat-triggers), status (`available` / `unavailable` / `arrested` / `dead`),
  uitrusting.
- `Gang` (`types/gang.ts`) — roster, geld, beruchtheid, favoriete club.
- `GameState` (`types/game-state.ts`) — huidige week, divisie, politie-meter,
  gang.

Deze types zijn bewust minimaal gehouden (alleen wat de issue vraagt) zodat
vervolg-issues (gevecht-simulatie, recruitment, economie) hierop kunnen
bouwen zonder een breaking herstructurering.

## Development

```
npm install
npm run dev      # start lokale dev-server
npm run build    # productie-build
npm run lint     # ESLint
```
