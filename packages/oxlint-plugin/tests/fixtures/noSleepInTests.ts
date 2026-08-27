// Fixture for `effect/noSleepInTests`. Bans `Effect.sleep`/`Bun.sleep` in files
// the rule counts as tests — `*.test.ts`, or anything under a `tests/` directory,
// which is what this fixture path is.
import * as Effect from "effect/Effect";

export const waited = Effect.sleep("10 millis"); // EXPECT effect/noSleepInTests

// effect/no-sleep-in-tests: allow the timeout path is the thing under test
export const allowed = Effect.sleep("10 millis");

// A delay operator is not a fixed sleep the rule recognises.
export const delayed = Effect.delay(Effect.void, "10 millis");
