/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI content section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface ContentSectionRichText01Props<Message> {
  readonly authorAvatarSrc: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly copyLabel: string;
  readonly onCopyLink: NoInfer<Message>;
}

export const contentSectionRichText01 = <Message>(
  props: ContentSectionRichText01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
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
                  h.div(
                    [h.Class("flex gap-3")],
                    [
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
                      h.button(
                        [
                          h.Class(
                            "rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-quaternary",
                          ),
                          h.Type("button"),
                        ],
                        ["X"],
                      ),
                      h.button(
                        [
                          h.Class(
                            "rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-quaternary",
                          ),
                          h.Type("button"),
                        ],
                        ["Facebook"],
                      ),
                      h.button(
                        [
                          h.Class(
                            "rounded-lg border border-border-primary bg-bg-primary px-3.5 py-2.5 text-sm font-semibold text-text-quaternary",
                          ),
                          h.Type("button"),
                        ],
                        ["LinkedIn"],
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
