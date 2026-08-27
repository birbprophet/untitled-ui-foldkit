// Fixture for `effect/noNewError`. Bans constructing a native Error except as
// the direct argument to a defect constructor — expected failures are tagged.
import * as Effect from "effect/Effect";

export const raw = new Error("boom"); // EXPECT effect/noNewError
export const rawSubclass = new RangeError("out of range"); // EXPECT effect/noNewError

// A defect is exactly where a native Error is still the right value.
export const defect = Effect.die(new Error("unreachable"));
