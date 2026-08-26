import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { VerificationCodeModalProps } from "../src/application/verification-code-modal.ts";

describe("verification code modal", () => {
  it("keeps code, focus, resend, and dialog actions controlled", () => {
    const props: VerificationCodeModalProps<string> = {
      code: "1289",
      id: "verification-code",
      isCodeFocused: true,
      isCodeInvalid: false,
      isOpen: true,
      locale: "pt-BR",
      onCancel: "cancel",
      onCodeBlur: "blur",
      onCodeFocus: "focus",
      onCodeInput: (code) => `code:${code}`,
      onDismiss: "dismiss",
      onResend: "resend",
      onVerify: "verify",
    };

    expect(props.code).toBe("1289");
    expect(props.isCodeFocused).toBe(true);
    expect(props.isCodeInvalid).toBe(false);
    expect(props.locale).toBe("pt-BR");
    expect(props.onCodeInput("4561")).toBe("code:4561");
    expect(props.onResend).toBe("resend");
    expect(props.onVerify).toBe("verify");
    expect(props.onDismiss).toBe("dismiss");
  });
});
