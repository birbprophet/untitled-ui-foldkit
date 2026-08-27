// Fixture for `effect/noNewPromise`. Bans the Promise constructor and its static
// APIs — Effect owns concurrency, and promises only appear at the boundary.
import * as Effect from "effect/Effect";

declare const fetchValue: () => Promise<number>;

export const constructed = new Promise<number>((resolve) => resolve(1)); // EXPECT effect/noNewPromise
export const gathered = Promise.all([fetchValue()]); // EXPECT effect/noNewPromise

// The boundary combinator, which is what the rule points at. A `Promise<T>` in a
// type position is a description, not an API call.
export const lifted: Effect.Effect<number> = Effect.promise(fetchValue);
