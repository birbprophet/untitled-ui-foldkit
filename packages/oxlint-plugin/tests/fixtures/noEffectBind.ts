// Fixture for `effect/noEffectBind`. Bans the `Effect.bind` do-notation member.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;

export const bound = Effect.Do.pipe(Effect.bind("value", () => source)); // EXPECT effect/noEffectBind

// `bindTo` is a different member, not a prefix match of `bind`.
export const named = source.pipe(Effect.bindTo("value"));
