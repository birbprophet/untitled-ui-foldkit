import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageGlass04 } from "../src/marketing/team-section-image-glass-04.ts";

describe("team section image glass 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageGlass04).toBeTypeOf("function");
  });
});
