import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { datePickerCalendar } from "../src/application/date-picker-calendar.ts";

describe("authenticated date picker calendar", () => {
  it("exposes a dedicated controlled FoldKit renderer", () => {
    expect(typeof datePickerCalendar).toBe("function");
  });
});
