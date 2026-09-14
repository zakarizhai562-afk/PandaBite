# PandaBite — System Flow

PandaBite (package name `nutripal`) is a client-only React + Vite single-page app: a gamified nutrition-education platform for children built around food-group puzzles, daily nutrition logging, goal-based recommendations, a food-pairing quiz, and a Red Panda companion. There is **no backend** — all persistence is `localStorage`, and the app is deployed as a static SPA (Vercel).

This document maps the app end-to-end: bootstrapping, routing, state, data, the Prolog rules layer, each feature's gameplay loop, and the legacy Python prototype the puzzle game was ported from.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18, `react-router-dom` v7 (`BrowserRouter`) |
| Build | Vite 6 |
| Drag & drop | `@dnd-kit/core` |
| Rules engine | `tau-prolog` (Prolog interpreter running in-browser) |
| Persistence | `localStorage` only — no backend/API |
| Testing | Vitest + Testing Library + jsdom |
| Deploy | Vercel, static SPA (`vercel.json` rewrites everything to `index.html`) |
| Legacy prototype | Python + Pygame (`main.py`, `game/`) — not part of the running app |

---

## 2. Bootstrapping

```
index.html
  └─ loads src/main.jsx
       └─ <StrictMode>
            └─ <StarsProvider>              (global stars/points state)
                 └─ <PetStateProvider>      (derives growth stage from stars — currently unused)
                      └─ <App />
                           └─ <AppRouter /> (BrowserRouter + Routes)
```

`main.jsx` wraps rendering in a `try/catch` that dumps a raw error message into `#root` on failure — a defensive fallback, not a real error boundary. `App.jsx` itself is a one-line pass-through to `AppRouter`. Almost all logic lives inside route-level screen components, not in the bootstrap chain.

---

## 3. Routing (`src/core/router/AppRouter.jsx`)

| Path | Screen | Feature |
|---|---|---|
| `/` | `LoadingScreen` | loading |
| `/landing` | `LandingScreen` | landing |
| `/onboarding` | `OnboardingScreen` | onboarding |
| `/home` | `WorldMapScreen` | homeIslands |
| `/daily-log` | `DailyLogScreen` | dailyLog |
| `/daily-log/result` | `DailyResultScreen` | dailyLog |
| `/goals` | `GoalsScreen` | goals |
| `/goals/:goalId` | `GoalsScreen` (goal detail) | goals |
| `/goals/tips` | `GoalTipsScreen` | goals |
| `/puzzle` | `PuzzleScreen` | puzzleGame |
| `/combo` | `ComboAlertScreen` | comboAlert |
| `*` | redirect → `/` | fallback |

### First-run / onboarding gate

```
/  (LoadingScreen)
   waits 1200ms, checks localStorage["hasSeenOnboarding"]
     → falsy  → /onboarding  (first run)
     → truthy → /landing
/onboarding (OnboardingScreen)
   on completion: sets hasSeenOnboarding = true
     → if this was a first run  → /landing
     → if replaying (via "?" button on World Map) → back / /home
/landing → "Start" button → /home  (no further gating)
```

`WorldMapScreen` has a `?` button that re-enters `/onboarding` as a tutorial replay at any time.

---

## 4. Global State (`src/core/context`)

Only two contexts, both provided once at the app root:

- **`StarsContext`** (`StarsProvider` / `useStars`) — the single global points/currency value. Initialized from and persisted to `localStorage["nutripal_stars"]`. In practice, most code doesn't call `setStars` directly; it calls the `awardStars`/`spendPoints` services (which write `nutripal_stars` themselves) and then resyncs React state via a callback. **`localStorage` is the real source of truth; the context is a reactive mirror of it.**
- **`PetStateContext`** (`PetStateProvider` / `usePetState`) — derives `{ growthStage, growthLabel, stars }` from the star total. Provided at the root, but **`usePetState` has no consumers anywhere in the app** — an unfinished/orphaned feature. The panda-growth animation you actually see in-app is a separate, per-goal, session-scoped mechanism (see §7, `petGrowth`).

There is no backend and no API layer — everything client-side, everything through `localStorage`.

### localStorage keys

| Key | Purpose |
|---|---|
| `nutripal_stars` | global points total |
| `hasSeenOnboarding` | onboarding-complete flag |
| `nutripal_daily_history` | one `DailyLogEntry`-shaped record per calendar date (overwritten if you log twice in a day) |
| `nutripal_daily_log_star_awards` | dedupe map so a daily-log result never double-awards stars on re-render/back-nav |
| `nutripal_shown_combo_alerts` | trigger IDs of combo pairings already shown that day |

All reads/writes go through `src/core/utils/storage.js` (`getItem`/`setItem`/`removeItem`), a try/catch JSON wrapper that never throws.

---

## 5. Data & Services

### Shared core services (`src/core/services`)

- **`starAwardService.js` → `awardStars(amount, source, onUpdate?)`** — adds to `nutripal_stars`, invokes `onUpdate` to resync `StarsContext`. Explicitly **not idempotent** — callers must guard against double-invocation for the same event (hence the daily-log dedupe map).
- **`spendPointsService.js` → `spendPoints(amount, source)`** — returns `{success, remaining, message?}`. Backs the shared two-tier hint economy: `HINT_COST = { CLUE: 2, REVEAL: 5 }`, used by both `goals` and `puzzleGame`.

### Data files (`src/data/*.json`, imported directly via Vite)

- **`foodDatabase.json`** — `{ foods: [{ id, name:{my,en}, groups:[carbs|protein|vitamins], tier: Go|Slow|Whoa, image }] }` — used by `dailyLog` and `comboAlert`.
- **`comboAlertPairs.json`** — `{ pairs: [{ foodA, foodB, type: good|bad, reactions:{...bilingual text} }] }` — used by `comboAlert`.

### ⚠️ Three separate, non-interoperable food vocabularies

The app does **not** have one unified food catalog:

| Vocabulary | Groups | ID style | Used by |
|---|---|---|---|
| `src/data/foodDatabase.json` | carbs / protein / vitamins (+ Go/Slow/Whoa tier) | lowercase | `dailyLog`, `comboAlert` |
| `puzzleGame/data/foodData.js` | energy / body / protective | Title-Case names | `puzzleGame` only |
| `goals/models/goal.js` | free-form `matchingFoods` lists | snake_case | `goals` only |

Each feature is an island with its own food data — worth knowing before assuming any cross-feature food consistency.

---

## 6. Prolog Rules Layer (`src/core/prolog`)

There are no `.pl` files in `core/prolog` itself — it only holds the generic engine wrapper:

- **`prologEngine.js`** — dynamically imports `tau-prolog`, exposes `runPrologQuery(rulesSource, query)`: opens a session, consults the rules source, runs the query, maps the first answer's variable bindings to a plain JS object. Returns `null` on any failure (logged via `console.warn`) — **every caller must supply a JS fallback.**
- **`readline-sync-stub.js`** — a no-op stub aliased in `vite.config.js` so `tau-prolog`'s Node-only `readline-sync` dependency doesn't break the browser bundle.

The actual rule files live inside the two features that use them:

- **`dailyLog/services/dailyBalanceRules.pl`** — `covered_groups/2`, `whoa_count/2`, `missing_groups/2`, `is_balanced/1` over `food(Id, Groups, Tier)` facts.
- **`comboAlert/services/comboAlertRules.pl`** — `combo_type/3` (bidirectional) over `combo_pair(A,B,Type)` facts.

### Daily Balance query flow

```
DailyLogScreen.handleDone()
  → useDailyLog().calculateResult(foodIds)
    → dailyBalanceService.calculateDailyBalance(foodIds)
        1. validate foodIds against foodDatabase.json
        2. build Prolog facts on the fly: food('rice', ['carbs'], 'go'). ...
        3. concatenate facts + dailyBalanceRules.pl
        4. query: covered_groups([...], Groups), whoa_count([...], W),
                  (is_balanced([...]) -> IsBalanced = true ; IsBalanced = false).
        5. runPrologQuery(rulesSource, query)
             → success: build {coveredGroups, missingGroups, whoaCount,
                                tierCounts, score, starsEarned, isBalanced}
             → failure/null: calculateDailyBalanceJS() — a pure-JS
               reimplementation of the identical logic
```

Result is passed via router `state` to `DailyResultScreen`, which picks bilingual feedback text (`selectBalanceFeedback`, ~11 message keys) and awards stars once (`awardDailyLogStarsOnce`, deduped by entry ID).

### Combo Alert query flow

```
ComboGuessPopup.handleAnswer(childSaidYes)
  → comboAlertService.getComboType(foodA, foodB)
        1. build facts: combo_pair(a, b, type). ... + comboAlertRules.pl
        2. query: combo_type(a, b, Type).
        3. runPrologQuery(...) → success: use Type
                                → failure: JS .find() fallback over comboAlertPairs.json
  → getComboReaction() (pure JS) determines correct/incorrect feedback
  → correct guess → +1 star; trigger ID recorded in nutripal_shown_combo_alerts
```

**Bottom line on Prolog:** it's a narrow, optional reasoning layer for two lookups (meal-group coverage/balance, and good/bad food pairings). Both have a functionally identical JS fallback, so Prolog is a decorative/redundant layer rather than load-bearing. `goals` and `puzzleGame` never touch Prolog — their logic is 100% plain JS.

---

## 7. Feature Walkthroughs

### `loading` / `landing`
`LoadingScreen` is the app's `/` entry — a 1200ms splash that redirects based on the onboarding flag (§3). `LandingScreen` is a simple "Start" screen leading to `/home`.

### `onboarding`
5 fixed bilingual (Myanmar/English) slides explaining the Go/Slow/Whoa food-tier system, plus a closing "Get Started" slide. Purely informational — no data is collected from the user. Dot navigation, "Continue", and "Skip" (from slide 2) let the player move through; completion sets `hasSeenOnboarding` and routes onward (§3).

### `homeIslands` ("World Map")
The main hub at `/home`. `WorldMapScreen` renders a single background image (`world_art/world_map.png`) plus `WaterEffects`/`LeafLayer` decoration and four data-driven `Island` hotspots (`islandsConfig.js`) — invisible clickable regions over the shared art (no per-island cutout art exists yet):

| Island | Route |
|---|---|
| Daily Balance | `/daily-log` |
| Goal Bites | `/goals` |
| Food Rain | `/puzzle` |
| Yum or Yuck? | `/combo` |

Header has a back button (→ `/`) and a `?` button (→ `/onboarding`, tutorial replay).

> **Note:** an earlier, non-data-driven implementation (`HomeIslandsScreen` + `IslandHotspot`) still exists in the codebase and has its own tests, but is **not referenced by the router** — `WorldMapScreen` is what's live.

### `dailyLog` ("Daily Balance")
Drag food items (`@dnd-kit`) from a food box onto a `PlateDropTarget`. Each drop shows an immediate bilingual mascot reaction. "Done" runs the Prolog/JS balance calculation (§6), navigates to `/daily-log/result` with the result in router state, shows a `BalanceSummaryCard` + matching panda mood image + feedback text, and awards stars once. The entry is saved into `nutripal_daily_history` keyed by date (logging again the same day overwrites the earlier entry).

### `goals` ("Goal Bites")
3 fixed goals — `grow-taller`, `more-energy`, `clear-skin` — each with its own `matchingFoods`/`nonMatchingFoods` lists. Picking a goal (`/goals/:goalId`) builds a round of 4 correct + 2 decoy foods (shuffled) as draggable cards; dropping them on the panda (`PandaFeedTarget`) resolves each as correct/wrong. A star is awarded only for a correct, first-attempt, non-hinted drop. The round ends once every matching food has been resolved, after which "See Tips" routes to `/goals/tips`. Hints reuse the shared `spendPointsService` (Clue = text hint, Reveal = auto-resolve, no star).

### `puzzleGame` ("Food Rain")
A falling-food sorting game, and a deliberate **1:1 port of the Python/Pygame prototype** (§9). One food falls at a time (`useFallingFood`, real delta-time physics); the player drags it (`@dnd-kit`) into one of 3 baskets — Energy / Body-Building / Protective. Correct drop → +10 score, +1 star, food disappears, next spawns. Wrong drop or food reaching the bottom → lose a life (starts at 3) and the food resets to fall again, with a temporary hint highlighting the correct basket. 3 levels, increasing fall speed, 100 points to complete a level, 0 lives → Game Over. A one-time tutorial hint arrow appears on level 1 only. Hints cost stars (`HINT_COST.CLUE`/`REVEAL`, shared service). No Prolog involvement.

### `comboAlert` ("Yum or Yuck?")
A standalone quiz reachable via `/combo`: shows two random foods from `comboAlertPairs.json`, asks "would you eat these together?", resolves the true pairing type via Prolog/JS-fallback (§6), shows a bilingual explanation, and awards a star for a correct guess. "Continue" draws another random pair (avoiding immediate repeats); there's no fixed round count — the session ends only when the player taps "Got it!" on a reveal screen.

> **Note:** a hook (`useComboAlert.checkForComboAlert`) exists to trigger a combo check against the player's *actual logged meal* in `dailyLog`, but it is **not wired up anywhere** — currently only the standalone random-pair quiz is reachable in the running app.

### `petGrowth` (Red Panda companion)
`growthStageCalculator.js` maps total stars → 3 growth stages (Bud Tail <50, Fuller Tail 50–149, Full Tail ≥150), consumed by the unused `PetStateContext` (§4) — this global, cumulative growth concept is **not currently visible anywhere in the UI**.

What players actually see as "panda growth" is a separate, **session-local, per-goal** animation system living inside `goals/`: themed sprite-frame sets (`pandaTallFrames`, `pandaSkinFrames`, `pandaEnergyFrames`) driven by the current feeding round's outcome (idle/correct/wrong/complete). `PandaFeedTarget` picks a themed variant based on the active goal (`grow-taller` plays a small→tall growth sequence on completion, `clear-skin` glows, `more-energy` flexes). This resets every time the goal screen is re-entered — it is not persisted and not connected to the cumulative star total.

---

## 8. Theme System (`src/core/theme/theme.js`)

A small static design-token file — `colors`, `pandaColors`, `typography` — but it is **not wired through a ThemeProvider/context**. Most components hardcode matching hex values inline or rely on global CSS classes instead. There's no per-island or per-growth-stage theming mechanism; the closest thing is the ad-hoc goal-specific panda visual variants in `goals` (§7) and the tier-colored badges in `onboarding`.

---

## 9. Legacy Python Prototype (`main.py`, `game/`)

A full **Pygame** implementation of exactly the "Food Rain" puzzle mechanic — falling food, 3 baskets, drag-to-sort, lives/score/level state machine, tutorial hint, pause overlay. `puzzleGame`'s React code (`puzzleService.js`, `useFallingFood.js`, `PuzzleScreen.jsx`) explicitly cites this file/behavior as its source of truth in code comments (e.g. constants, state-machine transitions ported 1:1).

- `game/settings.py` — colors/layout/timing constants
- `game/game_state.py` — `GameState` class (lives/score/level, `add_score`, `lose_life`, `star_rating`) — mirrors `puzzleService.js`
- `game/food.py` — `FOOD_DATA` + spawn logic — mirrors `puzzleGame/data/foodData.js`
- `game/basket.py` — basket creation — mirrors `basketData.js`
- `game/panda.py` — sprite-frame mood state

**This is not part of the deployed app.** Nothing under `src/` imports it, no build step touches it, and `package.json` has no Python tooling. It's a standalone, runnable (`python main.py`, requires `pygame`) reference artifact kept in the repo as the historical origin of the Food Rain mechanics.

---

## 10. Build & Deploy

- **`vite.config.js`** — `@vitejs/plugin-react`; one alias (`readline-sync` → local stub, for `tau-prolog` browser compatibility); Vitest config colocated (`jsdom` environment, `globals: true`, `setupFiles: './src/test/setup.js'`).
- **`package.json` scripts** — `dev` (Vite dev server), `build` (→ `dist/`), `preview`, `test` (Vitest).
- **`vercel.json`** — single SPA rewrite (`/(.*)` → `/index.html`) so client-side routing works on any path; no serverless functions, confirming the no-backend, localStorage-only architecture.

---

## 11. Testing Coverage

Vitest + Testing Library, spread across `src/core/__tests__`, `src/test`, and a per-feature `__tests__` folder. What's actually covered signals what the team considered core business logic:

- **Shared points economy** (`pointsService.test.js`) — award/spend, non-idempotency, insufficient-funds, hint costs — the most thoroughly tested unit, since it underpins hints across multiple features.
- **Onboarding gate** (`landingAndLoading.test.jsx`) — the `/` → `/landing`/`/onboarding` redirect logic.
- **Per-feature service/state-machine logic**: `dailyBalanceService`, `comboAlertService`, `goalFeedingService`, `puzzleService` (state machine/scoring), plus lighter component tests (`GoalsScreen`, `WorldMapScreen`, `HomeIslandsScreen`, `ComboGuessPopup`, `PuzzleScreen`).
- Presentation-heavy screens (`GoalTipsScreen`, `ComboAlertScreen`, `DailyResultScreen`, onboarding screens) have **no dedicated tests**.

---

## 12. Known Gaps / Things to Be Aware Of

These aren't bugs to fix on sight, but they affect how you should read the "system flow" — several features look more connected than they actually are at runtime:

1. **`PetStateContext`/`usePetState`** (global, cumulative star-based growth stage) is provided at the root but has **zero consumers**. The panda growth visible in-app is the unrelated, session-local system inside `goals`.
2. **`useComboAlert.checkForComboAlert()`** (combo detection against a real logged meal) is never called — only the standalone random-pair `/combo` quiz is reachable.
3. **Three incompatible food-data vocabularies** across `dailyLog`/`comboAlert`, `puzzleGame`, and `goals` — there is no single unified food catalog.
4. **`HomeIslandsScreen`/`IslandHotspot`** is an orphaned earlier implementation of the world map, kept (with its own tests) but unrouted; `WorldMapScreen` is what's live.
5. **Two near-duplicate `dailyLogEntry` model factories** (`src/core/models` and `src/features/dailyLog/models`) — neither is actually used; `DailyLogScreen` builds the saved entry object inline.
6. **`ComboAlertScreen`'s session end** is only reachable via the "Got it!" button on a reveal screen — there's no natural "seen all pairs" end condition; the loop can continue indefinitely via "Continue".
