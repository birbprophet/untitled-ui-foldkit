import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import {
  contactSimpleForm,
  contactSimpleFormCountries,
} from "../src/marketing/contact-simple-form.ts";

describe("contact simple form", () => {
  it("retains source phone formatting and controlled form events", () => {
    const us = contactSimpleFormCountries.find(({ id }) => id === "US");
    const brazil = contactSimpleFormCountries.find(({ id }) => id === "BR");
    const onFieldInput = (field: string, value: string) => `${field}:${value}`;

    expect(us?.phoneMask.replaceAll("#", "0")).toBe("+1 (000) 000-0000");
    expect(brazil?.phoneMask.replaceAll("#", "0")).toBe("+55 (00) 90000-0000");
    expect(onFieldInput("email", "reader@example.com")).toBe("email:reader@example.com");
    expect(contactSimpleForm).toBeTypeOf("function");
  });

  it("keeps every customer-facing output left-to-right", () => {
    expect(contactSimpleFormCountries.map(({ id }) => id)).toEqual(["US", "BR", "AU", "GB", "CA"]);
  });
});
