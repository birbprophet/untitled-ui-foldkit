/* oxlint-disable mps/avoid-native-object-helpers, mps/casting-awareness, mps/imperative-loops, typescript/no-confusing-void-expression, typescript/no-unsafe-type-assertion -- This adapter keeps migrated assertions on the Effect test runtime while preserving the small matcher vocabulary used by the upstream parity tests. */
import {
  assertFalse,
  assertInclude,
  assertMatch,
  assertTrue,
  assertUndefined,
  deepStrictEqual,
  strictEqual,
} from "@effect/vitest/utils";

interface Matchable {
  readonly length: number;
}

const partialMatch = (actual: unknown, expected: object): void => {
  for (const [key, value] of Object.entries(expected)) {
    deepStrictEqual((actual as Record<string, unknown>)[key], value);
  }
};

export const expect = (actual: unknown, _message?: string) => ({
  not: {
    toBe: (expected: unknown) => assertFalse(Object.is(actual, expected)),
    toContain: (expected: unknown) =>
      assertFalse((actual as readonly unknown[]).includes(expected)),
    toMatch: (expected: RegExp) => assertFalse(expected.test(String(actual))),
  },
  toBe: (expected: unknown) => strictEqual(actual, expected),
  toBeCloseTo: (expected: number, precision = 2) =>
    assertTrue(Math.abs((actual as number) - expected) < 0.5 * 10 ** -precision),
  toBeDefined: () => assertTrue(actual !== undefined),
  toBeTypeOf: (expected: string) => strictEqual(typeof actual, expected),
  toBeUndefined: () => assertUndefined(actual),
  toContain: (expected: unknown) => assertInclude(String(actual), String(expected)),
  toEqual: (expected: unknown) => deepStrictEqual(actual, expected),
  toHaveLength: (expected: number) => strictEqual((actual as Matchable).length, expected),
  toMatch: (expected: RegExp) => assertMatch(String(actual), expected),
  toMatchObject: (expected: object) => partialMatch(actual, expected),
});
