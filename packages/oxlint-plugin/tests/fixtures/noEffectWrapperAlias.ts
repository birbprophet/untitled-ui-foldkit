// Fixture for `effect/noEffectWrapperAlias`. Bans binding a name straight to
// `Effect.fn(...)`, or to a pipe whose head is `Effect.fn(...)`.
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";

declare const handler: (n: number) => Effect.Effect<number>;

export const run = Effect.fn(handler); // EXPECT effect/noEffectWrapperAlias
export const piped = pipe(Effect.fn(handler)); // EXPECT effect/noEffectWrapperAlias

// A real domain function that builds its own pipeline.
export const doubled = (n: number) => Effect.succeed(n * 2);
