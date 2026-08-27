// Fixture for `effect/noUnnecessaryPipe`. Bans `pipe(x)` with nothing to pipe.
import { pipe } from "effect/Function";

declare const value: number;
declare const bump: (n: number) => number;

export const bare = pipe(value); // EXPECT effect/noUnnecessaryPipe

// A pipe that actually pipes, and a one-argument call that is not `pipe`.
export const piped = pipe(value, bump);
export const applied = bump(value);
