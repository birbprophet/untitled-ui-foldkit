// Fixture for `effect/noArrowLadder`. Bans a nested IIFE chain — an immediately
// invoked function whose body immediately invokes another one.
export const laddered = ((a: number) => ((b: number) => a + b)(2))(1); // EXPECT effect/noArrowLadder

// A single IIFE is not a ladder.
export const flat = ((a: number) => a + 1)(1);
