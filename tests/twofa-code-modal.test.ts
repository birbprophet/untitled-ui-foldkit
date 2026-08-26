import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { TwofaCodeModalProps } from "../src/application/twofa-code-modal.ts";

describe("two-factor code modal", () => {
  it("keeps the code, focus, resend, and dialog actions controlled", () => {
    const props: TwofaCodeModalProps<string> = {
      code: "128904",
      id: "twofa-code",
      isCodeFocused: true,
      isOpen: true,
      locale: "en-US",
      onCancel: "cancel",
      onCodeBlur: "blur",
      onCodeFocus: "focus",
      onCodeInput: (code) => `code:${code}`,
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onResend: "resend",
    };

    expect(props.code).toBe("128904");
    expect(props.isCodeFocused).toBe(true);
    expect(props.onCodeInput("456123")).toBe("code:456123");
    expect(props.onResend).toBe("resend");
    expect(props.onConfirm).toBe("confirm");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.locale).toBe("en-US");
  });
});
