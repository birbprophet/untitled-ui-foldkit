import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageCollage01 } from "../src/marketing/team-section-image-collage-01.ts";

describe("team section image collage 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageCollage01).toBeTypeOf("function");
  });
});
