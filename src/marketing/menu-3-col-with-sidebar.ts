/* oxlint-disable effect/noReturnInArrow, foldkit/keyed-required-for-mapped-rows -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuColumn } from "./marketing-dropdown-shared.ts";
import { marketingMenuFeatureCardVertical } from "./marketing-menu-shared.ts";

export interface Menu3ColWithSidebarProps<Message> {
  readonly cardDescription: string;
  readonly cardDismissLabel: string;
  readonly cardHref: string;
  readonly cardImageAlt: string;
  readonly cardImageSrc: string;
  readonly cardTitle: string;
  readonly columns: readonly MarketingDropdownMenuColumn[];
  readonly onChangelog: NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const menu3ColWithSidebar = <Message>(
  props: Menu3ColWithSidebarProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("relative overflow-hidden bg-bg-primary md:shadow-lg"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col md:items-start md:px-8 md:pb-6 xl:flex-row xl:pb-0",
          ),
        ],
        [
          h.div(
            [h.Class("grid grid-cols-1 gap-5 pt-4 pb-5 md:flex-1 md:grid-cols-3 md:py-6 md:pr-5")],
            props.columns.map((column) =>
              h.keyed("div")(
                column.id,
                [],
                [
                  h.h3(
                    [h.Class("mb-3 px-4 text-sm font-semibold text-text-brand-tertiary md:px-0")],
                    [column.title],
                  ),
                  h.ul(
                    [h.Class("flex flex-col gap-0.5")],
                    column.items.map((menuItem) =>
                      h.keyed("li")(
                        menuItem.id,
                        [],
                        [marketingDropdownMenuItemLink(menuItem, props.onItem, h)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          marketingMenuFeatureCardVertical(
            {
              description: props.cardDescription,
              dismissLabel: props.cardDismissLabel,
              href: props.cardHref,
              imageAlt: props.cardImageAlt,
              imageSrc: props.cardImageSrc,
              onChangelog: props.onChangelog,
              onDismiss: props.onDismiss,
              title: props.cardTitle,
            },
            h,
          ),
        ],
      ),
    ],
  );
