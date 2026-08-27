// Fixture for `effect/noGlobalErrorInFailure`. Bans a native `Error` as the
// value of an expected failure — the error channel carries tagged errors.
import * as Effect from "effect/Effect";

export const failed = Effect.fail(new Error("boom")); // EXPECT effect/noGlobalErrorInFailure
export const failedLazily = Effect.failSync(() => new RangeError("boom")); // EXPECT effect/noGlobalErrorInFailure

// A tagged error is the point of the rule, and a defect is allowed to be native.
class BoomError {
  readonly _tag = "BoomError";
}
export const tagged = Effect.fail(new BoomError());
export const died = Effect.die(new Error("a defect may be native"));
