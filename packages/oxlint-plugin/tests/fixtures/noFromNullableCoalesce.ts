// Fixture for `effect/noFromNullableCoalesce`. Bans a `?? null` / `?? undefined`
// the lifting constructor already absorbs — pass the source directly.
//
// Ported from v3: the rule matched `Option.fromNullable`, which Effect 4 split
// into `fromNullOr` (null only), `fromUndefinedOr` (undefined only) and
// `fromNullishOr` (both). Because it is a split rather than a rename, which
// sentinel is redundant now depends on the constructor — so the negatives below
// include the mismatched pairing, which is a real bug but not this rule's.
import * as Option from "effect/Option";

declare const maybe: string | null | undefined;

export const viaNull = Option.fromNullOr(maybe ?? null); // EXPECT effect/noFromNullableCoalesce
export const viaUndefined = Option.fromUndefinedOr(maybe ?? undefined); // EXPECT effect/noFromNullableCoalesce
export const viaNullish = Option.fromNullishOr(maybe ?? null); // EXPECT effect/noFromNullableCoalesce

// The v3 spelling, still reported so a leftover is not invisible. Effect 4 has no
// `Option.fromNullable`; fixtures are excluded from `tsconfig.json`, so the dead
// name can be written out to pin that the rule still sees it.
export const leftover = Option.fromNullable(maybe ?? undefined); // EXPECT effect/noFromNullableCoalesce

// Not redundant: `fromNullOr` treats only `null` as absent, so `?? undefined` in
// front of it changes the result to `Some(undefined)` rather than adding nothing.
export const mismatched = Option.fromNullOr(maybe ?? undefined);

// Not redundant: the coalesce supplies a real default, and the bare call is the
// shape the rule is asking for.
export const withDefault = Option.fromNullishOr(maybe ?? "fallback");
export const direct = Option.fromNullishOr(maybe);
