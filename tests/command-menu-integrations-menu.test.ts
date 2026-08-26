import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  commandMenuIntegrationsMenu,
  commandMenuIntegrationsMenuStacked,
} from "../src/application/command-menu-integrations-menu.ts";

describe("command menu integration previews", () => {
  it("keeps regular and stacked IDs on dedicated renderers", () => {
    expect(commandMenuIntegrationsMenu).not.toBe(commandMenuIntegrationsMenuStacked);
    expect(typeof commandMenuIntegrationsMenu).toBe("function");
    expect(typeof commandMenuIntegrationsMenuStacked).toBe("function");
  });
});
