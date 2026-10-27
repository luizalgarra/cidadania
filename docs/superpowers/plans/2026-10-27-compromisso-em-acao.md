# Compromisso em Ação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use test-driven development for every behavior and verification-before-completion before publishing. The Sites workflow owns the final Git commit and push.

**Goal:** Build and privately publish a mobile-first civic reflection app that helps one person choose one commitment from the supplied speech and create a concrete 30-day action plan.

**Architecture:** A dependency-free static site. Pure JavaScript modules hold the commitment catalogue, shortlist scoring and plan generation; a small controller renders the sequential experience and persists only the user's local state in `localStorage`. A build script copies audited source files into `dist/` for Sites publication.

**Tech Stack:** Semantic HTML, CSS, ECMAScript modules, Node.js built-in test runner, browser `localStorage`, Sites static hosting.

## Global Constraints

- Portuguese (Brazil) interface, individual mobile-first use, usable on desktop.
- No account, analytics, advertising trackers, remote fonts or server-side storage.
- Never infer voting intention, party affiliation, personality or ideology.
- Preserve a neutral distinction between citizen action and state responsibility.
- The algorithm suggests up to three finalists; the human explicitly chooses one.
- Every Likert question offers five named levels plus “Não sei”.
- Touch targets are at least 48px; visible keyboard focus and reduced-motion support are required.
- Visual signature: a continuous citizen line and a dashed public-responsibility line meeting at the next-action marker.
- Static deployment directory is `dist/` and Sites project ID stays in `.openai/hosting.json`.

---

### Task 1: Commitment catalogue and decision engine

**Files:**
- Create: `package.json`
- Create: `src/commitments.js`
- Create: `src/logic.js`
- Create: `tests/logic.test.js`
- Create: `tests/content.test.js`

**Interfaces:**
- `THEMES`, `COMMITMENTS`, `ROUTES` exported by `src/commitments.js`.
- `getThemeCommitments(themeIds)`, `selectCandidates(reactions, commitments, limit)`, `rankCommitments(ratings, commitments)`, `explainRanking(rating)`, and `buildPlan(input, commitment, route)` exported by `src/logic.js`.

- [ ] **Step 1: Write failing engine tests**

```js
test('ranks high meaning and readiness ahead of partial interest', () => {
  const ratings = {
    a: { interest: 5, relevance: 5, efficacy: 5, willingness: 5 },
    b: { interest: 5, relevance: 5, efficacy: 1, willingness: 1 }
  };
  assert.deepEqual(rankCommitments(ratings, [{ id: 'a' }, { id: 'b' }]).map(x => x.id), ['a', 'b']);
});
```

- [ ] **Step 2: Run `npm test` and verify failure because modules do not exist**
- [ ] **Step 3: Implement the minimal scoring, candidate selection, explanations and plan generation**
- [ ] **Step 4: Add catalogue contract tests for unique IDs, valid themes, four routes and complete responsibility metadata**
- [ ] **Step 5: Run `npm test` and verify all Task 1 tests pass**

### Task 2: Accessible sequential interface

**Files:**
- Create: `src/index.html`
- Create: `src/styles.css`
- Create: `src/app.js`
- Create: `src/app-state.js`
- Create: `tests/app-state.test.js`

**Interfaces:**
- `createInitialState()`, `getNextStep(state)`, `canContinue(state)` and `sanitizeRestoredState(value)` exported from `src/app-state.js` and consumed by `src/app.js`.
- UI steps: welcome → themes → reactions → Likert ratings → finalists → reflection → route → plan → saved plan.

- [ ] **Step 1: Write failing state-machine tests**

```js
test('does not leave theme selection without one selected theme', () => {
  const state = { ...createInitialState(), step: 'themes', selectedThemes: [] };
  assert.equal(canContinue(state), false);
});
```

- [ ] **Step 2: Run `npm test` and verify expected missing-module failure**
- [ ] **Step 3: Implement the minimal state module to pass**
- [ ] **Step 4: Build semantic screens with native buttons, radios, fieldsets, legends, progress text, error summaries and back navigation**
- [ ] **Step 5: Persist and restore locally; allow reset, print/save as PDF and a seven-day review checkbox**
- [ ] **Step 6: Run `npm test` and verify all tests pass**

### Task 3: Visual system, build and publication

**Files:**
- Create: `scripts/build.mjs`
- Create: `README.md`
- Create: `tests/build.test.js`
- Modify: `package.json`
- Generate: `dist/index.html`, `dist/styles.css`, `dist/app.js`, `dist/app-state.js`, `dist/logic.js`, `dist/commitments.js`

**Interfaces:**
- `npm run build` recreates `dist/` solely from the source manifest and fails on a missing expected file.
- The published app requires no network request after its own static assets load.

- [ ] **Step 1: Write a failing build-manifest test that exercises `buildSite()` against a temporary directory**
- [ ] **Step 2: Run the focused test and verify failure because `scripts/build.mjs` is absent**
- [ ] **Step 3: Implement the minimal deterministic build and render the dual responsibility-line visual system**
- [ ] **Step 4: Run `npm test` and `npm run build`**
- [ ] **Step 5: Serve `dist/`, verify HTTP assets and run a headless browser smoke test when local browser infrastructure permits**
- [ ] **Step 6: Package the exact source state with the Sites helper, push it, save the version and deploy privately**

## Verification Checklist

- [ ] All automated tests pass with zero failures.
- [ ] Build exits successfully and `dist/index.html` exists.
- [ ] A user can choose themes, rate candidates, confirm one commitment and produce a plan.
- [ ] Refresh restores local progress; reset removes it.
- [ ] Keyboard focus is visible, radio groups are labelled and 320px layout has no horizontal overflow.
- [ ] No external font, analytics or data-submission request exists.
- [ ] Production deployment status is `succeeded` and its URL is opened for the user.
