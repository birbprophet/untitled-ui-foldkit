/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The controlled renderer preserves the authenticated user-settings slideout anatomy. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { buttonUtility } from "../base/button-utility.ts";
import { input } from "../base/fields.ts";
import { select } from "../base/select.ts";

const cloudsUrl = new URL("user-settings-menu-assets/clouds.webp", import.meta.url).href;

export type UserSettingsMenuField = "email" | "firstName" | "lastName" | "username";
export type UserSettingsMenuLocale = "en-US" | "pt-BR";

export interface UserSettingsMenuCountry {
  readonly flagUrl: string;
  readonly id: string;
  readonly label: string;
  readonly labelPtBr?: string;
}

export interface UserSettingsMenuProps<Message> {
  readonly countries: readonly UserSettingsMenuCountry[];
  readonly email: string;
  readonly firstName: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly lastName: string;
  readonly locale: UserSettingsMenuLocale;
  readonly onArchive: NoInfer<Message>;
  readonly onCancel: NoInfer<Message>;
  readonly onCountryFocus: (countryId: string) => NoInfer<Message>;
  readonly onCountryOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly onCountrySelect: (countryId: string) => NoInfer<Message>;
  readonly onDismiss: NoInfer<Message>;
  readonly onEdit: NoInfer<Message>;
  readonly onFieldInput: (field: UserSettingsMenuField, value: string) => NoInfer<Message>;
  readonly onSave: NoInfer<Message>;
  readonly onUnmount: NoInfer<Message>;
  readonly selectedCountryId: string;
  readonly username: string;
}

const copy = {
  "en-US": {
    archive: "Archive",
    cancel: "Cancel",
    close: "Close",
    collections: "Collections",
    country: "Country",
    edit: "Edit",
    email: "Email",
    followers: "Followers",
    following: "Following",
    hint: "Estimates based on recent IP address.",
    lastName: "Last name",
    name: "Name",
    posts: "Posts",
    save: "Save",
    settings: "Slideout menu",
    username: "Username",
    verified: "Verified 2 Jan, 2027",
  },
  "pt-BR": {
    archive: "Arquivar",
    cancel: "Cancelar",
    close: "Fechar",
    collections: "Coleções",
    country: "País",
    edit: "Editar",
    email: "E-mail",
    followers: "Seguidores",
    following: "Seguindo",
    hint: "Estimativas com base no endereço IP recente.",
    lastName: "Sobrenome",
    name: "Nome",
    posts: "Publicações",
    save: "Salvar",
    settings: "Menu lateral",
    username: "Nome de usuário",
    verified: "Verificado em 2 jan. 2027",
  },
} as const;

const countryDisplayNames: Readonly<Record<UserSettingsMenuLocale, Intl.DisplayNames>> = {
  "en-US": new Intl.DisplayNames(["en-US"], { type: "region" }),
  "pt-BR": new Intl.DisplayNames(["pt-BR"], { type: "region" }),
};

const pathIcon = <Message>(path: string, className: string, h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.DataAttribute("icon", ""),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(path),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const archiveIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M4 7.997a2.295 2.295 0 0 1-.39-.035A2 2 0 0 1 2.038 6.39C2 6.197 2 5.965 2 5.5s0-.697.038-.89A2 2 0 0 1 3.61 3.038C3.803 3 4.035 3 4.5 3h15c.465 0 .697 0 .89.038a2 2 0 0 1 1.572 1.572c.038.193.038.425.038.89s0 .697-.038.89a2 2 0 0 1-1.572 1.572c-.107.02-.226.03-.39.035M10 13h4M4 8h16v8.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 21 16.88 21 15.2 21H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 18.72 4 17.88 4 16.2V8Z",
    "size-5",
    h,
  );
const checkCircleIcon = <Message>(className: string, h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z",
    className,
    h,
  );
const closeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon("M18 6 6 18M6 6l12 12", "size-5 shrink-0 transition-inherit-all", h);
const editIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "M2.876 18.116c.046-.414.069-.62.131-.814a2 2 0 0 1 .234-.485c.111-.17.259-.317.553-.61L17 3a2.828 2.828 0 1 1 4 4L7.794 20.206c-.294.294-.442.442-.611.553a2 2 0 0 1-.485.233c-.193.063-.4.086-.814.132L2.5 21.5l.376-3.384Z",
    "size-5",
    h,
  );
const mailIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  pathIcon(
    "m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z",
    "pointer-events-none size-5 shrink-0 text-fg-quaternary",
    h,
  );

const verifiedTick = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("z-10 size-4 shrink-0 text-utility-blue-500"),
      h.Fill("none"),
      h.ViewBox("0 0 10 10"),
    ],
    [
      h.path([
        h.Class("fill-current"),
        h.D(
          "M7.72237 1.77098C7.81734 2.00068 7.99965 2.18326 8.2292 2.27858L9.03413 2.61199C9.26384 2.70714 9.44635 2.88965 9.5415 3.11936C9.63665 3.34908 9.63665 3.60718 9.5415 3.83689L9.20833 4.64125C9.11313 4.87106 9.113 5.12943 9.20863 5.35913L9.54122 6.16325C9.58839 6.27702 9.61268 6.39897 9.6127 6.52214C9.61272 6.6453 9.58847 6.76726 9.54134 6.88105C9.4942 6.99484 9.42511 7.09823 9.33801 7.18531C9.2509 7.27238 9.14749 7.34144 9.03369 7.38854L8.22934 7.72171C7.99964 7.81669 7.81706 7.99899 7.72174 8.22855L7.38833 9.03348C7.29318 9.26319 7.11067 9.4457 6.88096 9.54085C6.65124 9.636 6.39314 9.636 6.16343 9.54085L5.35907 9.20767C5.12935 9.11276 4.87134 9.11295 4.64177 9.20821L3.83684 9.54115C3.60725 9.63608 3.34937 9.636 3.11984 9.54092C2.89032 9.44585 2.70791 9.26356 2.6127 9.03409L2.27918 8.22892C2.18421 7.99923 2.0019 7.81665 1.77235 7.72133L0.967421 7.38792C0.737807 7.29281 0.555355 7.11041 0.460169 6.88083C0.364983 6.65125 0.364854 6.39327 0.45981 6.16359L0.792984 5.35924C0.8879 5.12952 0.887707 4.87151 0.792445 4.64193L0.459749 3.83642C0.41258 3.72265 0.388291 3.60069 0.388272 3.47753C0.388252 3.35436 0.412501 3.2324 0.459634 3.11861C0.506767 3.00482 0.57586 2.90144 0.662965 2.81436C0.75007 2.72728 0.853479 2.65822 0.967283 2.61113L1.77164 2.27795C2.00113 2.18306 2.1836 2.00099 2.27899 1.7717L2.6124 0.966768C2.70755 0.737054 2.89006 0.554547 3.11978 0.459397C3.34949 0.364246 3.60759 0.364246 3.83731 0.459397L4.64166 0.792571C4.87138 0.887487 5.12939 0.887293 5.35897 0.792031L6.16424 0.459913C6.39392 0.364816 6.65197 0.364836 6.88164 0.459968C7.11131 0.555099 7.29379 0.737554 7.38895 0.967208L7.72247 1.77238L7.72237 1.77098Z",
        ),
      ]),
      h.path([
        h.ClipRule("evenodd"),
        h.D(
          "M6.95829 3.68932C7.02509 3.58439 7.04747 3.45723 7.02051 3.3358C6.99356 3.21437 6.91946 3.10862 6.81454 3.04182C6.70961 2.97502 6.58245 2.95264 6.46102 2.97959C6.33959 3.00655 6.23384 3.08064 6.16704 3.18557L4.33141 6.06995L3.49141 5.01995C3.41375 4.92281 3.30069 4.8605 3.17709 4.84673C3.05349 4.83296 2.92949 4.86885 2.83235 4.94651C2.73522 5.02417 2.67291 5.13723 2.65914 5.26083C2.64536 5.38443 2.68125 5.50843 2.75891 5.60557L4.00891 7.16807C4.0555 7.22638 4.11533 7.27271 4.18344 7.30323C4.25154 7.33375 4.32595 7.34757 4.40047 7.34353C4.47499 7.3395 4.54747 7.31773 4.61188 7.28004C4.67629 7.24234 4.73077 7.18981 4.77079 7.12682L6.95829 3.68932Z",
        ),
        h.Fill("white"),
        h.FillRule("evenodd"),
      ]),
    ],
  );

const divider = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("h-[2.5px] w-full")],
    [
      h.line([
        h.X1("1.2"),
        h.Y1("1.2"),
        h.X2("100%"),
        h.Y2("1.2"),
        h.Class("stroke-border-primary"),
        h.StrokeWidth("2.4"),
        h.StrokeDasharray("0,6"),
        h.StrokeLinecap("round"),
      ]),
    ],
  );

const profilePhoto = <Message>(name: string, seed: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative flex size-24 shrink-0 items-center justify-center rounded-full bg-bg-primary p-1 ring-1 ring-border-secondary-alt",
      ),
    ],
    [
      h.div(
        [
          h.Class(
            "relative size-full overflow-hidden rounded-full shadow-xl outline-[0.75px] -outline-offset-[0.75px] outline-black/16 before:absolute before:inset-0 before:rounded-full before:border-[1.5px] before:border-white/32 before:mask-[linear-gradient(to_bottom,black_0%,transparent_25%,transparent_75%,black_100%)]",
          ),
        ],
        [
          h.img([
            h.Alt(name),
            h.Class("size-full object-cover"),
            h.Src(
              blobatarDataUri(seed, {
                background: "circle",
                kind: "agent",
                size: 192,
                title: name,
              }),
            ),
          ]),
        ],
      ),
    ],
  );

const stat = <Message>(label: string, statValue: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("flex flex-col gap-0.5")],
    [
      h.dt([h.Class("text-xs font-medium text-text-quaternary")], [label]),
      h.dd([h.Class("text-md font-semibold text-text-primary")], [statValue]),
    ],
  );

const usernameField = <Message>(
  props: UserSettingsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const inputId = `${props.id}-username`;
  const labels = copy[props.locale];
  return h.div(
    [h.Class("relative flex flex-1 items-center")],
    [
      h.div(
        [h.Class("flex w-full flex-col gap-1.5")],
        [
          h.label(
            [h.Class("text-sm font-medium text-text-secondary"), h.For(inputId)],
            [labels.username, h.span([h.Class("text-text-brand-tertiary")], [" *"])],
          ),
          h.div(
            [
              h.Class(
                "relative flex h-max w-full flex-row justify-center rounded-lg bg-bg-primary",
              ),
            ],
            [
              h.span(
                [
                  h.Class(
                    "-mr-px flex rounded-l-lg px-3 py-2 text-md text-text-tertiary shadow-xs ring-1 ring-border-primary ring-inset",
                  ),
                ],
                ["siglata.com/@"],
              ),
              h.div(
                [
                  h.Class(
                    "z-10 flex min-w-0 flex-1 items-center rounded-r-lg bg-bg-primary px-3 py-2 shadow-xs ring-1 ring-border-primary ring-inset transition duration-100 focus-within:ring-2 focus-within:ring-border-brand",
                  ),
                ],
                [
                  h.input([
                    h.Class(
                      "min-w-0 flex-1 bg-transparent pr-6 text-md text-text-primary outline-none",
                    ),
                    h.Id(inputId),
                    h.Name("username"),
                    h.OnInput((value) => props.onFieldInput("username", value)),
                    h.Required(true),
                    h.Type("text"),
                    h.Value(props.username),
                  ]),
                  checkCircleIcon(
                    "absolute right-3 bottom-3 z-10 size-4 text-fg-success-primary",
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
};

const settingsForm = <Message>(
  props: UserSettingsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  return h.form(
    [h.Class("flex flex-col gap-4"), h.Id(`${props.id}-form`), h.OnSubmit(props.onSave)],
    [
      divider(h),
      h.div(
        [h.Class("flex items-end gap-4")],
        [
          h.div(
            [h.Class("min-w-0 flex-1")],
            [
              input(
                {
                  isRequired: true,
                  label: labels.name,
                  name: `${props.id}-firstname`,
                  onInput: (value) => props.onFieldInput("firstName", value),
                  size: "md",
                  value: props.firstName,
                },
                h,
              ),
            ],
          ),
          h.div(
            [h.Class("min-w-0 flex-1 [&>div>span:first-child]:hidden")],
            [
              input(
                {
                  isRequired: true,
                  label: labels.lastName,
                  name: `${props.id}-lastname`,
                  onInput: (value) => props.onFieldInput("lastName", value),
                  size: "md",
                  value: props.lastName,
                },
                h,
              ),
            ],
          ),
        ],
      ),
      divider(h),
      h.div(
        [h.Class("flex flex-1 flex-col gap-2")],
        [
          input(
            {
              isRequired: true,
              label: labels.email,
              leadingIconElement: mailIcon(h),
              name: `${props.id}-email`,
              onInput: (value) => props.onFieldInput("email", value),
              size: "md",
              type: "email",
              value: props.email,
            },
            h,
          ),
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              verifiedTick(h),
              h.p([h.Class("text-xs font-semibold text-utility-blue-600")], [labels.verified]),
            ],
          ),
        ],
      ),
      divider(h),
      usernameField(props, h),
      divider(h),
      select(
        {
          hint: labels.hint,
          isRequired: true,
          items: props.countries.map((country) => {
            const countryLabel =
              props.locale === "pt-BR"
                ? (country.labelPtBr ??
                  countryDisplayNames[props.locale].of(country.id) ??
                  country.label)
                : country.label;
            return {
              iconElement: h.img([
                h.Alt(""),
                h.Class("size-5 rounded-full"),
                h.Src(country.flagUrl),
              ]),
              id: country.id,
              label: countryLabel,
              onFocus: props.onCountryFocus(country.id),
              onSelect: props.onCountrySelect(country.id),
              supportingText: "UTC/GMT +10",
            };
          }),
          label: labels.country,
          name: `${props.id}-country`,
          onOpenChanged: props.onCountryOpenChanged,
          selectedId: props.selectedCountryId,
          size: "md",
        },
        h,
      ),
      divider(h),
    ],
  );
};

export const userSettingsMenu = <Message>(
  props: UserSettingsMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const labels = copy[props.locale];
  const profileName = `${props.firstName} ${props.lastName}`.trim();
  return h.div(
    [],
    props.isOpen
      ? [
          h.div(
            [
              h.Class(
                "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-end bg-overlay/70 pl-6 outline-hidden md:pl-10",
              ),
              h.DataAttribute("slideout-overlay", props.id),
            ],
            [
              h.button([
                h.AriaHidden(true),
                h.Class("fixed inset-0 cursor-default border-0 bg-transparent p-0"),
                h.OnClick(props.onDismiss),
                h.Tabindex(-1),
                h.Type("button"),
              ]),
              h.dialog(
                [
                  h.AriaLabel(labels.settings),
                  h.Dir("ltr"),
                  h.Class(
                    "fixed inset-y-0 !right-0 !left-auto m-0 h-full w-[calc(100%-24px)] max-w-100 overflow-hidden border-0 bg-bg-primary p-0 shadow-xl ring-1 ring-border-secondary-alt outline-hidden",
                  ),
                  h.Id(props.id),
                  h.Lang(props.locale),
                  h.OnCancel(props.onDismiss),
                  h.OnUnmount(props.onUnmount),
                  h.Style({ width: "calc(100% - 24px)" }),
                ],
                [
                  h.div(
                    [
                      h.Class(
                        "relative flex size-full flex-col items-start gap-6 overflow-y-auto bg-bg-primary outline-hidden",
                      ),
                    ],
                    [
                      h.header(
                        [h.Class("relative w-full")],
                        [
                          h.button(
                            [
                              h.AriaLabel(labels.close),
                              h.Autofocus(true),
                              h.Class(
                                "absolute top-3 right-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring transition duration-100 ease-linear hover:bg-white/20 hover:text-fg-white focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.DataAttribute("user-settings-menu-close", ""),
                              h.OnClick(props.onDismiss),
                              h.Type("button"),
                            ],
                            [closeIcon(h)],
                          ),
                          h.div(
                            [h.Class("px-2 pt-2")],
                            [
                              h.img([
                                h.AriaHidden(true),
                                h.Alt(""),
                                h.Class("h-32 w-full rounded-xl object-cover md:h-36"),
                                h.Src(cloudsUrl),
                              ]),
                            ],
                          ),
                          h.div(
                            [h.Class("relative -mt-12 flex flex-col gap-4 px-4 md:px-6")],
                            [
                              profilePhoto(profileName, "olivia-rhye", h),
                              h.div(
                                [h.Class("absolute top-14 right-4 flex gap-0.5 md:right-6")],
                                [
                                  buttonUtility(
                                    {
                                      color: "tertiary",
                                      icon: archiveIcon,
                                      onPress: props.onArchive,
                                      size: "xs",
                                      tooltip: labels.archive,
                                    },
                                    h,
                                  ),
                                  buttonUtility(
                                    {
                                      color: "tertiary",
                                      icon: editIcon,
                                      onPress: props.onEdit,
                                      size: "xs",
                                      tooltip: labels.edit,
                                    },
                                    h,
                                  ),
                                ],
                              ),
                              h.div(
                                [h.Class("flex flex-col items-start gap-4")],
                                [
                                  h.div(
                                    [h.Class("max-w-50 min-w-0 flex-1")],
                                    [
                                      h.div(
                                        [h.Class("flex items-center gap-1.5")],
                                        [
                                          h.p(
                                            [
                                              h.Class(
                                                "truncate text-lg font-semibold text-text-primary",
                                              ),
                                            ],
                                            [profileName],
                                          ),
                                          verifiedTick(h),
                                        ],
                                      ),
                                      h.p(
                                        [h.Class("truncate text-sm text-text-tertiary")],
                                        [`@${props.username}`],
                                      ),
                                    ],
                                  ),
                                  h.dl(
                                    [h.Class("flex items-center gap-4")],
                                    [
                                      stat(labels.followers, "32,086", h),
                                      h.hr([
                                        h.Class(
                                          "h-11 w-px rounded-full border-none bg-border-primary",
                                        ),
                                      ]),
                                      stat(labels.following, "4,698", h),
                                      h.hr([
                                        h.Class(
                                          "h-11 w-px rounded-full border-none bg-border-primary",
                                        ),
                                      ]),
                                      stat(labels.posts, "128", h),
                                      h.hr([
                                        h.Class(
                                          "h-11 w-px rounded-full border-none bg-border-primary",
                                        ),
                                      ]),
                                      stat(labels.collections, "24", h),
                                    ],
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
                            "flex size-full flex-col gap-6 overflow-y-auto overscroll-auto px-4 md:px-6",
                          ),
                        ],
                        [settingsForm(props, h)],
                      ),
                      h.footer(
                        [
                          h.Class(
                            "flex w-full items-center justify-end gap-3 p-4 shadow-[inset_0px_1px_0px_0px] shadow-border-secondary md:px-6",
                          ),
                        ],
                        [
                          button(
                            {
                              color: "secondary",
                              label: labels.cancel,
                              onPress: props.onCancel,
                              size: "sm",
                            },
                            h,
                          ),
                          button(
                            {
                              form: `${props.id}-form`,
                              label: labels.save,
                              size: "sm",
                              type: "submit",
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
          ),
        ]
      : [],
  );
};
