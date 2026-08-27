import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageCard03 } from "../src/marketing/team-section-image-card-03.ts";

describe("team section image card 03", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageCard03).toBeTypeOf("function");
  });
});
