import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contactSimpleLinks02 } from "../src/marketing/contact-simple-links-02.ts";

describe("contact-simple-links-02", () => {
  it("exposes the renderer", () => {
    expect(contactSimpleLinks02).toBeTypeOf("function");
  });
});
