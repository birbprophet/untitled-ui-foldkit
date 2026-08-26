import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { rangeCalendar } from "../src/application/range-calendar.ts";

describe("authenticated range calendar", () => {
  it("exposes a dedicated controlled FoldKit renderer", () => {
    expect(typeof rangeCalendar).toBe("function");
  });
});
