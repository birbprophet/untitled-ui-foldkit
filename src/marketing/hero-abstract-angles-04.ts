/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-unused-vars -- Direct FoldKit transcription of the authenticated Untitled UI header section. */
/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- Direct FoldKit transcription of the authenticated Untitled UI hero section. */
import type { Html, HtmlBuilder } from "foldkit/html";
import { button } from "../base/button.ts";
import { badgeGroup } from "../base/badges.ts";

export interface HeroAbstractAngles04Props<Message> {
  readonly description: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageUrl: string;
  readonly onPrimary: NoInfer<Message>;
  readonly onSecondary: NoInfer<Message>;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly navigation: Html;
  readonly badgeAddon: string;
  readonly badgeHref: string;
  readonly badgeLabel: string;
  readonly onBadge: NoInfer<Message>;
}

const playIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M2.2 2.863c0-1.251 1.372-2.018 2.438-1.362l8.348 5.136c1.015.625 1.015 2.101 0 2.726l-8.348 5.136C3.572 15.155 2.2 14.388 2.2 13.137V2.863Z",
        ),
        h.Fill("currentColor"),
      ]),
    ],
  );

export const heroAbstractAngles04 = <Message>(
  props: HeroAbstractAngles04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative overflow-hidden bg-bg-primary"), h.Dir("ltr")],
    [
      props.navigation,
      h.section(
        [h.Class("relative py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto w-full max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("flex max-w-5xl flex-col")],
                [
                  h.a(
                    [
                      h.Class(
                        "rounded-[10px] outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(props.badgeHref),
                      h.OnClick(props.onBadge),
                    ],
                    [
                      badgeGroup(
                        {
                          addonText: props.badgeAddon,
                          color: "brand",
                          iconTrailing: true,
                          label: props.badgeLabel,
                          size: "lg",
                          theme: "modern",
                        },
                        h,
                      ),
                    ],
                  ),
                  h.h1(
                    [
                      h.Class(
                        "text-display-md font-semibold text-text-primary md:text-display-lg lg:text-display-xl",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [
                      h.Class(
                        "mt-4 max-w-3xl text-lg text-balance text-text-tertiary md:mt-6 md:text-xl",
                      ),
                    ],
                    [props.description],
                  ),
                  h.div(
                    [
                      h.Class(
                        "mt-8 flex w-full flex-col-reverse items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start md:mt-12",
                      ),
                    ],
                    [
                      button(
                        {
                          color: "secondary",
                          iconLeadingElement: playIcon(h),
                          label: props.secondaryLabel,
                          onPress: props.onSecondary,
                          size: "xl",
                        },
                        h,
                      ),
                      button(
                        { label: props.primaryLabel, onPress: props.onPrimary, size: "xl" },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mx-auto mt-16 w-full max-w-container px-4 md:h-100 md:px-8")],
            [
              h.div(
                [h.Class("flex flex-col md:items-start")],
                [
                  h.div(
                    [
                      h.Class(
                        "mx-auto flex h-full w-full items-center justify-center md:max-h-105 md:w-full md:max-w-266 md:items-start lg:max-h-140",
                      ),
                    ],
                    [
                      h.div(
                        [
                          h.Class(
                            "size-full rounded-[9.03px] bg-bg-primary p-[0.9px] shadow-lg ring-[0.56px] ring-utility-neutral-300 ring-inset md:rounded-[28px] md:p-[3.5px] md:ring-[1.75px]",
                          ),
                        ],
                        [
                          h.div(
                            [
                              h.Class(
                                "size-full rounded-[7.9px] bg-bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[24.5px] md:p-1 md:shadow-modern-mockup-inner-lg",
                              ),
                            ],
                            [
                              h.div(
                                [
                                  h.Class(
                                    "relative size-full overflow-hidden rounded-[6.77px] bg-utility-neutral-50 ring-[0.56px] ring-utility-neutral-200 md:rounded-[21px] md:ring-[1.75px]",
                                  ),
                                ],
                                [
                                  h.img([
                                    h.Alt(props.imageAlt),
                                    h.Class("size-full object-cover"),
                                    h.Src(props.imageUrl),
                                  ]),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
