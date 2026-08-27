import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  ShareProjectMenu,
  ShareProjectModalProps,
  ShareProjectPermission,
} from "../src/application/share-project-modal.ts";

const memberAvatar = (fill: string): string =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${fill}'/%3E%3C/svg%3E`;

describe("share project modal", () => {
  it("keeps search, permission menus, copy state, locale, and actions controlled", () => {
    const props: ShareProjectModalProps<string> = {
      copied: false,
      focusedPermission: "can-edit",
      id: "share-project",
      isOpen: true,
      linkPermission: "can-edit",
      locale: "pt-BR",
      memberPermissions: { ammar: "can-edit", mathilde: "can-view", sienna: "owner" },
      members: [
        {
          avatarUrl: memberAvatar("7f56d9"),
          email: "sienna@siglata.com",
          id: "sienna",
          isOnline: true,
          name: "Sienna Hewitt",
        },
        {
          avatarUrl: memberAvatar("9e77ed"),
          email: "ammar@siglata.com",
          id: "ammar",
          isOnline: false,
          name: "Ammar Foley",
        },
        {
          avatarUrl: memberAvatar("b692f6"),
          email: "mathilde@siglata.com",
          id: "mathilde",
          isOnline: false,
          name: "Mathilde Lewis",
        },
      ],
      onCancel: "cancel",
      onCopy: "copy",
      onDismiss: "dismiss",
      onDone: "done",
      onEmbed: "embed",
      onFocusPermission: (permission) => `focus:${permission}`,
      onMenuOpen: (menu) => `menu:${menu ?? "closed"}`,
      onPermissionSelect: (menu, permission) => `select:${menu}:${permission}`,
      onSearch: (query) => `search:${query}`,
      openMenu: "ammar",
      searchQuery: "Mathilde",
      shareUrl: "siglata.com/project/untitled",
    };

    expect(props.onSearch("Sienna")).toBe("search:Sienna");
    expect(props.onMenuOpen(null)).toBe("menu:closed");
    expect(props.onFocusPermission("can-view")).toBe("focus:can-view");
    expect(props.onPermissionSelect("ammar", "owner")).toBe("select:ammar:owner");
    expect(props.members.map((member) => member.id)).toEqual(["sienna", "ammar", "mathilde"]);
    expect(props.members.every((member) => member.avatarUrl.startsWith("data:image/"))).toBe(true);
  });

  it("names every permission-bearing surface", () => {
    const menus: readonly ShareProjectMenu[] = ["link", "sienna", "ammar", "mathilde"];
    const permissions: readonly ShareProjectPermission[] = ["owner", "can-view", "can-edit"];

    expect(menus).toHaveLength(4);
    expect(permissions).toEqual(["owner", "can-view", "can-edit"]);
  });
});
