// Fixture for `effect/noHandRolledTaggedUnion`. Bans a `_tag` discriminated
// union written as inline type literals instead of declared as a Schema.
export type Outcome = { _tag: "Ok"; value: number } | { _tag: "Err"; reason: string }; // EXPECT effect/noHandRolledTaggedUnion

// A union with no `_tag` discriminant, and a single tagged member — neither is a
// hand-rolled tagged union.
export type Extent = { width: number } | { height: number };
export type OnlyOk = { _tag: "Ok"; value: number } | number;
