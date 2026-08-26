import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { CenteredPhotoModalProps } from "../src/application/centered-photo-modal.ts";

describe("centered photo modal", () => {
  it("keeps copied and open state controlled", () => {
    const props: CenteredPhotoModalProps<string> = {
      id: "published",
      isCopied: true,
      isOpen: true,
      onCopyLink: "copy",
      onDismiss: "dismiss",
      onFinish: "finish",
    };
    expect(props.isCopied).toBe(true);
    expect(props.onCopyLink).toBe("copy");
    expect(props.onFinish).toBe("finish");
  });
});
