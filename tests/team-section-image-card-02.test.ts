import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamSectionImageCard02 } from "../src/marketing/team-section-image-card-02.ts";

describe("team section image card 02", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(teamSectionImageCard02).toBeTypeOf("function");
  });
});
