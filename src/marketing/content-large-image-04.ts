/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentLargeImage04Props<Message> {
  readonly authorAvatarSrc: string;
  readonly authorDate: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly copyLabel: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly heroAlt: string;
  readonly heroSrc: string;
  readonly onCopyLink: NoInfer<Message>;
}

export const contentLargeImage04Defaults = {
  authorAvatarSrc: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
  authorDate: "20 Jan 2027",
  authorName: "Olivia Rhye",
  authorRole: "Product Designer, Untitled",
  copyLabel: "Copy link",
  description:
    "How do you create compelling presentations that wow your colleagues and impress your managers?",
  eyebrow: "Design",
  heading: "What is Wireframing?",
  heroAlt: "Wireframing pattern",
  heroSrc: "https://www.untitledui.com/marketing/wireframing-pattern.webp",
} as const;

export const contentLargeImage04 = <Message>(
  props: ContentLargeImage04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("w-full bg-brand-section py-16 pb-32 md:pt-24 md:pb-40")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-240 flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-primary_on-brand md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h1(
                    [
                      h.Class(
                        "mt-3 text-display-md font-semibold text-tertiary_on-brand md:text-display-lg",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 max-w-3xl text-lg text-primary_on-brand md:mt-6 md:text-xl")],
                    [props.description],
                  ),
                  h.div(
                    [h.Class("mt-8 flex items-center gap-3 text-left")],
                    [
                      h.img([
                        h.Alt(props.authorName),
                        h.Class("size-12 rounded-full object-cover"),
                        h.Src(props.authorAvatarSrc),
                      ]),
                      h.div(
                        [],
                        [
                          h.p(
                            [h.Class("text-md font-semibold text-tertiary_on-brand")],
                            [props.authorName],
                          ),
                          h.p([h.Class("text-md text-primary_on-brand")], [props.authorDate]),
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
      h.div(
        [h.Class("mx-auto max-w-container px-4 pb-16 md:px-8 md:pb-24")],
        [
          h.img([
            h.Alt(props.heroAlt),
            h.Class("mx-auto -mt-16 h-60 w-full object-cover md:-mt-24 md:h-160"),
            h.Src(props.heroSrc),
          ]),
          h.div(
            [h.Class("mx-auto max-w-prose pt-16 md:max-w-180 md:pt-24")],
            [
              h.div(
                [h.Class("mx-auto prose md:prose-lg")],
                [
                  h.p(
                    [],
                    [
                      "Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis.",
                    ],
                  ),
                  h.p(
                    [],
                    [
                      "Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor.",
                    ],
                  ),
                  h.h2([], ["Introduction"]),
                  h.p(
                    [],
                    [
                      "Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae.",
                    ],
                  ),
                ],
              ),
              h.div(
                [
                  h.Class(
                    "-mt-px flex flex-col items-start justify-between gap-y-8 border-t border-border-secondary pt-6 md:flex-row",
                  ),
                ],
                [
                  h.div(
                    [h.Class("flex items-center gap-3 md:gap-4")],
                    [
                      h.img([
                        h.Alt(props.authorName),
                        h.Class("size-12 rounded-full object-cover md:size-14"),
                        h.Src(props.authorAvatarSrc),
                      ]),
                      h.div(
                        [],
                        [
                          h.p(
                            [h.Class("text-md font-semibold text-text-primary md:text-lg")],
                            [props.authorName],
                          ),
                          h.p([h.Class("text-md text-text-tertiary")], [props.authorRole]),
                        ],
                      ),
                    ],
                  ),
                  h.button(
                    [
                      h.Class(
                        "rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-secondary",
                      ),
                      h.OnClick(props.onCopyLink),
                      h.Type("button"),
                    ],
                    [props.copyLabel],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
