/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { tabs } from "../application/tabs.ts";

export interface HeaderSectionTab {
  readonly id: string;
  readonly label: string;
}

export interface HeaderCenteredTabsBrandProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onTab: (id: string) => NoInfer<Message>;
  readonly selectedTabId: string;
  readonly tabs: readonly HeaderSectionTab[];
  readonly tabsId: string;
}

export const headerCenteredTabsBrand = <Message>(
  props: HeaderCenteredTabsBrandProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-brand-section py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-secondary_on-brand md:text-md")],
                [props.eyebrow],
              ),
              h.h1(
                [
                  h.Class(
                    "mt-3 text-display-md font-semibold text-primary_on-brand md:text-display-lg",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-6 md:text-xl")],
                [props.description],
              ),
              h.div(
                [h.Class("mt-8 self-stretch sm:self-center md:mt-12")],
                [
                  tabs(
                    {
                      ariaLabel: props.heading,
                      className:
                        "w-full md:w-auto [&_[role=tab]]:flex-1 [&_[role=tab]]:text-secondary_on-brand [&_[role=tab]]:hover:bg-white/10 [&_[role=tab]]:selected:bg-brand-primary_alt [&_[role=tab]]:selected:text-brand-secondary",
                      id: props.tabsId,
                      items: props.tabs.map((tab) => ({
                        focusMessage: props.onTab(tab.id),
                        id: tab.id,
                        label: tab.label,
                        selectMessage: props.onTab(tab.id),
                      })),
                      selectedId: props.selectedTabId,
                      size: "md",
                      type: "button-gray",
                    },
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
