import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  commandMenuActions,
  commandMenuActionsStacked,
} from "../src/application/command-menu-actions.ts";

describe("command-menu action compositions", () => {
  it("exports one dedicated renderer for each authenticated ID", () => {
    expect(commandMenuActions).not.toBe(commandMenuActionsStacked);
  });
});
