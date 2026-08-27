/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuColumn } from "./marketing-dropdown-shared.ts";

export interface Menu2ColWithLinksProps<Message> {
  readonly columns: readonly MarketingDropdownMenuColumn[];
  readonly getStartedItems: readonly {
    readonly href: string;
    readonly id: string;
    readonly title: string;
  }[];
  readonly getStartedTitle: string;
  readonly onGetStarted: (id: string) => NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
}

export const menu2ColWithLinks = <Message>(
  props: Menu2ColWithLinksProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("relative overflow-hidden bg-bg-primary md:shadow-lg"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto flex max-w-container flex-col lg:flex-row")],
        [
          h.div(
            [
              h.Class(
                "grid flex-1 grid-cols-1 gap-5 pt-4 pb-5 md:grid-cols-2 md:px-8 md:py-6 lg:grid-cols-3",
              ),
            ],
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
          h.div(
            [
              h.Class(
                "relative z-10 flex shrink-0 flex-col gap-3 bg-bg-secondary px-4 pt-5 pb-6 md:px-8 md:py-6 lg:pl-6",
              ),
            ],
            [
              h.h3(
                [h.Class("text-sm font-semibold text-text-brand-tertiary")],
                [props.getStartedTitle],
              ),
              h.ul(
                [h.Class("flex flex-col gap-3")],
                props.getStartedItems.map((item) =>
                  h.keyed("li")(
                    item.id,
                    [],
                    [
                      button(
                        {
                          color: "link-gray",
                          href: item.href,
                          label: item.title,
                          onPress: props.onGetStarted(item.id),
                          size: "md",
                        },
                        h,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    ],
  );
