// Fixture for `effect/noUnnecessaryPipeChain`. Bans `x.pipe(f).pipe(g)`.
import * as Effect from "effect/Effect";

declare const source: Effect.Effect<number>;
declare const bump: (self: Effect.Effect<number>) => Effect.Effect<number>;

export const chained = source.pipe(bump).pipe(bump); // EXPECT effect/noUnnecessaryPipeChain

// The merged form the message asks for.
export const merged = source.pipe(bump, bump);
