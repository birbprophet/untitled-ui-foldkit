import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionSimple03 } from "../src/marketing/team-section-simple-03.ts";

describe("team section simple 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionSimple03).toBeTypeOf("function");
  });
});
