// Fixture for `effect/noSchemaUnionOfLiterals`. Bans a `Schema.Union` whose
// members are all `Schema.Literal` calls — collapse to `Schema.Literals(["a", "b"])`.
//
// Ported from v3, which spelled both halves differently: `Schema.Union` took its
// members variadically where Effect 4 takes a single array, and the collapsed
// form was `Schema.Literal("a", "b")` where v4's `Schema.Literal` takes one
// literal and `Schema.Literals` takes the array. The variadic shape stays matched
// for a tree mid-migration, pinned by `leftover`; fixtures are excluded from
// `tsconfig.json`, so that dead call shape can still be written out here.
import * as Schema from "effect/Schema";

export const kind = Schema.Union([Schema.Literal("a"), Schema.Literal("b")]); // EXPECT effect/noSchemaUnionOfLiterals

export const leftover = Schema.Union(Schema.Literal("a"), Schema.Literal("b")); // EXPECT effect/noSchemaUnionOfLiterals

// A union with a non-literal member has nothing to collapse.
export const mixed = Schema.Union([Schema.Literal("a"), Schema.String]);

// Already collapsed — the shape the rule is asking for.
export const collapsed = Schema.Literals(["a", "b"]);
