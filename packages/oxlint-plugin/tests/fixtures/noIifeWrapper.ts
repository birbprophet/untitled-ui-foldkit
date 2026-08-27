// Fixture for `effect/noIifeWrapper`. Bans immediately-invoked function
// expressions — name the function, or flatten it into the pipeline.
export const computed = (() => 1 + 1)(); // EXPECT effect/noIifeWrapper

// A named binding called normally is exactly what the rule asks for.
const add = (left: number, right: number): number => left + right;
export const sum = add(1, 1);
