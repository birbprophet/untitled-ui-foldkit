import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageGlass03 } from "../src/marketing/team-section-image-glass-03.ts";

describe("team section image glass 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageGlass03).toBeTypeOf("function");
  });
});
