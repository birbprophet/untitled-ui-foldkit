// Fixture for `effect/noSpread`. Bans spread syntax in arrays, calls, and objects.
declare const values: ReadonlyArray<number>;
declare const record: { readonly a: number };
declare const sum: (...parts: ReadonlyArray<number>) => number;

export const copied = [...values]; // EXPECT effect/noSpread
export const called = sum(...values); // EXPECT effect/noSpread
export const widened = { ...record, b: 2 }; // EXPECT effect/noSpread

// Rest parameters are a RestElement, not a SpreadElement.
export const total = (first: number, ...rest: ReadonlyArray<number>) => first + rest.length;
