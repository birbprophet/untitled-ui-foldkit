import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageGlass01 } from "../src/marketing/team-section-image-glass-01.ts";

describe("team section image glass 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageGlass01).toBeTypeOf("function");
  });
});
