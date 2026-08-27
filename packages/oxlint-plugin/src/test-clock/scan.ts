import * as HashSet from "effect/HashSet";
import * as Match from "effect/Match";

/**
 * Which test runners install a TestClock, and which clock reads it freezes.
 *
 * Measured rather than assumed (packages/sdk, 2026-07-30): under `it.effect`,
 * two successive `Clock.currentTimeMillis` reads differ by exactly 0, so any
 * assertion of the form `expect(elapsed).toBeLessThan(budget)` is a tautology and
 * passes no matter how slow the code under test is. Under `it.live` the same pair
 * differs by real milliseconds.
 *
 * `Date.now()` is deliberately NOT listed. It was measured in the same run and is
 * NOT intercepted — TestClock replaces Effect's `Clock` service, not the global —
 * so flagging it would be a false positive on every test that stamps an id.
 */

/** Runner properties that install a TestContext, and with it a TestClock. */
const FROZEN_RUNNERS = HashSet.make("effect", "scoped");

/** The `Clock` reads a TestClock freezes. */
const FROZEN_READS = HashSet.make("currentTimeMillis", "currentTimeNanos");

/**
 * Whether `property` names a test declared on a frozen clock.
 *
 * The object is not checked against a name list: `it.layer(...)` hands back a
 * scoped runner the caller may bind to any identifier — `suite` by convention
 * here — and a rule that only knew about `it` would miss every layered suite,
 * which is where the slow tests live. The live runners (`live`, `scopedLive`)
 * simply are not in this set, so they need no separate predicate.
 */
export const isFrozenRunner = (property: string): boolean => HashSet.has(FROZEN_RUNNERS, property);

/** Whether `object.property` reads the clock that a TestClock freezes. */
export const isFrozenClockRead = (object: string, property: string): boolean =>
  object === "Clock" && HashSet.has(FROZEN_READS, property);

/** The live runner to suggest in place of `property`. */
export const liveCounterpart = (property: string): string =>
  Match.value(property).pipe(
    Match.when("scoped", () => "scopedLive"),
    Match.orElse(() => "live"),
  );
