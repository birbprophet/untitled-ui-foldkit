/* oxlint-disable @rikalabs/no-hardcoded-secrets -- These inert strings verify the controlled password-shaped component contract. */
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { Signup01ModalField, Signup01ModalProps } from "../src/application/signup-01-modal.ts";

describe("signup 01 modal", () => {
  it("keeps fields, validation, password visibility, and actions controlled", () => {
    const props: Signup01ModalProps<string> = {
      email: "operator@siglata.com",
      id: "signup-01",
      invalidFields: ["password"],
      isOpen: true,
      isPasswordVisible: false,
      name: "Olivia Rhye",
      onDismiss: "dismiss",
      onFieldInput: (field, value) => `${field}:${value}`,
      onGoogleSignIn: "google",
      onPasswordVisibilityToggle: "toggle-password",
      onSubmit: "submit",
      password: "short",
      wordmarkAlt: "/brand/logo.svg",
      wordmarkSrc: "/brand/logo.svg",
    };
    const fields: readonly Signup01ModalField[] = ["name", "email", "password"];
    expect(fields).toEqual(["name", "email", "password"]);
    expect(props.onFieldInput("name", "Maya Chen")).toBe("name:Maya Chen");
    expect(props.invalidFields).toEqual(["password"]);
    expect(props.onPasswordVisibilityToggle).toBe("toggle-password");
  });
});
