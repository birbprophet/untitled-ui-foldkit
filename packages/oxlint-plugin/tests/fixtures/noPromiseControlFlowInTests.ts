// Fixture for `effect/noPromiseControlFlowInTests`. Bans async functions,
// `await`, Promise chains and statics, `new Promise`, and `try/finally` in files
// the rule counts as tests — anything under a `tests/` directory, which this is.
import * as Effect from "effect/Effect";

declare const work: () => Promise<number>;
declare const pending: Promise<number>;
declare const source: Effect.Effect<number>;
declare const close: () => void;

export const awaited = async () => { // EXPECT effect/noPromiseControlFlowInTests
  return await work(); // EXPECT effect/noPromiseControlFlowInTests
};

export const chained = pending.then((value) => value + 1); // EXPECT effect/noPromiseControlFlowInTests
// The same chain on a call result. The rule reads the receiver with
// `AST.memberNames`, which resolves bare identifiers only, so the commoner of
// the two shapes goes unreported — this line is expected to FAIL until fixed.
export const chainedCall = work().then((value) => value + 1); // EXPECT effect/noPromiseControlFlowInTests
export const gathered = Promise.all([work()]); // EXPECT effect/noPromiseControlFlowInTests
export const constructed = new Promise<number>((resolve) => resolve(1)); // EXPECT effect/noPromiseControlFlowInTests

export const cleaned = () => {
  try { // EXPECT effect/noPromiseControlFlowInTests
    return 1;
  } finally {
    close();
  }
};

// The same control flow kept in Effect, and a try/catch with no finalizer.
export const yielded = Effect.gen(function* () {
  return yield* source;
});
export const guarded = () => {
  try {
    return 1;
  } catch {
    return 0;
  }
};
