// Fixture for `effect/noRedundantSchemaTagIdentifier`. Bans restating `_tag` in
// a `Schema.TaggedStruct` field list — the constructor already supplies it, and
// a second declaration can disagree with the first.
import * as Schema from "effect/Schema";

export const Redundant = Schema.TaggedStruct("Ok", {
  _tag: Schema.Literal("Ok"), // EXPECT effect/noRedundantSchemaTagIdentifier
  value: Schema.Number,
});

// The tag comes from the first argument, and the fields carry only real data.
export const Clean = Schema.TaggedStruct("Err", { reason: Schema.String });
