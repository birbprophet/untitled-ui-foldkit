/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary -- The account switcher is a fixed controlled collection. */
import { blobatarDataUri } from "avatar";
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

export interface DropdownAccountBreadcrumbProps<Message> {
  readonly focusedAccountId: string;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSelect: (id: "caitlyn" | "sienna") => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
  readonly selectedAccountId: "caitlyn" | "sienna";
}

const accounts = [
  { email: "caitlyn@siglata.com", id: "caitlyn", name: "Caitlyn King" },
  { email: "sienna@siglata.com", id: "sienna", name: "Sienna Hewitt" },
] as const;

const accountAvatar = <Message>(
  id: string,
  label: string,
  size: "sm" | "xs",
  h: HtmlBuilder<Message>,
): Html =>
  h.img([
    h.Alt(""),
    h.Class(
      `${size === "sm" ? "size-8 rounded-lg" : "size-6 rounded-md"} shrink-0 object-cover shadow-md outline-[0.5px] -outline-offset-[0.5px] outline-black/16`,
    ),
    h.Src(
      blobatarDataUri(`dropdown-account-${id}`, {
        background: "circle",
        kind: "agent",
        size: 128,
        title: label,
      }),
    ),
  ]);

const selector = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-3 shrink-0 stroke-3 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("m7 15 5 5 5-5M17 9l-5-5-5 5")])],
  );

const radio = <Message>(selected: boolean, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        `absolute top-2 right-2 flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${selected ? "bg-bg-brand-solid ring-border-brand" : "bg-bg-primary ring-border-primary"}`,
      ),
    ],
    selected ? [h.span([h.Class("size-1.5 rounded-full bg-fg-white")])] : [],
  );

export const dropdownAccountBreadcrumb = <Message>(
  props: DropdownAccountBreadcrumbProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const selectedAccount =
    accounts.find((account) => account.id === props.selectedAccountId) ?? accounts[0];
  const moveFocus = (id: string, key: string) => {
    const index = accounts.findIndex((account) => account.id === id);
    const delta = key === "ArrowDown" ? 1 : key === "ArrowUp" ? -1 : 0;
    if (index === -1 || delta === 0) {
      return Option.none();
    }
    const next = accounts[(index + delta + accounts.length) % accounts.length];
    return next === undefined
      ? Option.none()
      : Option.some({
          focusSelector: `[data-account-breadcrumb-item="${next.id}"]`,
          message: props.onFocus(next.id),
        });
  };
  return h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            `flex cursor-pointer items-center gap-1.5 rounded-lg outline-0 outline-offset-2 outline-focus-ring ${props.isOpen ? "outline-2" : ""}`,
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
        ],
        [
          h.span(
            [
              h.Class(
                "flex rounded-lg bg-bg-primary p-0.5 ring-[0.5px] ring-border-secondary ring-inset",
              ),
            ],
            [accountAvatar(selectedAccount.id, selectedAccount.name, "xs", h)],
          ),
          h.span([h.Class("text-sm font-semibold text-text-primary")], [selectedAccount.name]),
          selector(h),
        ],
      ),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} absolute top-full left-0 z-20 mt-2 w-62 origin-top-left overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Role("menu"),
        ],
        [
          h.div(
            [h.Class("flex flex-col gap-1 px-1.5 py-1.5")],
            accounts.map((account) => {
              const selected = props.selectedAccountId === account.id;
              return h.button(
                [
                  h.Class(
                    `relative w-full cursor-pointer rounded-md px-2 py-2 text-left outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? "bg-bg-primary-hover" : ""}`,
                  ),
                  h.Type("button"),
                  h.Role("menuitemradio"),
                  h.AriaChecked(selected),
                  h.Tabindex(props.focusedAccountId === account.id ? 0 : -1),
                  h.DataAttribute("account-breadcrumb-item", account.id),
                  h.OnFocus(props.onFocus(account.id)),
                  h.OnClick(props.onSelect(account.id)),
                  h.OnKeyDownFocus((key) => moveFocus(account.id, key)),
                  h.OnKeyDownPreventDefault((key) =>
                    key === "Escape" ? Option.some(props.onClose) : Option.none(),
                  ),
                ],
                [
                  h.figure(
                    [h.Class("group flex min-w-0 flex-1 items-center gap-1.5")],
                    [
                      h.span(
                        [
                          h.Class(
                            "flex rounded-[10px] bg-bg-primary p-0.5 ring-[0.5px] ring-border-secondary ring-inset",
                          ),
                        ],
                        [accountAvatar(account.id, account.name, "sm", h)],
                      ),
                      h.figcaption(
                        [h.Class("min-w-0 flex-1")],
                        [
                          h.p([h.Class("text-sm font-semibold text-text-primary")], [account.name]),
                          h.p([h.Class("truncate text-sm text-text-tertiary")], [account.email]),
                        ],
                      ),
                    ],
                  ),
                  radio(selected, h),
                ],
              );
            }),
          ),
        ],
      ),
    ],
  );
};
