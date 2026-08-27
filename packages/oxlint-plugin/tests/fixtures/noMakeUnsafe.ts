// Fixture for `effect/noMakeUnsafe`. Bans `.makeUnsafe(...)` — construction that
// skips validation instead of returning an Effect or an Option.
//
// The qualified-receiver case is audited BROKEN: the rule requires a bare
// identifier before `.makeUnsafe`, so `Domain.Slug.makeUnsafe(...)` is missed.
// It is annotated anyway, so this fixture FAILS until the receiver check is
// widened — a namespaced import is the normal way to reach a constructor here.
declare const Slug: { makeUnsafe: (raw: string) => string; make: (raw: string) => string };
declare const Domain: { Slug: { makeUnsafe: (raw: string) => string } };

export const bare = Slug.makeUnsafe("a b"); // EXPECT effect/noMakeUnsafe
export const qualified = Domain.Slug.makeUnsafe("a b"); // EXPECT effect/noMakeUnsafe

// The validating constructor, which is the whole point of the rule.
export const safe = Slug.make("a-b");
