// Fixture for `effect/noOptionAs`. Bans `Option.as` — discarding the value while
// keeping the shape hides what the Option was carrying.
import * as Option from "effect/Option";

declare const maybe: Option.Option<number>;

export const replaced = Option.as(maybe, "constant"); // EXPECT effect/noOptionAs

// The explicit forms: map the value, or match both cases.
export const mapped = Option.map(maybe, () => "constant");
export const matched = Option.match(maybe, { onNone: () => "none", onSome: () => "constant" });
