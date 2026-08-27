# Vendored Effect rules

67 rules, vendored from [`oxlint-plugin-effect`](https://github.com/cevr/effect-oxlint) (MIT).
Synced against upstream **0.6.0** on 2026-08-06.

## Why they are here

Upstream shipped 66 rules in `0.2.3` and deleted 47 of them in `0.4.0`, on the
argument that oxlint should own unconditional syntax while Effect tsgo owns
type-aware correctness. That argument is defensible; we did not take it. The
deleted rules encode judgements about Effect code that nothing else in the lint
spine makes, and five of them fire on this codebase today:

| Rule                          | Hits | What it catches                                   |
| ----------------------------- | ---- | ------------------------------------------------- |
| `noPromiseControlFlowInTests` | 173  | Promise control flow where an Effect belongs      |
| `noStringSentinelConst`       | 23   | String sentinels instead of tagged literals       |
| `noReturnNullish`             | 13   | `null` returned where `Option.none()` belongs     |
| `noSchemaStruct`              | 6    | `Schema.Struct` where `Schema.Class` was intended |
| `noCatchAllToMapError`        | 1    | `catchAll` collapsed into a generic mapped error  |

A dependency that can delete 47 rules in a patch release is not a dependency for a
rule set meant to be load-bearing.

## What this is the union of

- **`0.2.3`** — 66 rules, the whole set before the deletion.
- **`0.6.0`** — 13 rules, eleven of them newer implementations of rules `0.2.3`
  also had (those win: they carry the later false-positive fixes), plus
  `no-test-lifecycle-hooks` from `0.5.0` and `no-as` from `0.6.0`.

Each file's header records which version it came from. Eleven of the thirteen are
byte-identical across `0.5.0`, `0.5.1` and `0.6.0`, so their headers still name
`0.5.0` — the version the implementation was copied from.

## The 0.5.0 → 0.6.0 sync (2026-08-06)

Upstream's whole delta over those three releases is two changes, both taken here:

- **`0.5.1` — `no-globals` exempts `.isTTY`.** `process.stdout`, `process.stderr`
  and `process.stdin` stay banned; reading `.isTTY` on one of them does not. It
  asks whether a terminal is attached, which is what a program consults before
  emitting colour, and Effect supplies no service that answers it. The header on
  `no-globals.ts` moves to `0.5.1`. No site in this repo reads `.isTTY`, so the
  change costs nothing today and stops a false positive later.
- **`0.6.0` — `no-as` is new**, and upstream put it in `recommended` at error. It
  is vendored, fixture-tested, and **left out of the house preset**; the argument
  is in `../presets.ts`, and the short form is that it reports every
  `TSAsExpression` including `as const`, for which `satisfies` is not a
  replacement.

Nothing else moved: `presets/recommended` gained `noAs` and the other twelve rules
are unchanged.

## What we own now

The rules, not the framework. They are written against
[`effect-oxlint`](https://github.com/mpsuesser/effect-oxlint), a separately
maintained rule-authoring SDK, which stays a dependency — vendoring something
somebody else keeps current buys nothing.

`@mpsuesser/oxlint-plugin-effect` also stays a dependency, registered under `mps/*`,
for the same reason.

## Conventions

- **Not formatted, not linted to house style.** They arrived in someone else's
  style, and reformatting 66 files would make every future diff against upstream
  unreadable — which is the one thing that still helps when a rule turns out to
  have a false positive. They are typechecked. `vite.config.ts` excludes this
  directory from `fmt` and `lint`.
- **A rule we rewrite ourselves moves out of this directory**, into the house
  plugin proper, and gets house style and its own behavioural test.
- **Presence is tested** in `tests/effect-rules.test.ts`: every rule in the
  directory reaches the plugin, and every rule in the plugin reaches a preset. A
  rule that stops being registered is the failure vendoring exists to prevent, and
  it would otherwise look exactly like a green build.

## Licence

MIT, per the upstream `package.json`. ⚠️ Upstream ships no `LICENSE` file — not in
the repository at either tag, and not in the published tarball. The declaration is
in `package.json` and the README's "License / MIT" section, and that is the whole
of it. Attribution is preserved in each file's header.

## The audit (2026-07-30)

Every one of the 69 files here was measured, not read: a positive fixture the
rule's own docstring says it should report, a negative fixture it should not, and
`oxlint` run with only that rule enabled. That was worth doing because a lint rule
that reports nothing looks exactly like a codebase with no violations — these
rules were enforced across the whole tree at `error` before anything checked they
work.

Roughly sixty behave exactly as documented, including the harder ones: `noGlobals`
fired on all 13 banned globals and stayed silent on all 5 shadowed or imported
negatives.

**Dead — report nothing at all:**

| Rule                      | Why                                                                      |
| ------------------------- | ------------------------------------------------------------------------ |
| `noManualEffectChannels`  | reads `typeParameters`; oxc exposes generic args as `typeArguments`      |
| `noMultipleEffectProvide` | `args.length < 3` guard returns before either documented form is reached |

**Over-fire — report far more than they document:**

| Rule                   | Why                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `noInstanceofSchema`   | reports every `instanceof`, not only Schema-derived classes                                                  |
| `noMatchEffectBranch`  | says "multi-step sequencing", fires on a single `Effect.map`                                                 |
| `noPositionalLogError` | flags any `Effect.log*` second argument that is not a `Cause.*` call, including ordinary multi-part messages |

**Dead branches inside working rules:**

| Rule                    | Unreachable case                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `noEffectTypeAlias`     | recursion via `typeParameters`, so nested `ReadonlyArray<Effect.Effect<…>>` is missed           |
| `noExtendsNativeError`  | registers `ClassDeclaration` only; `const X = class extends Error {}` is a separate visitor key |
| `noNestedEffectGen`     | the `Effect.fn` outer branch is unreachable — the depth counter only tracks `Effect.gen`        |
| `noNestedPipe`          | scans arguments only, so `.pipe(…).pipe(…)` is never reached                                    |
| `noMakeUnsafe`          | requires a bare identifier receiver, so `A.B.makeUnsafe()` is missed                            |
| `noEffectSucceedString` | checks `Literal`, so a template literal is missed                                               |

**Enforcing nothing, for a config reason rather than a code one:**

`noTestLifecycleHooks` has no filename guard, so it fires in `src/` — while the
root config turns it off for `**/tests/**` and `**/*.test.ts`. It is disabled in
exactly the files it targets and enabled only where test hooks never appear.

**Every kebab-case rule id in these docstrings is wrong.** `plugin.ts` registers
the `index.ts` namespace, so oxlint knows each rule by its **camelCase export
key**. Measured: `// oxlint-disable-next-line effect/no-schema-struct` does not
suppress; `effect/noSchemaStruct` does. The `name:` field each rule declares is
dead. (`noSleepInTests` is unaffected — it regex-matches its own opt-out comment.)

**Not measurable here:** `noStringSentinelConst` is excluded from the house preset,
and `noSpread`'s `JSXSpreadAttribute` branch has no `.tsx` file in this repo to
exercise it.

Each finding above is pinned by a fixture in `../../tests/fixtures/`, checked by
`../../tests/rule-behaviour.test.ts`. A fixture for a rule that is still broken
fails — deliberately, until it is fixed.

## What the v4 port changed (2026-08-01)

Several rules matched Effect **v3** names that do not exist in v4, confirmed at
runtime against the installed `effect@4.0.0-beta.102`: `Effect.catchAll`,
`Effect.async`, `Effect.orElse`, `Option.fromNullable`, `Runtime.runFork`. They
could not fire on any real code here. Retargeted, keeping the v3 spelling too so
a leftover call still reports.

Two did not survive as they were:

**`no-runtime-run-fork` — deleted.** `Runtime.runFork` is gone from v4, and there
is no honest replacement: `Effect.runFork` is the _sanctioned_ way to start a
program, so banning it would report every entrypoint, and the genuine hazard —
running an effect inside `Effect.gen` — is already caught precisely by
`no-run-in-effect-gen`. A rule that cannot fire enforces nothing.

**`no-effect-or-else-ladder` → `no-effect-in-orelse-succeed`.** Upstream wrote it
against v3's `Effect.orElse` to ban fallback ladders. v4 has only
`orElseSucceed`, whose thunk produces a plain success value — so returning an
Effect from it does not run that Effect, it becomes the value, and the type
widens to `Effect<Effect<…>>` while the fallback silently never executes. That is
a sharper bug than a ladder, and the old name would have misdescribed it.

Both changes move the count to 66 and are asserted by
`../../tests/effect-rules.test.ts`.
