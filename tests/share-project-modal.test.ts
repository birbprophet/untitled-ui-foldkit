import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  ShareProjectMenu,
  ShareProjectModalProps,
  ShareProjectPermission,
} from "../src/application/share-project-modal.ts";

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
  });

  it("names every permission-bearing surface", () => {
    const menus: readonly ShareProjectMenu[] = ["link", "sienna", "ammar", "mathilde"];
    const permissions: readonly ShareProjectPermission[] = ["owner", "can-view", "can-edit"];

    expect(menus).toHaveLength(4);
    expect(permissions).toEqual(["owner", "can-view", "can-edit"]);
  });
});
