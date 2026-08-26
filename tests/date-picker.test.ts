import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { datePicker } from "../src/application/date-picker.ts";

describe("authenticated date picker", () => {
  it("exposes a dedicated controlled FoldKit renderer", () => {
    expect(typeof datePicker).toBe("function");
  });
});
