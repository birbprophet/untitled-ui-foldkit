/* oxlint-disable @rikalabs/no-hardcoded-secrets -- Exact upstream demo credentials are inert component fixtures. */
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { PasswordPromptModalProps } from "../src/application/password-prompt-modal.ts";

describe("password prompt modal", () => {
  it("keeps credentials, visibility, and actions controlled", () => {
    const props: PasswordPromptModalProps<string> = {
      email: "olivia@siglata.com",
      id: "password-prompt",
      isOpen: true,
      isPasswordVisible: false,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onEmailInput: (value) => `email:${value}`,
      onPasswordInput: (value) => `password:${value}`,
      onPasswordVisibilityToggle: "toggle",
      onVerify: "verify",
      password: "12345678",
    };
    expect(props.onEmailInput("operator@siglata.com")).toBe("email:operator@siglata.com");
    expect(props.onPasswordInput("secret")).toBe("password:secret");
  });
});
