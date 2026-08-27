import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  ShareProjectMenuControl,
  ShareProjectMenuPermission,
  ShareProjectMenuProps,
} from "../src/application/share-project-menu.ts";
import { agentFace } from "../stories/fixtures/brand.ts";

describe("share project menu", () => {
  it("keeps slideout state, search, permissions, copying, and actions controlled", () => {
    const props: ShareProjectMenuProps<string> = {
      avatars: {
        ammar: agentFace("Ammar Foley"),
        julius: agentFace("Julius Vaughan"),
        mathilde: agentFace("Mathilde Lewis"),
        sienna: agentFace("Sienna Hewitt"),
      },
      copied: false,
      focusedPermission: "can-edit",
      id: "share-project-menu",
      isOpen: true,
      linkPermission: "can-edit",
      locale: "pt-BR",
      memberPermissions: {
        ammar: "can-edit",
        fleur: "can-view",
        julius: "can-edit",
        mathilde: "can-view",
        sienna: "owner",
      },
      onCancel: "cancel",
      onCopy: "copy",
      onDismiss: "dismiss",
      onDone: "done",
      onEmbed: "embed",
      onFocusPermission: (permission) => `focus:${permission}`,
      onMenuOpen: (menu) => `menu:${menu ?? "closed"}`,
      onPermissionSelect: (menu, permission) => `select:${menu}:${permission}`,
      onSearch: (query) => `search:${query}`,
      openMenu: "julius",
      searchQuery: "Mathilde",
      shareUrl: "siglata.com/project/untitled",
    };

    expect(props.onSearch("Sienna")).toBe("search:Sienna");
    expect(props.onMenuOpen(null)).toBe("menu:closed");
    expect(props.onFocusPermission("can-view")).toBe("focus:can-view");
    expect(props.onPermissionSelect("fleur", "owner")).toBe("select:fleur:owner");
    expect(props.memberPermissions).toEqual({
      ammar: "can-edit",
      fleur: "can-view",
      julius: "can-edit",
      mathilde: "can-view",
      sienna: "owner",
    });
    expect(props.avatars.fleur).toBeUndefined();
  });

  it("names all six permission-bearing surfaces and the upstream permission set", () => {
    const menus: readonly ShareProjectMenuControl[] = [
      "link",
      "sienna",
      "ammar",
      "mathilde",
      "julius",
      "fleur",
    ];
    const permissions: readonly ShareProjectMenuPermission[] = ["owner", "can-edit", "can-view"];

    expect(menus).toHaveLength(6);
    expect(permissions).toEqual(["owner", "can-edit", "can-view"]);
  });
});
