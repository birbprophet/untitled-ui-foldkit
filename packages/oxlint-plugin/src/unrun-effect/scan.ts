import * as HashSet from "effect/HashSet";

/**
 * A test case that is green because nothing ever ran it.
 *
 * `Effect.gen(...)` builds a DESCRIPTION of work. Handing one to a bare `it` gives
 * vitest an object it does not recognise as a promise and does not execute, so
 * every assertion inside the generator is unreachable and the case reports green
 * however broken the code under test is.
 *
 * Measured (packages/loader, 2026-08-03): `runner.test.ts` asserted that a forged
 * `RunFailed` is reported as a defect, under a bare `it`. Replacing the guard it
 * exercised with one that provably accepts the forgery left the suite at
 * `64 passed (64)`. Switching the case to `it.effect` and repeating the same
 * mutation failed it immediately. A second case, in `packages/storage`, had the
 * same shape.
 *
 * ⚠️ WHY THE RUNNERS ARE EXEMPT AND NOT MERELY TOLERATED. `it("…", () =>
 * Effect.runPromise(program))` hands vitest a real promise, which it awaits — the
 * case runs and its assertions count. That is a legitimate, if verbose, way to
 * write an Effect test, and flagging it would be a false positive on a case that
 * works. What distinguishes the bug is precisely that no runner appears: the
 * value crossing into vitest is inert.
 */

/**
 * `Effect.*` members that produce something vitest actually awaits or evaluates.
 *
 * ⚠️ NOT EVERY RUNNER, AND THE LINE WAS MEASURED RATHER THAN GUESSED. An earlier
 * version of this set also held `runFork`, `runForkWith` and `runCallback`, on
 * the reasoning that anything named `run*` ends a test. It does not. Measured
 * 2026-08-03, under this repo's Effect beta:
 *
 *   `Effect.runPromise(…)`   → thenable   — vitest awaits it, assertions run
 *   `Effect.runFork(…)`      → object     — NOT thenable; a Fiber
 *   `Effect.runCallback(…)`  → function   — NOT thenable; a cancellation handle
 *
 * A bare `it` returning a Fiber or a cancel function finishes before the work it
 * started, so its assertions are as unreachable as an un-run `Effect.gen` — which
 * is precisely this rule's subject. Exempting them would have been a false
 * negative in the middle of the rule's own remit.
 *
 * `runSync` and `runSyncExit` stay: they complete before returning, so whatever
 * the case asserted has already been asserted. The `*With` variants of the
 * promise and sync runners stay for the same reason as their plain counterparts —
 * they take services explicitly and still hand back a promise or a value.
 */
const RUNNERS = HashSet.make(
  "runPromise",
  "runPromiseExit",
  "runPromiseWith",
  "runSync",
  "runSyncExit",
  "runSyncWith",
);

/**
 * Test-declaring identifiers that execute what they are handed.
 *
 * Only the BARE forms. A member call — `it.effect`, `it.scoped`, `it.live`, or
 * the `suite.effect` an `it.layer` hands back — is the correct spelling and is
 * never reported; the rule only ever inspects a plain identifier callee.
 */
const BARE_TEST_CALLEES = HashSet.make("bench", "it", "test");

/** Whether a plain-identifier callee declares a test case. */
export const isBareTestCallee = (name: string): boolean => HashSet.has(BARE_TEST_CALLEES, name);

/**
 * Whether `Effect.<property>` leaves a description rather than running it.
 *
 * Everything that is not a runner is inert here, which is the conservative
 * direction: a new combinator added to Effect is reported rather than silently
 * exempted, and a false report is a comment away from resolution while a missed
 * one is a test that never runs.
 */
export const isInertEffectMember = (object: string, property: string): boolean =>
  object === "Effect" && !HashSet.has(RUNNERS, property);
