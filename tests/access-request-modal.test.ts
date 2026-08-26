import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { AccessRequestModalProps } from "../src/application/access-request-modal.ts";

describe("access request modal", () => {
  it("keeps visibility and actions controlled", () => {
    const props: AccessRequestModalProps<string> = {
      avatarSeed: "candice-wu-access-request",
      id: "request",
      isOpen: true,
      onCancel: "cancel",
      onConfirm: "confirm",
      projectName: "Marketing Website Design",
      requesterEmail: "candice@siglata.com",
      requesterFirstName: "Candice",
      requesterName: "Candice Wu",
    };
    expect(props.isOpen).toBe(true);
    expect(props.onCancel).toBe("cancel");
    expect(props.onConfirm).toBe("confirm");
    expect(props.requesterEmail).toBe("candice@siglata.com");
  });
});
