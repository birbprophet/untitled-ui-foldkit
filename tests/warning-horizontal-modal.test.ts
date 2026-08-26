import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { WarningHorizontalModalProps } from "../src/application/warning-horizontal-modal.ts";

describe("warning horizontal modal", () => {
  it("keeps selection and every dismissal choice controlled", () => {
    const props: WarningHorizontalModalProps<string> = {
      hideAgain: true,
      id: "warning-horizontal-modal",
      isOpen: true,
      locale: "pt-BR",
      onDiscard: "discard",
      onDismiss: "dismiss",
      onSave: "save",
      onToggleHideAgain: "toggle",
    };

    expect(props.hideAgain).toBe(true);
    expect(props.locale).toBe("pt-BR");
    expect(props.onToggleHideAgain).toBe("toggle");
    expect(props.onDiscard).toBe("discard");
    expect(props.onSave).toBe("save");
    expect(props.onDismiss).toBe("dismiss");
  });
});
