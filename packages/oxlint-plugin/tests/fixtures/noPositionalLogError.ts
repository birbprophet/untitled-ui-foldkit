// Fixture for `effect/noPositionalLogError`. Bans passing an error as a
// positional argument to `Effect.log*` — it lands as an opaque second message
// part. Annotate it, or pass a Cause.
//
// Audited OVER-FIRING — the rule rejects every second argument that is not a
// `Cause.*` call, including ordinary multi-part messages, so the negative below
// is reported too and this fixture FAILS until the check looks at the argument.
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";

declare const failure: Error;

export const positional = Effect.logError("save failed", failure); // EXPECT effect/noPositionalLogError

// A Cause is the supported way to pass a failure, and a second message part is
// not an error at all.
export const withCause = Effect.logError("save failed", Cause.fail(failure));
export const multiPart = Effect.logInfo("hello", "world");
