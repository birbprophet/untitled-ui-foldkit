import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  commandMenuUsers,
  commandMenuUsersStacked,
} from "../src/application/command-menu-users.ts";

describe("command-menu user compositions", () => {
  it("exports one dedicated renderer for each authenticated ID", () => {
    expect(commandMenuUsers).not.toBe(commandMenuUsersStacked);
    expect(typeof commandMenuUsers).toBe("function");
    expect(typeof commandMenuUsersStacked).toBe("function");
  });
});
