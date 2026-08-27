// Fixture for `effect/noNestedEffectCall`. Bans the "call tower" — one Effect
// pipeline combinator nested directly inside another instead of `.pipe(...)`.
import * as Effect from "effect/Effect";

declare const program: Effect.Effect<number>;
declare const double: (value: number) => number;
declare const store: (value: number) => Effect.Effect<void>;

export const tower = Effect.flatMap(Effect.map(program, double), store); // EXPECT effect/noNestedEffectCall

// A producer nested in a combinator that accepts an effect. `Effect.callback` is
// the v4 name for what the vendored producer list knew only as `Effect.async`, so
// this shape went unreported until the v4 name was added alongside it.
export const produced = Effect.andThen(program, Effect.callback<number>(() => {})); // EXPECT effect/noNestedEffectCall

// The same two steps composed through .pipe, and a single combinator with a
// plain callback — neither nests one combinator inside another.
export const piped = program.pipe(Effect.map(double), Effect.flatMap(store));
export const single = Effect.map(program, double);
