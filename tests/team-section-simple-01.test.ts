import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionSimple01 } from "../src/marketing/team-section-simple-01.ts";

describe("team section simple 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionSimple01).toBeTypeOf("function");
  });
});
