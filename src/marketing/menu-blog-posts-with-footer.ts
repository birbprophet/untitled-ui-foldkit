/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI marketing menu. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import {
  marketingMenuBlogPostHorizontal,
  type MarketingMenuBlogPost,
} from "./marketing-menu-shared.ts";

export interface MenuBlogPostsWithFooterProps<Message> {
  readonly documentationLabel: string;
  readonly isFloating?: boolean;
  readonly isMobile?: boolean;
  readonly onDocumentation: NoInfer<Message>;
  readonly onPost: (id: string) => NoInfer<Message>;
  readonly onViewAllBlogPosts: NoInfer<Message>;
  readonly onViewAllPosts: NoInfer<Message>;
  readonly posts: readonly MarketingMenuBlogPost[];
  readonly viewAllBlogPostsLabel: string;
  readonly viewAllPostsLabel: string;
}

const chevronRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-4"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("m9 18 6-6-6-6"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

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
    [h.path([h.D("M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z")])],
  );

export const menuBlogPostsWithFooter = <Message>(
  props: MenuBlogPostsWithFooterProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const visiblePosts = props.isMobile === true ? props.posts.slice(0, 5) : props.posts;

  return h.section(
    [
      h.Class(
        `relative overflow-hidden bg-bg-primary md:shadow-lg ${props.isFloating === true ? "md:rounded-2xl md:ring-1 md:ring-border-secondary_alt" : ""}`,
      ),
      h.Dir("ltr"),
    ],
    [
      h.div([h.Class(`mx-auto max-w-container ${props.isFloating === true ? "md:px-5" : "md:px-8"}`)], [
        h.ul(
          [h.Class("grid grid-cols-1 gap-1 pt-2 pb-6 md:pt-5 lg:grid-cols-2 xl:grid-cols-3")],
          visiblePosts.map((post) =>
            h.li([h.keyed("li")(post.id, [], [marketingMenuBlogPostHorizontal(post, h)])]),
          ),
        ),
      ]),
      h.div([h.Class(`bg-bg-secondary ${props.isFloating === true ? "md:mx-2 md:mb-2 md:rounded-lg" : ""}`)], [
        h.div(
          [
            h.Class(
              `relative mx-auto flex max-w-container items-center justify-center md:justify-between ${props.isFloating === true ? "p-4" : "px-8 py-5"}`,
            ),
          ],
          [
            button(
              {
                className: "hidden md:inline-flex",
                color: "secondary",
                iconLeadingElement: bookOpenIcon(h),
                label: props.documentationLabel,
                onPress: props.onDocumentation,
                size: "md",
              },
              h,
            ),
            button(
              {
                className: "hidden md:inline-flex",
                color: "primary",
                label: props.viewAllPostsLabel,
                onPress: props.onViewAllPosts,
                size: "md",
              },
              h,
            ),
            h.a(
              [
                h.Class(
                  "inline-flex items-center gap-1 text-md font-semibold text-text-brand-secondary outline-focus-ring focus-visible:outline-2 md:hidden",
                ),
                h.Href("#"),
                h.OnClick(props.onViewAllBlogPosts),
              ],
              [props.viewAllBlogPostsLabel, chevronRight(h)],
            ),
          ],
        ),
      ]),
    ],
  );
};
