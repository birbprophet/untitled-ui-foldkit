// Fixture for `effect/noNestedPipe`. Bans a `pipe(...)` passed as an argument to
// another `pipe(...)` — one flat pipeline reads as one sequence of steps.
import { pipe } from "effect/Function";

declare const increment: (value: number) => number;
declare const pipeable: { pipe: (step: (value: number) => number) => typeof pipeable };

export const nested = pipe(pipe(1, increment), increment); // EXPECT effect/noNestedPipe

// One flat pipeline. And a `.pipe(...).pipe(...)` chain, which is a chain rather
// than a nesting — `noUnnecessaryPipeChain` owns that shape, not this rule.
export const flat = pipe(1, increment, increment);
export const chained = pipeable.pipe(increment).pipe(increment);
