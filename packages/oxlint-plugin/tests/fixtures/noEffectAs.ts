// Fixture for `effect/noEffectAs`. Bans the `Effect.as` member.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const replaced = source.pipe(Effect.as("done")); // EXPECT effect/noEffectAs

// A different member that merely shares the prefix.
export const discarded = source.pipe(Effect.asVoid);
