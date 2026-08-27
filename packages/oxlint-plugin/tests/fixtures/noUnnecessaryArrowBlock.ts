// Fixture for `effect/noUnnecessaryArrowBlock`. Bans `() => { return expr }`.
declare const compute: () => number;

export const wrapped = () => { // EXPECT effect/noUnnecessaryArrowBlock
  return compute();
};

// A concise body, a block whose single `return` has no argument, and a block
// with more than one statement — none of them collapse to `() => expr`.
export const concise = () => compute();
export const early = () => {
  return;
};
export const sequenced = () => {
  compute();
  return compute();
};
