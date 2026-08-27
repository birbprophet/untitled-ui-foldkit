/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/prefer-option-over-null, unicorn/no-nested-ternary -- Shared footer primitives for Untitled UI marketing footers. */
import type { BrandLockup } from "../internal/brand.ts";
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export interface MarketingFooterLink {
  readonly badgeLabel?: string;
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface MarketingFooterNavCategory {
  readonly id: string;
  readonly items: readonly MarketingFooterLink[];
  readonly label: string;
}

export interface MarketingFooterSocial {
  readonly href: string;
  readonly icon: MarketingFooterSocialIcon;
  readonly id: string;
  readonly label: string;
}

export type MarketingFooterSocialIcon =
  | "angelList"
  | "dribbble"
  | "facebook"
  | "github"
  | "layers"
  | "linkedin"
  | "x";

export interface MarketingFooterNewsletterProps<Message> {
  readonly email: string;
  readonly emailHint?: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly formId: string;
  readonly onEmailInput: (value: string) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly subscribeLabel: string;
}

export const marketingFooterQuickLinks = [
  { href: "#overview", id: "overview", label: "Overview" },
  { href: "#features", id: "features", label: "Features" },
  { href: "#pricing", id: "pricing", label: "Pricing" },
  { href: "#careers", id: "careers", label: "Careers" },
  { href: "#help", id: "help", label: "Help" },
  { href: "#privacy", id: "privacy", label: "Privacy" },
] as const satisfies readonly MarketingFooterLink[];

export const marketingFooterLegalLinks = [
  { href: "#terms", id: "terms", label: "Terms" },
  { href: "#privacy", id: "privacy", label: "Privacy" },
  { href: "#cookies", id: "cookies", label: "Cookies" },
] as const satisfies readonly MarketingFooterLink[];

export const marketingFooterNavCategories = [
  {
    id: "product",
    items: [
      { href: "#overview", id: "overview", label: "Overview" },
      { href: "#features", id: "features", label: "Features" },
      { badgeLabel: "New", href: "#solutions", id: "solutions", label: "Solutions" },
      { href: "#tutorials", id: "tutorials", label: "Tutorials" },
      { href: "#pricing", id: "pricing", label: "Pricing" },
      { href: "#releases", id: "releases", label: "Releases" },
    ],
    label: "Product",
  },
  {
    id: "company",
    items: [
      { href: "#about", id: "about", label: "About us" },
      { href: "#careers", id: "careers", label: "Careers" },
      { href: "#press", id: "press", label: "Press" },
      { href: "#news", id: "news", label: "News" },
      { href: "#media-kit", id: "media-kit", label: "Media kit" },
      { href: "#contact", id: "contact", label: "Contact" },
    ],
    label: "Company",
  },
  {
    id: "resources",
    items: [
      { href: "#blog", id: "blog", label: "Blog" },
      { href: "#newsletter", id: "newsletter", label: "Newsletter" },
      { href: "#events", id: "events", label: "Events" },
      { href: "#help-centre", id: "help-centre", label: "Help centre" },
      { href: "#tutorials", id: "tutorials", label: "Tutorials" },
      { href: "#support", id: "support", label: "Support" },
    ],
    label: "Resources",
  },
  {
    id: "use-cases",
    items: [
      { href: "#startups", id: "startups", label: "Startups" },
      { href: "#enterprise", id: "enterprise", label: "Enterprise" },
      { href: "#government", id: "government", label: "Government" },
      { href: "#saas", id: "saas", label: "SaaS centre" },
      { href: "#marketplaces", id: "marketplaces", label: "Marketplaces" },
      { href: "#ecommerce", id: "ecommerce", label: "Ecommerce" },
    ],
    label: "Use cases",
  },
  {
    id: "social",
    items: [
      { href: "#x", id: "x", label: "X" },
      { href: "#linkedin", id: "linkedin", label: "LinkedIn" },
      { href: "#facebook", id: "facebook", label: "Facebook" },
      { href: "#github", id: "github", label: "GitHub" },
      { href: "#angellist", id: "angellist", label: "AngelList" },
      { href: "#dribbble", id: "dribbble", label: "Dribbble" },
    ],
    label: "Social",
  },
  {
    id: "legal",
    items: [
      { href: "#terms", id: "terms", label: "Terms" },
      { href: "#privacy", id: "privacy", label: "Privacy" },
      { href: "#cookies", id: "cookies", label: "Cookies" },
      { href: "#licenses", id: "licenses", label: "Licenses" },
      { href: "#settings", id: "settings", label: "Settings" },
      { href: "#contact", id: "contact", label: "Contact" },
    ],
    label: "Legal",
  },
] as const satisfies readonly MarketingFooterNavCategory[];

export const marketingFooterSocials = [
  { href: "https://x.com/", icon: "x", id: "x", label: "X" },
  { href: "https://www.linkedin.com/", icon: "linkedin", id: "linkedin", label: "LinkedIn" },
  { href: "https://www.facebook.com/", icon: "facebook", id: "facebook", label: "Facebook" },
  { href: "https://github.com/", icon: "github", id: "github", label: "GitHub" },
  { href: "https://angel.co/", icon: "angelList", id: "angellist", label: "AngelList" },
  { href: "https://dribbble.com/", icon: "dribbble", id: "dribbble", label: "Dribbble" },
  { href: "https://layers.com/", icon: "layers", id: "layers", label: "Layers" },
] as const satisfies readonly MarketingFooterSocial[];

const socialIconPaths: Record<MarketingFooterSocialIcon, string> = {
  angelList:
    "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z",
  dribbble:
    "M12 0C5.37527 0 0 5.37527 0 12C0 18.6248 5.37527 24 12 24C18.6117 24 24 18.6248 24 12C24 5.37527 18.6117 0 12 0ZM19.9262 5.53145C21.3579 7.27549 22.217 9.50107 22.243 11.9089C21.9046 11.8438 18.5206 11.154 15.1106 11.5835C15.0325 11.4143 14.9675 11.2321 14.8894 11.0499C14.6811 10.5554 14.4469 10.0477 14.2126 9.56617C17.9869 8.0304 19.705 5.81779 19.9262 5.53145ZM12 1.77007C14.603 1.77007 16.9848 2.74621 18.7939 4.34708C18.6117 4.60738 17.0629 6.67679 13.4186 8.04337C11.7397 4.95878 9.87855 2.43384 9.5922 2.04338C10.3601 1.86117 11.1671 1.77007 12 1.77007ZM7.63995 2.73319C7.91325 3.09761 9.73538 5.63558 11.4404 8.65508C6.65076 9.9306 2.42083 9.90458 1.96529 9.90458C2.62906 6.72885 4.77657 4.08676 7.63995 2.73319ZM1.74404 12.0131C1.74404 11.9089 1.74404 11.8048 1.74404 11.7007C2.18655 11.7136 7.15835 11.7787 12.2733 10.243C12.5727 10.8156 12.846 11.4013 13.1063 11.987C12.9761 12.026 12.8329 12.0651 12.7028 12.1041C7.41865 13.8091 4.60738 18.4685 4.3731 18.859C2.7462 17.0499 1.74404 14.6421 1.74404 12.0131ZM12 22.256C9.6312 22.256 7.44469 21.449 5.71366 20.0954C5.89588 19.718 7.97827 15.7094 13.757 13.692C13.783 13.679 13.7961 13.679 13.8221 13.666C15.2668 17.4013 15.8525 20.5379 16.0087 21.436C14.7722 21.9696 13.4186 22.256 12 22.256ZM17.7137 20.4989C17.6096 19.8742 17.0629 16.8807 15.7223 13.1974C18.9371 12.6898 21.7484 13.5228 22.0998 13.6399C21.6573 16.4902 20.0174 18.9501 17.7137 20.4989Z",
  facebook:
    "M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z",
  github:
    "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.0.105-.78.405-1.305.99-.975.09-1.995-.39-2.805-1.125-.945-.99-1.335-1.26-1.95-1.26-.975 0-.015.75 0 1.5.165.78 1.365 1.395 1.875 1.815C4.58 18.885 3 17.1 3 14.625c0-1.125.375-2.085 1.005-2.85-.09-.255-.45-1.29.105-2.685 0 0 .825-.27 2.7 1.05.78-.225 1.605-.345 2.46-.345.855 0 1.68.12 2.46.345 1.875-1.32 2.7-1.05 2.7-1.05.555 1.395.195 2.43.105 2.685.63.765.99 1.725.99 2.85 0 2.475-1.59 4.26-3.975 4.65.315.27.6.81.6 1.635 0 1.185-.015 2.13-.015 2.415 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z",
  layers:
    "M12 2 2 7l10 5 10-5-10-5Zm0 8.5L4.5 7.5 12 4l7.5 3.5L12 10.5Zm-8 2.5 8 4.5 8-4.5v5L12 22l-8-4.5v-5Z",
  linkedin:
    "M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5563 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2938 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z",
  x: "M15.9455 22L10.396 14.0901L3.44886 22H0.509766L9.09209 12.2311L0.509766 0H8.05571L13.286 7.45502L19.8393 0H22.7784L14.5943 9.31648L23.4914 22H15.9455ZM19.2185 19.77H17.2398L4.71811 2.23H6.6971L11.7121 9.25316L12.5793 10.4719L19.2185 19.77Z",
};

interface MarketingFooterThemeSpec {
  readonly bg: string;
  readonly border: string;
  readonly buttonClass: string;
  readonly buttonColor: "link-color" | "link-gray";
  readonly copyright: string;
  readonly description: string;
  readonly heading: string;
  readonly legalLink: string;
  readonly logoText: string;
  readonly navHeading: string;
  readonly newsletterBand: string;
  readonly socialIcon: string;
  readonly subheading: string;
}

export const marketingFooterTheme = (brand: boolean): MarketingFooterThemeSpec =>
  brand
    ? {
        bg: "bg-brand-section",
        border: "border-brand_alt",
        buttonClass: "max-h-5 gap-1 text-footer-button-fg hover:text-footer-button-fg_hover",
        buttonColor: "link-color",
        copyright: "text-sm text-quaternary_on-brand",
        description: "text-md text-tertiary_on-brand",
        heading: "text-display-xs font-semibold text-primary_on-brand md:text-display-sm",
        legalLink:
          "rounded-xs text-sm text-quaternary_on-brand outline-focus-ring transition duration-100 ease-linear hover:text-tertiary_on-brand focus-visible:outline-2 focus-visible:outline-offset-2",
        logoText: "text-lg font-semibold text-primary_on-brand",
        navHeading: "text-sm font-semibold text-quaternary_on-brand",
        newsletterBand: "bg-brand-section",
        socialIcon:
          "flex rounded-xs text-icon-fg-brand_on-brand outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
        subheading: "text-md text-tertiary_on-brand md:text-xl",
      }
    : {
        bg: "bg-bg-primary",
        border: "border-border-secondary",
        buttonClass: "max-h-5 gap-1",
        buttonColor: "link-gray",
        copyright: "text-sm text-text-quaternary",
        description: "text-md text-text-tertiary",
        heading: "text-display-xs font-semibold text-text-primary md:text-display-sm",
        legalLink:
          "rounded-xs text-sm text-text-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-text-tertiary focus-visible:outline-2 focus-visible:outline-offset-2",
        logoText: "text-lg font-semibold text-text-primary",
        navHeading: "text-sm font-semibold text-text-quaternary",
        newsletterBand: "bg-bg-secondary_alt",
        socialIcon:
          "flex rounded-xs text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
        subheading: "text-md text-text-tertiary md:text-xl",
      };

export const marketingFooterLogo = <Message>(
  logo: BrandLockup,
  brand: boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.span(
    [h.Class("flex h-7 w-min shrink-0 items-center gap-2")],
    [
      h.img([h.Alt(logo.mark.alt), h.Class("size-7 rounded-md"), h.Src(logo.mark.src)]),
      ...(logo.wordmarkSrc === undefined
        ? logo.text === undefined
          ? []
          : [h.span([h.Class(marketingFooterTheme(brand).logoText)], [logo.text])]
        : [h.img([h.Class("h-4.5 w-auto"), h.Src(logo.wordmarkSrc)])]),
    ],
  );

export const marketingFooterLogoMinimal = <Message>(
  logo: BrandLockup,
  h: HtmlBuilder<Message>,
): Html =>
  h.img([h.Alt(logo.mark.alt), h.Class("size-10 rounded-md drop-shadow"), h.Src(logo.mark.src)]);

const socialSvg = <Message>(social: MarketingFooterSocial, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaLabel(social.label),
      h.Class("size-5"),
      h.Fill("none"),
      h.ViewBox(social.icon === "x" ? "0 0 24 22" : "0 0 24 24"),
    ],
    [
      h.path([
        ...(social.icon === "dribbble" ? [h.ClipRule("evenodd"), h.FillRule("evenodd")] : []),
        h.D(socialIconPaths[social.icon]),
        h.Fill("currentColor"),
      ]),
    ],
  );

export const marketingFooterSocialList = <Message>(
  socials: readonly MarketingFooterSocial[],
  brand: boolean,
  onSocial: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.ul(
    [h.Class("flex gap-4")],
    socials.map((social) =>
      h.keyed("li")(
        social.id,
        [],
        [
          h.a(
            [
              h.Class(marketingFooterTheme(brand).socialIcon),
              h.Href(social.href),
              h.Rel("noopener noreferrer"),
              h.Target("_blank"),
              ...(onSocial === undefined ? [] : [h.OnClick(onSocial(social.id))]),
            ],
            [socialSvg(social, h)],
          ),
        ],
      ),
    ),
  );

export const marketingFooterLegalList = <Message>(
  links: readonly MarketingFooterLink[],
  brand: boolean,
  onLink: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.ul(
    [h.Class("flex gap-3")],
    links.map((link) =>
      h.keyed("li")(
        link.id,
        [],
        [
          h.a(
            [
              h.Class(marketingFooterTheme(brand).legalLink),
              h.Href(link.href),
              ...(onLink === undefined ? [] : [h.OnClick(onLink(link.id))]),
            ],
            [link.label],
          ),
        ],
      ),
    ),
  );

export const marketingFooterQuickNav = <Message>(
  links: readonly MarketingFooterLink[],
  brand: boolean,
  onLink: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html => {
  const theme = marketingFooterTheme(brand);
  return h.nav(
    [],
    [
      h.ul(
        [h.Class("grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-[repeat(6,max-content)]")],
        links.map((link) =>
          h.keyed("li")(
            link.id,
            [h.Class("flex")],
            [
              button(
                {
                  className: theme.buttonClass,
                  color: theme.buttonColor,
                  href: link.href,
                  label: link.label,
                  onPress: onLink?.(link.id),
                  size: "md",
                },
                h,
              ),
            ],
          ),
        ),
      ),
    ],
  );
};

export const marketingFooterNavGrid = <Message>(
  categories: readonly MarketingFooterNavCategory[],
  columns: 3 | 5,
  brand: boolean,
  onLink: ((id: string) => Message) | undefined,
  h: HtmlBuilder<Message>,
): Html => {
  const theme = marketingFooterTheme(brand);
  return h.nav(
    [h.Class("flex-1")],
    [
      h.ul(
        [
          h.Class(
            `grid flex-1 grid-cols-2 gap-8 ${columns === 5 ? "md:grid-cols-5" : "md:grid-cols-3"}`,
          ),
        ],
        categories.map((category) =>
          h.keyed("li")(
            category.id,
            [],
            [
              h.h4([h.Class(theme.navHeading)], [category.label]),
              h.ul(
                [h.Class("mt-4 flex flex-col gap-3")],
                category.items.map((item) =>
                  h.keyed("li")(
                    item.id,
                    [h.Class("flex")],
                    [
                      item.badgeLabel === undefined
                        ? button(
                            {
                              className: theme.buttonClass,
                              color: theme.buttonColor,
                              href: item.href,
                              label: item.label,
                              onPress: onLink?.(item.id),
                              size: "md",
                            },
                            h,
                          )
                        : h.a(
                            [
                              h.Class(`flex max-h-5 items-center gap-1 ${theme.buttonClass}`),
                              h.Href(item.href),
                              ...(onLink === undefined ? [] : [h.OnClick(onLink(item.id))]),
                            ],
                            [
                              h.span([h.Class("text-sm font-semibold")], [item.label]),
                              badge(
                                {
                                  color: "gray",
                                  label: item.badgeLabel,
                                  size: "sm",
                                  type: "modern",
                                },
                                h,
                              ),
                            ],
                          ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );
};

export const marketingFooterNewsletterForm = <Message>(
  props: MarketingFooterNewsletterProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.form(
    [
      h.Class("flex w-full flex-col gap-4 sm:flex-row md:max-w-100"),
      h.Id(props.formId),
      h.OnSubmit(props.onSubscribe),
    ],
    [
      h.div(
        [h.Class("flex-1")],
        [
          input(
            {
              isRequired: true,
              label: props.emailLabel,
              name: "email",
              onInput: props.onEmailInput,
              placeholder: props.emailPlaceholder,
              size: "lg",
              type: "email",
              value: props.email,
            },
            h,
          ),
        ],
      ),
      button({ label: props.subscribeLabel, size: "lg", type: "submit" }, h),
    ],
  );

export const marketingFooterPlayIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5"), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D(
          "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-13.5v7l5.25 3.15-.75-6.45L17.25 9 12 8.5Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );
