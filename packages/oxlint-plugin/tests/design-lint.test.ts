import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { assertFalse, assertTrue, deepStrictEqual } from "@effect/vitest/utils";
import { scanStyleValue } from "../src/design-lint/scan.ts";

const idsFor = (text: string): string[] =>
  scanStyleValue(text).map((violation) => violation.ruleId);

describe("design-lint", () => {
  it.effect("token references pass", () =>
    Effect.sync(() => {
      deepStrictEqual(idsFor("color: var(--color-recusa); padding: var(--space-20);"), []);
      deepStrictEqual(idsFor("gap: var(--space-13); border-radius: var(--radius-2);"), []);
    }),
  );

  it.effect("raw color and raw px fail", () =>
    Effect.sync(() => {
      assertTrue(idsFor("color: #c33a11;").includes("raw-color"));
      assertTrue(idsFor("padding: 20px;").includes("raw-space"));
    }),
  );

  it.effect("retired inks get their own verdict", () =>
    Effect.sync(() => {
      assertTrue(idsFor("color: #087D78;").includes("retired-ink"));
      assertFalse(idsFor("color: #087D78;").includes("raw-color"));
    }),
  );

  it.effect("box-shadow and margin are forbidden outright", () =>
    Effect.sync(() => {
      assertTrue(idsFor("box-shadow: 0 1px 2px black;").includes("box-shadow"));
      assertTrue(idsFor("boxShadow: none").includes("box-shadow"));
      assertTrue(idsFor("margin: 0;").includes("margin"));
      assertTrue(idsFor("marginTop: 8").includes("margin"));
    }),
  );

  it.effect("padding and gap are not flagged as margin", () =>
    Effect.sync(() => {
      assertFalse(idsFor("padding: var(--space-9);").includes("margin"));
    }),
  );

  it.effect("re-enabling wrap on a value fails", () =>
    Effect.sync(() => {
      assertTrue(idsFor("white-space: normal;").includes("numbers-never-wrap"));
      assertTrue(idsFor("word-break: break-all;").includes("numbers-never-wrap"));
    }),
  );
});
