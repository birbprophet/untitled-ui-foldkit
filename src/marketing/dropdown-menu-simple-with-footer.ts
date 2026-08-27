/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuItem } from "./marketing-dropdown-shared.ts";

export interface DropdownMenuSimpleWithFooterProps<Message> {
  readonly allResourcesLabel: string;
  readonly items: readonly MarketingDropdownMenuItem[];
  readonly onAllResources: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const dropdownMenuSimpleWithFooter = <Message>(
  props: DropdownMenuSimpleWithFooterProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("px-3 pb-2 md:max-w-84 md:p-0")],
    [
      h.nav(
        [
          h.Class(
            "overflow-hidden rounded-xl bg-bg-secondary shadow-xs ring-1 ring-border-secondary_alt md:rounded-2xl md:shadow-lg",
          ),
        ],
        [
          h.ul(
            [
              h.Class(
                "flex flex-col gap-0.5 rounded-xl bg-bg-primary py-2 ring-1 ring-border-secondary md:rounded-t-2xl md:p-2",
              ),
            ],
            props.items.map((item) =>
              h.keyed("li")(item.id, [], [marketingDropdownMenuItemLink(item, props.onItem, h)]),
            ),
          ),
          h.div(
            [h.Class("flex justify-center px-4 py-5 text-center sm:px-5")],
            [
              button(
                {
                  color: "link-color",
                  label: props.allResourcesLabel,
                  onPress: props.onAllResources,
                  size: "md",
                },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
