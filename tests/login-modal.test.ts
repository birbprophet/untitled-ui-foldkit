/* oxlint-disable @rikalabs/no-hardcoded-secrets -- These inert strings verify the controlled password-shaped component contract. */
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { LoginModalProps } from "../src/application/login-modal.ts";

describe("login modal", () => {
  it("keeps credentials, preference, and actions controlled", () => {
    const props: LoginModalProps<string> = {
      email: "operator@siglata.com",
      id: "login",
      isOpen: true,
      isRemembered: false,
      onDismiss: "dismiss",
      onEmailInput: (value) => `email:${value}`,
      onForgotPassword: "recovery-requested",
      onGoogleSignIn: "google",
      onPasswordInput: (value) => `password:${value}`,
      onRememberToggle: "remember",
      onSubmit: "submit",
      password: "typed-password",
      wordmarkAlt: "/brand/logo.svg",
      wordmarkSrc: "/brand/logo.svg",
    };
    expect(props.onEmailInput("hello@example.com")).toBe("email:hello@example.com");
    expect(props.onRememberToggle).toBe("remember");
  });
});
