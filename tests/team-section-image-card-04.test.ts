import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageCard04 } from "../src/marketing/team-section-image-card-04.ts";

describe("team section image card 04", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageCard04).toBeTypeOf("function");
  });
});
