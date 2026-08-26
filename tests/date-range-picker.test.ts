import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dateRangePicker } from "../src/application/date-range-picker.ts";

describe("authenticated date range picker", () => {
  it("exposes a dedicated controlled FoldKit renderer", () => {
    expect(typeof dateRangePicker).toBe("function");
  });
});
