/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  marketingDropdownMenuItemLink,
  marketingDropdownMenuShell,
} from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuItem } from "./marketing-dropdown-shared.ts";

export interface DropdownMenuSimpleProps<Message> {
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const dropdownMenuSimple = <Message>(
  props: DropdownMenuSimpleProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  marketingDropdownMenuShell(
    [
      h.ul(
        [h.Class("flex flex-col gap-0.5 pt-2 pb-3 md:p-2")],
        props.items.map((item) =>
          h.keyed("li")(item.id, [], [marketingDropdownMenuItemLink(item, props.onItem, h)]),
        ),
      ),
    ],
    h,
  );
