import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  commandMenuUsersMenu,
  commandMenuUsersMenuStacked,
} from "../src/application/command-menu-users-menu.ts";

describe("authenticated command menu user previews", () => {
  it("keeps regular and stacked IDs on dedicated renderers", () => {
    expect(commandMenuUsersMenu).not.toBe(commandMenuUsersMenuStacked);
    expect(typeof commandMenuUsersMenu).toBe("function");
    expect(typeof commandMenuUsersMenuStacked).toBe("function");
  });
});
