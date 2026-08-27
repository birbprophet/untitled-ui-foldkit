// Fixture for `effect/noMatchEffectBranch`. Bans multi-step Effect sequencing
// inside a Match branch — Match selects the value, one pipeline runs outside.
//
// Audited OVER-FIRING — any single `Effect.*` sequencing call in a branch is
// reported, so the one-step negative below is reported too and this fixture
// FAILS until the rule requires the multi-step shape its doc describes.
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";

declare const load: (id: string) => Effect.Effect<number>;
declare const save: (value: number) => Effect.Effect<void>;
declare const double: (value: number) => number;

export const sequenced = Match.type<string>().pipe(
  Match.when("load", (id) => Effect.flatMap(load(id), save)), // EXPECT effect/noMatchEffectBranch
);

// One step, not a sequence: the branch produces a single Effect and the caller
// still owns the pipeline.
export const oneStep = Match.type<string>().pipe(
  Match.when("load", (id) => Effect.map(load(id), double)),
);
