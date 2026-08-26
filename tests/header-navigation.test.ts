import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { headerNavigation } from "../src/application/header-navigation.ts";

describe("headerNavigation", () => {
  it("is a dedicated FoldKit renderer", () => {
    expect(typeof headerNavigation).toBe("function");
    expect(headerNavigation.name).toBe("headerNavigation");
  });
});
