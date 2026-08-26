import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { LinkFieldModalProps } from "../src/application/link-field-modal.ts";

describe("link field modal", () => {
  it("keeps the link, copied state, and actions controlled", () => {
    const props: LinkFieldModalProps<string> = {
      copied: false,
      id: "link-field",
      isOpen: true,
      link: "www.siglata.com/blog",
      onCancel: "cancel",
      onConfirm: "confirm",
      onCopy: "copy",
      onDismiss: "dismiss",
      onLinkInput: (value) => `link:${value}`,
    };
    expect(props.onLinkInput("www.siglata.com/changelog")).toBe("link:www.siglata.com/changelog");
    expect(props.onCopy).toBe("copy");
  });
});
