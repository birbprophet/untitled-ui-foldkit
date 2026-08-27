// Fixture for `effect/noSchemaStruct`. Bans every `Schema.Struct(...)` call.
import * as Schema from "effect/Schema";

export const point = Schema.Struct({ x: Schema.Number, y: Schema.Number }); // EXPECT effect/noSchemaStruct

// Neighbouring constructors that are not `Struct` itself.
export const tagged = Schema.TaggedStruct("Point", { x: Schema.Number });
export const listed = Schema.Array(Schema.Number);
