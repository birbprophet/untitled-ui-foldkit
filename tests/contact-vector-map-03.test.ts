import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";
import { contactVectorMap03 } from "../src/marketing/contact-vector-map-03.ts";

describe("contact-vector-map-03", () => {
  it("exposes the renderer", () => {
    expect(contactVectorMap03).toBeTypeOf("function");
  });
});
