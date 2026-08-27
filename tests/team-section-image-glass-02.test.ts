import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageGlass02 } from "../src/marketing/team-section-image-glass-02.ts";

describe("team section image glass 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageGlass02).toBeTypeOf("function");
  });
});
