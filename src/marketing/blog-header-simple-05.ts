/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription retains the upstream input placeholder CSS modifier and responsive source branch. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { tabs } from "../application/tabs.ts";

export interface BlogHeaderSimple05Article {
  readonly author: {
    readonly href: string;
    readonly name: string;
  };
  readonly category: {
    readonly href: string;
    readonly name: string;
  };
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSimple05Category {
  readonly id: string;
  readonly label: string;
}

export interface BlogHeaderSimple05Props<Message> {
  readonly articles: readonly BlogHeaderSimple05Article[];
  readonly categories: readonly BlogHeaderSimple05Category[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onCategorySelect: (id: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly page: number;
  readonly privacyHref: string;
  readonly selectedCategoryId: string;
  readonly subscribeDesktopLabel: string;
  readonly subscribeMobileLabel: string;
  readonly totalPages: number;
}

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        "pointer-events-none size-5 shrink-0 text-fg-brand-secondary-alt transition-inherit-all group-hover:text-fg-brand-secondary-hover",
      ),
      h.DataAttribute("icon", "trailing"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M7 17 17 7M7 7h10v10")])],
  );

const readPost = <Message>(
  article: BlogHeaderSimple05Article,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "group relative inline-flex h-max cursor-pointer items-center justify-normal gap-1.5 rounded p-0! text-md font-semibold whitespace-nowrap text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear before:absolute hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(article.href),
      h.OnClick(message),
    ],
    [
      h.span(
        [
          h.Class(
            "transition-inherit-all underline decoration-transparent underline-offset-4 hover:decoration-fg-brand-secondary-alt",
          ),
          h.DataAttribute("text", ""),
        ],
        ["Read post"],
      ),
      arrowUpRight(h),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderSimple05Article,
  messageForArticle: (id: string) => Message,
  messageForAuthor: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.div(
        [h.Class("relative overflow-hidden")],
        [
          h.a(
            [
              h.Class(
                "relative w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
              ),
              h.Href(article.href),
              h.OnClick(messageForArticle(article.id)),
              h.Tabindex(-1),
            ],
            [
              h.img([
                h.Alt(article.title),
                h.Class(
                  "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
                ),
                h.Src(article.thumbnailUrl),
              ]),
            ],
          ),
          h.div(
            [
              h.Class(
                "absolute inset-x-0 bottom-0 overflow-hidden bg-linear-to-b from-transparent to-black/40",
              ),
            ],
            [
              h.div(
                [
                  h.Class(
                    "relative flex items-start justify-between bg-alpha-white/30 p-4 backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-alpha-white/30 md:p-5",
                  ),
                ],
                [
                  h.div(
                    [],
                    [
                      h.a(
                        [
                          h.Class(
                            "block rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(article.author.href),
                          h.OnClick(messageForAuthor(article.id)),
                        ],
                        [article.author.name],
                      ),
                      h.time([h.Class("block text-sm text-white")], [article.publishedAt]),
                    ],
                  ),
                  h.a(
                    [
                      h.Class(
                        "rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(messageForArticle(article.id)),
                    ],
                    [article.category.name],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex flex-col items-start gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.a(
                [
                  h.Class(
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(article.category.href),
                  h.OnClick(messageForArticle(article.id)),
                ],
                [article.title],
              ),
              h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
            ],
          ),
          readPost(article, messageForArticle(article.id), h),
        ],
      ),
    ],
  );

const emailField = <Message>(
  props: BlogHeaderSimple05Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-1.5")],
    [
      h.div(
        [
          h.Class(
            "group/input relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-bg-primary py-0.5 shadow-xs ring-1 ring-border-primary transition-shadow duration-100 ease-linear ring-inset focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          h.input([
            h.AriaLabel(props.emailLabel),
            h.Class(
              "m-0 w-full bg-transparent px-3.5 py-2.5 text-md text-text-primary ring-0 outline-hidden placeholder:text-text-placeholder autofill:rounded-lg autofill:text-text-primary disabled:cursor-not-allowed",
            ),
            h.Name("email"),
            h.OnInput(props.onEmailInput),
            h.Placeholder(props.emailPlaceholder),
            h.Required(true),
            h.Type("email"),
            h.Value(props.email),
          ]),
        ],
      ),
      h.span(
        [h.Class("self-start text-sm text-text-tertiary")],
        [
          "We care about your data in our ",
          h.a(
            [
              h.Class(
                "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(props.privacyHref),
            ],
            ["privacy policy"],
          ),
          ".",
        ],
      ),
    ],
  );

const submitButton = <Message>(
  props: BlogHeaderSimple05Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-bg-brand-solid px-4.5 py-3 text-md font-semibold whitespace-nowrap text-white shadow-xs-skeuomorphic ring-1 ring-transparent outline-focus-ring ring-inset transition duration-100 ease-linear before:absolute before:inset-px before:rounded-[7px] before:border before:border-white/12 before:mask-b-from-0% hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Type("submit"),
    ],
    [
      h.span([h.Class("hidden px-0.5 md:inline")], [props.subscribeDesktopLabel]),
      h.span([h.Class("inline px-0.5 md:hidden")], [props.subscribeMobileLabel]),
    ],
  );

const categorySelect = <Message>(
  props: BlogHeaderSimple05Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("w-full md:hidden")],
    [
      h.div(
        [h.Class("relative grid w-full items-center")],
        [
          h.select(
            [
              h.AriaLabel("Categories"),
              h.Class(
                "appearance-none rounded-lg bg-bg-primary py-2 pl-3 text-md font-medium text-text-primary shadow-xs ring-1 ring-border-primary outline-hidden transition duration-100 ease-linear ring-inset focus-visible:ring-2 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50",
              ),
              h.OnChange(props.onCategorySelect),
              h.Value(props.selectedCategoryId),
            ],
            props.categories.map((category) => h.option([h.Value(category.id)], [category.label])),
          ),
          h.svg(
            [
              h.AriaHidden(true),
              h.Class("pointer-events-none absolute right-3 size-4 text-fg-quaternary"),
              h.Fill("none"),
              h.ViewBox("0 0 20 20"),
            ],
            [
              h.path([
                h.D("m5.5 7.5 4.5 4.5 4.5-4.5"),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("1.67"),
              ]),
            ],
          ),
        ],
      ),
    ],
  );

export const blogHeaderSimple05 = <Message>(
  props: BlogHeaderSimple05Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-bg-secondary py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mb-3 text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.div(
                [h.Class("grid grid-cols-[minmax(1fr,768px)] gap-x-16 lg:grid-cols-[2fr_1fr]")],
                [
                  h.h2(
                    [h.Class("text-display-md font-semibold text-text-primary md:text-display-lg")],
                    [props.heading],
                  ),
                  h.p(
                    [
                      h.Class(
                        "mt-4 text-lg text-text-tertiary md:mt-6 md:text-xl lg:mt-3 lg:h-0 lg:w-120",
                      ),
                    ],
                    [props.description],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid grid-cols-1 items-start gap-4 self-stretch sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [emailField(props, h), submitButton(props, h)],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.main(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 py-16 md:px-8 md:py-24",
          ),
        ],
        [
          categorySelect(props, h),
          h.div(
            [h.Class("-m-1 hidden flex-1 self-start overflow-auto p-1 md:flex md:self-auto")],
            [
              tabs(
                {
                  ariaLabel: "Categories",
                  id: "blog-header-simple-05-categories",
                  items: props.categories.map((category) => ({
                    focusMessage: props.onCategorySelect(category.id),
                    id: category.id,
                    label: category.label,
                    selectMessage: props.onCategorySelect(category.id),
                  })),
                  selectedId: props.selectedCategoryId,
                  size: "md",
                  type: "button-gray",
                },
                h,
              ),
            ],
          ),
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-12")],
            props.articles
              .slice(0, 8)
              .map((article, index) =>
                h.keyed("li")(
                  article.id,
                  [h.Class(index >= 6 ? "hidden lg:list-item" : "")],
                  [articleCard(article, props.onArticle, props.onAuthor, h)],
                ),
              ),
          ),
          pagination(
            {
              messageForPage: props.onPage,
              page: props.page,
              total: props.totalPages,
              variant: "page-minimal-center",
            },
            h,
          ),
        ],
      ),
    ],
  );
