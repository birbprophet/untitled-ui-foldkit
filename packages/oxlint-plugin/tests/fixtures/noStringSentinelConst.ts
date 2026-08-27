// Fixture for `effect/noStringSentinelConst`. Bans `const x = "literal"`.
// Excluded from the house preset, but the harness enables it on its own.
export const status = "loaded"; // EXPECT effect/noStringSentinelConst

// Not a string literal bound by `const`: a number, and a mutable binding.
export const count = 1;
export let mutable = "loaded";
