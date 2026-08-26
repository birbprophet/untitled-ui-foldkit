import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  UserInviteLocale,
  UserInviteMember,
  UserInviteModalProps,
} from "../src/application/user-invite-modal.ts";

const members: readonly UserInviteMember[] = [
  {
    avatarSeed: "candice-wu-user-invite",
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
    avatarSeed: "drew-cano-user-invite",
    email: "drew@siglata.com",
    id: "drew",
    name: "Drew Cano",
  },
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
      selectedPersonId: "@olivia",
    };
    expect(props.onRemoveMember("candice")).toBe("remove:candice");
    expect(props.onSelectPerson("@phoenix")).toBe("select:@phoenix");
    expect(props.members).toEqual(members);
    expect(props.members.map((member) => member.avatarSeed)).toEqual([
      "candice-wu-user-invite",
      undefined,
      "drew-cano-user-invite",
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
    };
    expect(props.selectedPersonId).toBeUndefined();
    expect(props.members).toHaveLength(3);
  });

  it("supports the two left-to-right copy variants", () => {
    const locales: readonly UserInviteLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
