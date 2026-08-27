/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import {
  marketingDropdownMenuFooterActions,
  marketingDropdownMenuItemLink,
} from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuColumn } from "./marketing-dropdown-shared.ts";

export interface DropdownMenuSimpleTwoColumnsWithFooterProps<Message> {
  readonly columns: readonly MarketingDropdownMenuColumn[];
  readonly footerActions: readonly {
    readonly href: string;
    readonly iconPath?: string;
    readonly id: string;
    readonly label: string;
  }[];
  readonly onAction: (id: string) => NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const dropdownMenuSimpleTwoColumnsWithFooter = <Message>(
  props: DropdownMenuSimpleTwoColumnsWithFooterProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("px-3 pb-2 md:max-w-200 md:p-0")],
    [
      h.nav(
        [
          h.Class(
            "overflow-hidden rounded-xl bg-bg-secondary shadow-xs ring-1 ring-border-secondary_alt md:rounded-2xl md:shadow-lg",
          ),
        ],
        [
          h.div(
            [
              h.Class(
                "grid grid-cols-1 gap-5 rounded-xl bg-bg-primary py-2 ring-1 ring-border-secondary md:grid-cols-2 md:gap-2 md:rounded-t-2xl md:p-2",
              ),
            ],
            props.columns.map((column) =>
              h.keyed("div")(
                column.id,
                [],
                [
                  h.h3(
                    [h.Class("mb-2 px-4 text-sm font-semibold text-text-brand-tertiary md:px-0")],
                    [column.title],
                  ),
                  h.ul(
                    [h.Class("flex flex-col gap-0.5")],
                    column.items.map((item) =>
                      h.keyed("li")(
                        item.id,
                        [],
                        [marketingDropdownMenuItemLink(item, props.onItem, h)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          marketingDropdownMenuFooterActions(props.footerActions, props.onAction, h),
        ],
      ),
    ],
  );
