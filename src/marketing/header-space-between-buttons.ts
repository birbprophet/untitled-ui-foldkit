/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { button } from "../base/button.ts";

export interface HeaderSpaceBetweenButtonsProps<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export const headerSpaceBetweenButtons = <Message>(
  props: HeaderSpaceBetweenButtonsProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mb-3 text-sm font-semibold text-text-brand-secondary md:text-md")],
            [props.eyebrow],
          ),
          h.div(
            [h.Class("grid grid-cols-[minmax(auto,768px)] gap-x-16 lg:grid-cols-[1fr_480px]")],
            [
              h.h1(
                [h.Class("text-display-md font-semibold text-text-primary md:text-display-lg")],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl lg:mt-3 lg:h-0")],
                [props.description],
              ),
              h.div(
                [h.Class("mt-8 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row")],
                [
                  button(
                    {
                      color: "secondary",
                      label: props.secondaryLabel,
                      onPress: props.onSecondary,
                      size: "xl",
                    },
                    h,
                  ),
                  button({ label: props.primaryLabel, onPress: props.onPrimary, size: "xl" }, h),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
