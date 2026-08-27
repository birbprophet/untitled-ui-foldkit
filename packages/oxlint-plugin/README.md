# oxlint-plugin

The Siglata house Oxlint plugin. Two rules under the `siglata/` namespace,
scoped by the root `vite.config.ts` to product code under `apps/`:

- **`siglata/copy-lint`** — forbids internal mechanism vocabulary (Enrolment,
  artifact, workerd, BigDecimal, `Effect`), retired customer vocabulary
  (`Program Version`, worker, Workforce), borrowed institutional status
  (certified, notarized, _fé pública_, audited), and stale worker-noun
  substitution tokens in customer-facing strings. Ported from the hard-error
  tiers of `docs/06-writing-style.md` §8.1–§8.2. The catalogue itself is
  validated separately (the calibration test); this rule catches strings that
  bypass the i18n catalogue and hardcode copy in TSX.
- **`siglata/design-lint`** — forbids raw color and raw px, `box-shadow`, and
  `margin`, and flags re-enabled wrapping, in CSS-in-JS strings. Every value is
  a token reference (`packages/tokens`); the banned properties are law
  (`docs/05-design-system/tokens.md` §7).

The warning tier (`docs/06` §8.3) is deliberately not encoded: the spec requires
it be calibrated against accepted copy before it may gate.

## The refusal scope

`scanCustomerCopy(text, "refusal")` adds the Refusal register
(`docs/06-writing-style/lint-reference.md` §4 and §4.1), every check a hard
error: no first person, no engine subject, no apology, no wrongness verdict on
the refused value, no relative date, no bullets or parentheses
(`REFUSAL_FORMATTING_RE`), plus four structural validators — the rule named in
slot one, a withheld-state clause present, the outcome-changing clause last, and
one to three sentences.

Interpolation values are masked before any pattern runs (§2.2): `{fileName}`
becomes a same-length run of `z`, so a filename cannot fail for the word it
contains, cannot invent a sentence boundary, and every reported index still
points into the original string. `{{stale_token}}` is deliberately left visible.

## Layout

`src/copy-lint` and `src/design-lint` each split into `patterns.ts` (the ported
regexes), `scan.ts` (a pure text→violations function), and `rule.ts` (the thin
Oxlint AST rule). The scan functions are the tested surface — `tests/` proves
ruled copy and token references pass while stale copy and raw values fail — and
are re-exported (`oxlint-plugin/copy`, `oxlint-plugin/design`) for the i18n
catalogue's calibration test.
