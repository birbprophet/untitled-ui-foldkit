// Fixture for `effect/noTernary`. Audited WORKS.
export const chosen = (flag: boolean): number => (flag ? 1 : 0); // EXPECT effect/noTernary

// Not a ternary: nullish coalescing, and a TS conditional TYPE. The rule must
// stay out of the type position — a conditional type is not control flow.
export const fallback = (given: string | null): string => given ?? "none";
export type Narrowed<A> = A extends string ? number : boolean;
