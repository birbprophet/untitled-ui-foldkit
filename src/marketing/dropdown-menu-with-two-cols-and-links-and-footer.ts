/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI dropdown menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { marketingDropdownMenuItemLink } from "./marketing-dropdown-shared.ts";
import type { MarketingDropdownMenuColumn } from "./marketing-dropdown-shared.ts";

export interface DropdownMenuWithTwoColsAndLinksAndFooterProps<Message> {
  readonly columns: readonly MarketingDropdownMenuColumn[];
  readonly description: string;
  readonly documentationLabel: string;
  readonly getStartedItems: readonly {
    readonly href: string;
    readonly id: string;
    readonly title: string;
  }[];
  readonly getStartedTitle: string;
  readonly heading: string;
  readonly onAction: (id: string) => NoInfer<Message>;
  readonly onGetStarted: (id: string) => NoInfer<Message>;
  readonly onItem: (id: string) => NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly viewAllLabel: string;
}

const bookOpenIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"),
      ]),
    ],
  );

export const dropdownMenuWithTwoColsAndLinksAndFooter = <Message>(
  props: DropdownMenuWithTwoColsAndLinksAndFooterProps<Message>,
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
                "flex flex-col gap-5 rounded-xl bg-bg-primary pt-4 pb-5 ring-1 ring-border-secondary md:gap-6 md:rounded-t-2xl md:p-6 md:pt-5",
              ),
            ],
            [
              h.div(
                [h.Class("flex flex-col gap-1 px-4 md:p-0")],
                [
                  h.p([h.Class("text-sm font-semibold text-text-primary")], [props.heading]),
                  h.p([h.Class("text-sm text-text-tertiary")], [props.description]),
                ],
              ),
              h.div(
                [h.Class("flex flex-col gap-5 md:flex-row md:gap-8 md:py-0")],
                [
                  h.div(
                    [
                      h.Class(
                        "-mb-px flex flex-col gap-4 border-b border-b-border-secondary px-4 pb-5 md:mb-0 md:gap-5 md:border-none md:p-0",
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
                  h.div(
                    [h.Class("grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-2")],
                    props.columns.map((column) =>
                      h.keyed("div")(
                        column.id,
                        [],
                        [
                          h.h3(
                            [
                              h.Class(
                                "mb-2 px-4 text-sm font-semibold text-text-brand-tertiary md:px-0",
                              ),
                            ],
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
                ],
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                "mx-auto flex max-w-container flex-col px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6",
              ),
            ],
            [
              button(
                {
                  className: "hidden md:flex",
                  color: "secondary",
                  href: "#",
                  iconLeadingElement: bookOpenIcon(h),
                  label: props.documentationLabel,
                  onPress: props.onAction("documentation"),
                  size: "md",
                },
                h,
              ),
              button(
                {
                  className: "hidden md:flex",
                  color: "primary",
                  label: props.viewAllLabel,
                  onPress: props.onViewAll,
                  size: "md",
                },
                h,
              ),
              button(
                {
                  className: "md:hidden",
                  color: "primary",
                  label: props.viewAllLabel,
                  onPress: props.onViewAll,
                  size: "sm",
                },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
