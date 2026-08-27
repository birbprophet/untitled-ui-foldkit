import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";
import type {
  MessageChatMenuProps,
  MessageChatMenuTab,
} from "../src/application/message-chat-menu.ts";
import { messageChatMenuFixture } from "../src/application/message-chat-menu.ts";

const faces = {
  demi: agentFace("Demi Wilkinson"),
  lana: agentFace("Lana Steiner"),
  olivia: agentFace("Olivia Rhye"),
  phoenix: agentFace("Phoenix Baker"),
};

const propsFor = (locale: "en-US" | "pt-BR"): MessageChatMenuProps<string> => ({
  avatars: faces,
  draft: "",
  focusedTab: "recent",
  id: "message-chat-menu",
  isOpen: true,
  locale,
  messageForDraft: (value) => `draft:${value}`,
  messageForTabFocus: (tab) => `focus:${tab}`,
  messageForTabSelection: (tab) => `select:${tab}`,
  onDismiss: "dismiss",
  onMessageAction: (id, action) => `${id}:${action}`,
  onSubmit: "submit",
  selectedTab: "recent",
});

describe("message chat menu", () => {
  it("keeps composer, tabs, actions, and dismissal controlled", () => {
    const props = propsFor("en-US");
    expect(props.messageForDraft("Review complete")).toBe("draft:Review complete");
    expect(props.messageForTabSelection("groups")).toBe("select:groups");
    expect(props.onMessageAction("message-002", "download")).toBe("message-002:download");
    expect(props.onSubmit).toBe("submit");
    expect(props.onDismiss).toBe("dismiss");

    const messages = messageChatMenuFixture("en-US");
    expect(messages).toHaveLength(6);
    expect(messages[0]?.text).toBe("Hey team, I've finished with the requirements doc!");
    expect(messages[1]?.attachment).toEqual({ name: "Tech requirements.pdf", size: "1.2 MB" });
    expect(messages[2]?.isSelf).toBe(true);
    expect(messages[3]?.name).toBe("Demi Wilkinson");
    expect(faces.lana).toBeTypeOf("string");
  });

  it("supports the Portuguese LTR branch and all authenticated tabs", () => {
    const props = propsFor("pt-BR");
    const tabs: readonly MessageChatMenuTab[] = ["recent", "groups", "archive"];
    expect(props.locale).toBe("pt-BR");
    expect(tabs.map(props.messageForTabFocus)).toEqual([
      "focus:recent",
      "focus:groups",
      "focus:archive",
    ]);
    const messages = messageChatMenuFixture("pt-BR");
    expect(messages[0]?.sentAt).toBe("quinta-feira, 11:40");
    expect(messages[1]?.attachment?.name).toBe("Requisitos técnicos.pdf");
    expect(messages[0]?.name).toBe(messageChatMenuFixture("en-US")[0]?.name);
  });
});
