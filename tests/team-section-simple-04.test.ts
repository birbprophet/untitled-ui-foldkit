import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionSimple04 } from "../src/marketing/team-section-simple-04.ts";

describe("team section simple 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionSimple04).toBeTypeOf("function");
  });
});
