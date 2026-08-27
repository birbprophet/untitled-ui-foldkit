import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageCollage02 } from "../src/marketing/team-section-image-collage-02.ts";

describe("team section image collage 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageCollage02).toBeTypeOf("function");
  });
});
