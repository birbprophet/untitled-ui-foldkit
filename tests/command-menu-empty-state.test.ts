import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { commandMenuEmptyState } from "../src/application/command-menu-empty-state.ts";

describe("command-menu-empty-state", () => {
  it("exports a dedicated renderer instead of a generic fallback", () => {
    expect(typeof commandMenuEmptyState).toBe("function");
  });
});
