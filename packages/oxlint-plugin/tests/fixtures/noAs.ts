// Fixture for `effect/noAs`. Bans TypeScript `as` assertions in favour of
// `satisfies`, which checks the same shape without discarding the inferred type.
declare const payload: unknown;

type Row = { readonly id: string };

export const widened = payload as Row; // EXPECT effect/noAs
export const chained = (payload as { readonly rows: readonly Row[] }).rows; // EXPECT effect/noAs

// `as const` is a TSAsExpression too, so the rule reports it — which is why the
// house preset leaves this rule off. `satisfies` does not narrow literals.
export const keys = ["id", "name"] as const; // EXPECT effect/noAs

// Satisfied without an assertion, and the annotation form the rule asks for.
export const checked = { id: "r1" } satisfies Row;
export const annotated: Row = { id: "r2" };
