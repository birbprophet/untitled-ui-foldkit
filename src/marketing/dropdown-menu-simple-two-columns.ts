/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuItem } from "./marketing-dropdown-shared.ts";

export interface DropdownMenuSimpleTwoColumnsProps<Message> {
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const dropdownMenuSimpleTwoColumns = <Message>(
  props: DropdownMenuSimpleTwoColumnsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.nav(
    [h.Class("px-3 pb-2 md:max-w-160 md:p-0")],
    [
      h.ul(
        [
          h.Class(
            "grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl bg-bg-primary py-2 shadow-xs ring-1 ring-border-secondary_alt md:grid-cols-2 md:p-2 md:shadow-lg",
          ),
        ],
        props.items.map((item) =>
          h.keyed("li")(item.id, [], [marketingDropdownMenuItemLink(item, props.onItem, h)]),
        ),
      ),
    ],
  );
