// Fixture for `effect/noOptionBooleanNormalization`. Bans collapsing an Option
// into a boolean with `onSome: (v) => v === true, onNone: () => false` — the
// absent case and the false case are different facts, and merging them at the
// call site hides that the schema never decided which one it means.
import * as Option from "effect/Option";

declare const maybe: Option.Option<boolean>;

export const flattened = Option.match(maybe, { onNone: () => false, onSome: (v) => v === true }); // EXPECT effect/noOptionBooleanNormalization

// Both cases still carry their own answer.
export const kept = Option.match(maybe, { onNone: () => "unknown", onSome: (v) => String(v) });
