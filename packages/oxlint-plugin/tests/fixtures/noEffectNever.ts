// Fixture for `effect/noEffectNever`. Bans the `Effect.never` member.
import * as Effect from "effect/Effect";

export const forever = Effect.never; // EXPECT effect/noEffectNever

// A different member of the same namespace.
export const nothing = Effect.void;
