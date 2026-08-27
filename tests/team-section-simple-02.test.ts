import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionSimple02 } from "../src/marketing/team-section-simple-02.ts";

describe("team section simple 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionSimple02).toBeTypeOf("function");
  });
});
