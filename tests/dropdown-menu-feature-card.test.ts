import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { dropdownMenuFeatureCard } from "../src/marketing/dropdown-menu-feature-card.ts";

describe("dropdown menu feature card", () => {
  it("exposes the authenticated marketing section renderer", () => {
    expect(dropdownMenuFeatureCard).toBeTypeOf("function");
  });
});
