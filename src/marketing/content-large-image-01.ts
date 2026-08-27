/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content layout. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentLargeImage01Props<Message> {
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

export const contentLargeImage01Defaults = {
  authorAvatarSrc: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
  authorDate: "20 Jan 2027",
  authorName: "Olivia Rhye",
  authorRole: "Product Designer, Untitled",
  copyLabel: "Copy link",
  description:
    "How do you create compelling presentations that wow your colleagues and impress your managers?",
  eyebrow: "Published 20 Jan 2027",
  heading: "UX review presentations",
  heroAlt: "Smiling girl",
  heroSrc: "https://www.untitledui.com/marketing/smiling-girl-5.webp",
} as const;

export const contentLargeImage01 = <Message>(
  props: ContentLargeImage01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 py-16 md:px-8 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-5xl flex-col items-center text-center")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h1(
                [
                  h.Class(
                    "mt-3 text-display-md font-semibold text-text-primary md:text-display-lg",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl")],
                [props.description],
              ),
              h.div(
                [h.Class("mt-8 flex gap-2")],
                [
                  h.span(
                    [
                      h.Class(
                        "rounded-full bg-bg-brand-primary px-3 py-1 text-sm font-medium text-text-brand-secondary",
                      ),
                    ],
                    ["Design"],
                  ),
                  h.span(
                    [
                      h.Class(
                        "rounded-full bg-utility-indigo-50 px-3 py-1 text-sm font-medium text-utility-indigo-700",
                      ),
                    ],
                    ["Research"],
                  ),
                  h.span(
                    [
                      h.Class(
                        "rounded-full bg-utility-pink-50 px-3 py-1 text-sm font-medium text-utility-pink-700",
                      ),
                    ],
                    ["Presentation"],
                  ),
                ],
              ),
              h.div(
                [h.Class("mt-8 flex items-center gap-3")],
                [
                  h.img([
                    h.Alt(props.authorName),
                    h.Class("size-14 rounded-full object-cover"),
                    h.Src(props.authorAvatarSrc),
                  ]),
                  h.div(
                    [],
                    [
                      h.p([h.Class("text-lg font-semibold text-text-primary")], [props.authorName]),
                      h.p([h.Class("text-md text-text-tertiary")], [props.authorDate]),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.img([
            h.Alt(props.heroAlt),
            h.Class("mt-12 h-60 w-full object-cover md:mt-16 md:h-160"),
            h.Src(props.heroSrc),
          ]),
        ],
      ),
      h.div(
        [h.Class("mx-auto max-w-container px-4 pb-16 md:px-8 md:pb-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-prose md:max-w-180")],
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
