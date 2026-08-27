import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageCard01 } from "../src/marketing/team-section-image-card-01.ts";

describe("team section image card 01", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageCard01).toBeTypeOf("function");
  });
});
