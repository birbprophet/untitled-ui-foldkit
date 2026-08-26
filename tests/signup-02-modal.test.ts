import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { Signup02ModalProps } from "../src/application/signup-02-modal.ts";

describe("signup 02 modal", () => {
  it("keeps the email and every action controlled", () => {
    const props: Signup02ModalProps<string> = {
      email: "operator@siglata.com",
      id: "signup-02",
      isOpen: true,
      onAppleSignup: "apple",
      onDismiss: "dismiss",
      onEmailInput: (value) => `email:${value}`,
      onFacebookSignup: "facebook",
      onGoogleSignup: "google",
      onSubmit: "submit",
    };

    expect(props.onEmailInput("hello@example.com")).toBe("email:hello@example.com");
    expect(props.onGoogleSignup).toBe("google");
    expect(props.onFacebookSignup).toBe("facebook");
    expect(props.onAppleSignup).toBe("apple");
  });
});
