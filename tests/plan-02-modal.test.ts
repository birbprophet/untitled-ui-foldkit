import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { Plan02, Plan02ModalProps } from "../src/application/plan-02-modal.ts";

const select = (plan: Plan02): string => `select:${plan}`;

describe("plan 02 modal", () => {
  it("keeps plan selection and actions controlled", () => {
    const props: Plan02ModalProps<string> = {
      id: "plan-02",
      isOpen: true,
      onCancel: "cancel",
      onChat: "chat",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onSelect: select,
      selectedPlan: "basic",
    };

    expect(props.onSelect("business")).toBe("select:business");
    expect(props.onChat).toBe("chat");
  });
});
