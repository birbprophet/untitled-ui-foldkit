// Fixture for `effect/noAsyncFunction`. Bans `async` functions and `await`.

export async function loadOne(): Promise<number> { // EXPECT effect/noAsyncFunction
  return 1;
}

export const loadTwo = async (): Promise<number> => { // EXPECT effect/noAsyncFunction
  const value = await loadOne(); // EXPECT effect/noAsyncFunction
  return value;
};

// Returning a promise without `async` is not what this rule is about.
export const loadThree = (): Promise<number> => Promise.resolve(3);
