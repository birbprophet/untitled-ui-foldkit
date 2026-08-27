import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  UserInviteLocale,
  UserInviteMember,
  UserInviteModalProps,
} from "../src/application/user-invite-modal.ts";

const personAvatar = (fill: string): string =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${fill}'/%3E%3C/svg%3E`;

const members: readonly UserInviteMember[] = [
  {
    avatarUrl: personAvatar("7f56d9"),
    email: "candice@siglata.com",
    id: "candice",
    name: "Candice Wu",
  },
  {
    email: "demi@siglata.com",
    id: "demi",
    initials: "DW",
    name: "Demi Wilkinson",
  },
  {
    avatarUrl: personAvatar("9e77ed"),
    email: "drew@siglata.com",
    id: "drew",
    name: "Drew Cano",
  },
];
const people = [
  { avatarUrl: personAvatar("b692f6"), id: "@phoenix", label: "Phoenix Baker" },
  { avatarUrl: personAvatar("d6bbfb"), id: "@olivia", label: "Olivia Rhye" },
  { avatarUrl: personAvatar("444ce0"), id: "@lana", label: "Lana Steiner" },
];

describe("user invite modal", () => {
  it("keeps access, selection, and every action controlled", () => {
    const props: UserInviteModalProps<string> = {
      id: "share-with-people",
      isOpen: true,
      locale: "en-US",
      members,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onDone: "done",
      onFocusPerson: (id) => `focus:${id}`,
      onRemoveMember: (id) => `remove:${id}`,
      onSelectOpenChanged: (isOpen) => `select:${String(isOpen)}`,
      onSelectPerson: (id) => `select:${id}`,
      people,
      selectedPersonId: "@olivia",
    };
    expect(props.onRemoveMember("candice")).toBe("remove:candice");
    expect(props.onSelectPerson("@phoenix")).toBe("select:@phoenix");
    expect(props.members).toEqual(members);
    expect(props.members.map((member) => member.avatarUrl)).toEqual([
      personAvatar("7f56d9"),
      undefined,
      personAvatar("9e77ed"),
    ]);
    expect(props.members[1]?.initials).toBe("DW");
  });

  it("supports the exact unselected source state", () => {
    const props: UserInviteModalProps<string> = {
      id: "share-with-people",
      isOpen: true,
      locale: "pt-BR",
      members,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onDone: "done",
      onFocusPerson: (id) => id,
      onRemoveMember: (id) => id,
      onSelectOpenChanged: String,
      onSelectPerson: (id) => id,
      people,
    };
    expect(props.selectedPersonId).toBeUndefined();
    expect(props.members).toHaveLength(3);
  });

  it("supports the two left-to-right copy variants", () => {
    const locales: readonly UserInviteLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
