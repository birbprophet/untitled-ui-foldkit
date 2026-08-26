import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { messagesMenuFixture } from "../src/application/messages-menu.ts";
import type { MessagesMenuProps } from "../src/application/messages-menu.ts";

describe("messages menu", () => {
  it("preserves the authenticated feed and controlled menu state", () => {
    const messages = messagesMenuFixture("en-US");
    const props: MessagesMenuProps<string> = {
      focusedTabId: "groups",
      id: "messages",
      isOpen: true,
      locale: "en-US",
      messages,
      onDismiss: "dismiss",
      onTabFocus: (tabId) => `focus:${tabId}`,
      onTabSelect: (tabId) => `select:${tabId}`,
      selectedTabId: "recent",
    };

    expect(messages).toHaveLength(15);
    expect(messages.filter((message) => message.unseen === true)).toHaveLength(3);
    expect(messages.filter((message) => message.attachment !== undefined)).toHaveLength(2);
    expect(messages[0]?.message).toBe("Looks good!");
    expect(messages[6]?.attachment?.name).toBe("Datasheet_draft_02.pdf");
    expect(props.onTabFocus("archive")).toBe("focus:archive");
    expect(props.onTabSelect("groups")).toBe("select:groups");
    expect(props.onDismiss).toBe("dismiss");
  });

  it("localizes copy and keeps deterministic identity seeds stable", () => {
    const english = messagesMenuFixture("en-US");
    const portuguese = messagesMenuFixture("pt-BR");

    expect(portuguese[0]?.date).toBe("Agora");
    expect(portuguese[0]?.message).toBe("Parece ótimo!");
    expect(portuguese[6]?.attachment?.name).toBe("Ficha_tecnica_rascunho_02.pdf");
    expect(portuguese[0]?.avatarSeed).toBe(english[0]?.avatarSeed);
    expect(portuguese[1]?.avatarKind).toBe("robot");
  });
});
