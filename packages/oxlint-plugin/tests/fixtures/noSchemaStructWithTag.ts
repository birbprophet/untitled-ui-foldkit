// Fixture for `effect/noSchemaStructWithTag`. Bans a `Schema.Struct` whose
// `_tag` field is a `Schema.Literal` — that is what `Schema.TaggedStruct` is for.
import * as Schema from "effect/Schema";

export const user = Schema.Struct({ _tag: Schema.Literal("User"), name: Schema.String }); // EXPECT effect/noSchemaStructWithTag

// A struct with no `_tag`, and the tagged constructor the message asks for.
export const plain = Schema.Struct({ name: Schema.String });
export const tagged = Schema.TaggedStruct("User", { name: Schema.String });
