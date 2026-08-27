/**
 * The vendored set, as rule maps.
 *
 * Generated from the plugin's own rule list rather than hand-listed, so a rule
 * added to the directory cannot be silently left unenforced — which is exactly how
 * `copy-lint` and `design-lint` ended up wired to a directory that does not exist.
 *
 * Severity is the caller's decision, not this file's. `warn` is what the ratchet
 * uses while the backlog is being cleared; `error` is where each area lands once
 * it is clean.
 */
import * as Arr from "effect/Array";

import plugin from "./plugin.ts";

export type Severity = "off" | "warn" | "error";

/**
 * Rules vendored and available, but not enabled — each with the reason.
 *
 * `everything()` turns them on. They are absent from `houseDefault()` because a
 * rule that its own author retired, or that cannot be satisfied by any honest
 * edit, buys noise rather than correctness.
 *
 * **`noIfStatement`** — bans `if`. The argument is good where it applies:
 * branching on a value usually re-derives what the type already encodes, and a
 * hand-rolled chain loses exhaustiveness where `Match.exhaustive` would fail to
 * compile. But that argument is about branching on a TAGGED TYPE, not about `if`
 * as syntax — `if (parts.length === 0) return refusal` re-derives nothing. Its
 * own docstring says "Very opinionated — recommended for strict functional
 * presets only", and cevr dropped it from `recommended` in 0.4.0; it is absent
 * from `@mpsuesser`'s 57 and from Effect tsgo's ~90. The case it gropes at is
 * already caught precisely by `mps/prefer-option-over-null`,
 * `mps/prefer-effect-is`, `mps/avoid-direct-tag-checks`, `mps/prefer-arr-match`
 * and `mps/no-length-comparison`, which fire 142 times here and stay on.
 *
 * ⚠️ `noTernary` is NOT here. Same family, but its author kept it in 0.5.0's
 * `recommended`, and the nesting complaint — `a ? b : c ? d : e` really is worse
 * than `Match` — is sound. It is enforced.
 *
 * **`noStringSentinelConst`** — bans `const x = "literal"`. A bare sentinel is
 * unverifiable: `const PENDING = "pending"` invites `status === "pendign"`, and a
 * tagged union makes that a compile error. But the rule does not detect
 * sentinels; it matches every string-literal const. `HEAD_KEY = "revision/HEAD"`
 * is an object key, `KEY_SEPARATOR = "\u001F"` is a byte, `LIKE_ESCAPE` is an
 * escape character. Worse, it cannot be satisfied: the matcher reads the AST
 * literal regardless of type annotation, so the only compliance is to compute the
 * string or bury it in an object — which makes it less greppable, not safer. Its
 * own docstring: "Very aggressive — should probably be off by default".
 *
 * **`noManualEffectChannels`** — works correctly (fixture-pinned), but its policy
 * is wrong for this codebase. It bans naming an Effect's error channel, telling
 * you to let the return type infer. This engine does the opposite deliberately:
 * `parseXlsx` says it fails with `ParseRefusal`, `storeCapture` says it fails with
 * `IntegrityViolation | StoreUnavailable | UnaddressableReference`. That union is
 * documentation of what can go wrong, and it is the guard that makes a NEW failure
 * mode a compile error at every call site instead of a silent widening.
 *
 * The rule was dead until it was repaired here, so its cost was never visible.
 * Repaired, it named 105 sites — and the first ones it reached were the channel
 * added the same week so an R2 outage could not be reported as a missing capture.
 * A reproducibility engine that hides what can fail is worse than one with a
 * slightly longer signature. The rule stays correct and available; it is not
 * house policy.
 *
 * **`noAs`** — cevr added it in 0.6.0 and put it in `recommended` at error. The
 * argument behind it holds: `as T` tells the checker to stop checking, and
 * `satisfies T` asserts the same shape while keeping the inferred type, so a
 * later edit that breaks the shape still fails to compile.
 *
 * The rule reports every `TSAsExpression`, and `as const` is one. Measured on
 * 2026-08-06 it names 132 sites here, 72 of them `as const` — for which
 * `satisfies` is not a replacement: `as const` narrows literals and freezes the
 * type, `satisfies` checks against a type and narrows nothing. Those 72 have no
 * honest edit, and `@rikalabs/no-redundant-const-assertion` already removes the
 * ones that buy nothing. The remaining 60 are worth draining, but at error across
 * the tree the rule stops every merge until all 132 are answered, and 72 of the
 * answers would be a disable comment.
 *
 * It is vendored, tested and available. Enabling it is a separate decision, and
 * the honest form of it is `noAs` scoped to the `as T` sites once upstream splits
 * `as const` out or the 60 are drained by hand.
 *
 * **`noArrowLadder`, `noReturnInArrow`, `noSpread`, `noSwitchStatement`** — these
 * remain enforced. They are in the same strict family but are satisfiable without
 * harm, so they are drained rather than excused.
 */
const NOT_ENABLED = new Set([
  "noAs",
  "noIfStatement",
  "noManualEffectChannels",
  "noStringSentinelConst",
]);

const mapOf = (names: readonly string[], severity: Severity): Record<string, Severity> =>
  Object.fromEntries(names.map((name) => [`effect/${name}`, severity]));

/** Every vendored rule, including the style-only family. */
export const everything = (severity: Severity): Record<string, Severity> =>
  mapOf(Object.keys(plugin.rules), severity);

/** Everything except the style-only family. This is what the repo enables. */
export const houseDefault = (severity: Severity): Record<string, Severity> =>
  mapOf(
    Object.keys(plugin.rules).filter((name) => !NOT_ENABLED.has(name)),
    severity,
  );

/** Rule names, so a test can assert the set is complete and the split is real. */
export const ruleNames = (): readonly string[] => Object.keys(plugin.rules);
export const notEnabledNames = (): readonly string[] => Arr.fromIterable(NOT_ENABLED);
