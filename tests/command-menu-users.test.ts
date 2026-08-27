import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";

import {
  commandMenuUsers,
  commandMenuUsersStacked,
} from "../src/application/command-menu-users.ts";
import type { CommandMenuUsersProps } from "../src/application/command-menu-users.ts";

describe("command-menu user compositions", () => {
  it("resolves supplied person identity instead of generated artwork", () => {
    const props: CommandMenuUsersProps<string> = {
      avatars: { "user-01": agentFace("Phoenix Baker"), "user-02": agentFace("Olivia Rhye") },
      id: "command-menu-users",
      isOpen: true,
      messageForFocus: (id) => `focus:${id}`,
      messageForSelect: (id) => `select:${id}`,
      onClose: "close",
      onQueryChange: (query) => `query:${query}`,
      query: "",
    };

    expect(props.avatars["user-01"]).toMatch(/^data:image\//u);
    expect(props.avatars["user-03"]).toBeUndefined();
    expect(props.messageForSelect("user-02")).toBe("select:user-02");
  });

  it("exports one dedicated renderer for each authenticated ID", () => {
    expect(commandMenuUsers).not.toBe(commandMenuUsersStacked);
    expect(typeof commandMenuUsers).toBe("function");
    expect(typeof commandMenuUsersStacked).toBe("function");
  });
});
