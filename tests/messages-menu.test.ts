import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";
import { messagesMenuFixture } from "../src/application/messages-menu.ts";
import type { MessagesMenuProps } from "../src/application/messages-menu.ts";

const faces = {
  "@andi": agentFace("Andi Lane"),
  "@ava": agentFace("Ava Wright"),
  "@candice": agentFace("Candice Wu"),
  "@demi": agentFace("Demi Wilkinson"),
  "@drew": agentFace("Drew Cano"),
  "@eve": agentFace("Eve Leroy"),
  "@joshua": agentFace("Joshua Wilson"),
  "@kate": agentFace("Kate Morrison"),
  "@koray": agentFace("Koray Okumus"),
  "@lana": agentFace("Lana Steiner"),
  "@natali": agentFace("Natali Craig"),
  "@orlando": agentFace("Orlando Diggs"),
  "@phoenix": agentFace("Phoenix Baker"),
  "@rene": agentFace("Rene Wells"),
  "@zahir": agentFace("Zahir Mays"),
};

describe("messages menu", () => {
  it("preserves the authenticated feed and controlled menu state", () => {
    const messages = messagesMenuFixture("en-US", faces);
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
    expect(messages[0]?.avatarUrl).toBe(faces["@phoenix"]);
    expect(messages[1]?.avatarUrl).toBe(faces["@lana"]);
    expect(messages[3]?.avatarUrl).toBe(faces["@candice"]);
    expect(messages[14]?.avatarUrl).toBe(faces["@rene"]);
    expect(props.onTabFocus("archive")).toBe("focus:archive");
    expect(props.onTabSelect("groups")).toBe("select:groups");
    expect(props.onDismiss).toBe("dismiss");
  });

  it("localizes copy while identities come from the supplied avatars", () => {
    const english = messagesMenuFixture("en-US", faces);
    const portuguese = messagesMenuFixture("pt-BR", faces);

    expect(portuguese[0]?.date).toBe("Agora");
    expect(portuguese[0]?.message).toBe("Parece ótimo!");
    expect(portuguese[6]?.attachment?.name).toBe("Ficha_tecnica_rascunho_02.pdf");
    expect(portuguese[0]?.avatarUrl).toBe(faces["@phoenix"]);
    expect(portuguese[1]?.avatarUrl).toBe(faces["@lana"]);
    expect(portuguese.map((item) => item.avatarUrl)).toEqual(english.map((item) => item.avatarUrl));
  });
});
