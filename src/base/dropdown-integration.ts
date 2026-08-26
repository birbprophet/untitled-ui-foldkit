/* oxlint-disable @rikalabs/no-low-signal-variable-names, @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, mps/imperative-loops, mps/no-length-comparison -- The fixed upstream integration menu uses controlled FoldKit messages and DOM-order roving focus. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { integrationIcon } from "../internal/integration-icons.ts";
import type { IntegrationIconName } from "../internal/integration-icons.ts";

export interface DropdownIntegrationProps<Message> {
  readonly focusedId: string;
  readonly isOpen: boolean;
  readonly onClose: NoInfer<Message>;
  readonly onFocus: (id: string) => NoInfer<Message>;
  readonly onSelect: (id: string) => NoInfer<Message>;
  readonly onToggle: NoInfer<Message>;
}

type ItemIcon = IntegrationIconName | "copy" | "terminal";

interface MenuItem {
  readonly icon: ItemIcon;
  readonly id: string;
  readonly label: string;
}

const sections: readonly (readonly MenuItem[])[] = [
  [
    { icon: "terminal", id: "view-markdown", label: "View as markdown" },
    { icon: "copy", id: "copy-markdown", label: "Copy as markdown" },
  ],
  [
    { icon: "v0", id: "v0", label: "Open in v0" },
    { icon: "claude", id: "claude", label: "Open in Claude" },
    { icon: "bolt", id: "bolt", label: "Open in Bolt" },
    { icon: "lovable", id: "lovable", label: "Open in Lovable" },
    { icon: "cursor", id: "cursor", label: "Open in Cursor" },
    { icon: "chatgpt", id: "chatgpt", label: "Open in ChatGPT" },
    { icon: "perplexity", id: "perplexity", label: "Open in Perplexity" },
    { icon: "gemini", id: "gemini", label: "Open in Gemini" },
  ],
  [
    { icon: "figma", id: "figma", label: "Open in Figma" },
    { icon: "github", id: "github", label: "Create GitHub Gist" },
  ],
];

const allItems = sections.flat();
const selectorFor = (id: string): string => `[data-dropdown-integration-item="${id}"]`;

const moveFocus = <Message>(
  props: DropdownIntegrationProps<Message>,
  current: string,
  key: string,
) => {
  const index = allItems.findIndex((item) => item.id === current);
  let delta = 0;
  if (key === "ArrowDown") {
    delta = 1;
  } else if (key === "ArrowUp") {
    delta = -1;
  }
  if (delta === 0 || index === -1) {
    return Option.none();
  }
  const target = allItems[(index + delta + allItems.length) % allItems.length];
  return target === undefined
    ? Option.none()
    : Option.some({ focusSelector: selectorFor(target.id), message: props.onFocus(target.id) });
};

const outlineIcon = <Message>(
  path: string,
  h: HtmlBuilder<Message>,
  className = "mr-2 size-4 shrink-0 stroke-[2.25px] text-fg-quaternary",
): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(className),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D(path)])],
  );

const itemIcon = <Message>(icon: ItemIcon, h: HtmlBuilder<Message>): Html => {
  if (icon === "terminal") {
    return outlineIcon(
      "m7 15 3-3-3-3m6 6h4m-9.2 6h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21Z",
      h,
    );
  }
  if (icon === "copy") {
    return outlineIcon(
      "M5 15c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C2 13.398 2 12.932 2 12V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 2 4.08 2 5.2 2H12c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C15 3.602 15 4.068 15 5m-2.8 17h6.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 20.48 22 19.92 22 18.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 9 19.92 9 18.8 9h-6.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C9 10.52 9 11.08 9 12.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C10.52 22 11.08 22 12.2 22Z",
      h,
    );
  }
  return integrationIcon(icon, h);
};

const menuItem = <Message>(
  value: MenuItem,
  props: DropdownIntegrationProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class("group block w-full cursor-pointer px-1.5 py-px text-left outline-none"),
      h.Type("button"),
      h.Role("menuitem"),
      h.Tabindex(value.id === props.focusedId ? 0 : -1),
      h.DataAttribute("dropdown-integration-item", value.id),
      h.OnClick(props.onSelect(value.id)),
      h.OnFocus(props.onFocus(value.id)),
      h.OnKeyDownFocus((key) => moveFocus(props, value.id, key)),
      h.OnKeyDownPreventDefault((key) =>
        key === "Escape" ? Option.some(props.onClose) : Option.none(),
      ),
    ],
    [
      h.span(
        [
          h.Class(
            `relative flex items-center rounded-md px-2.5 py-2 outline-focus-ring transition duration-100 ease-linear group-hover:bg-bg-primary-hover group-focus-visible:bg-bg-primary-hover group-focus-visible:outline-2 group-focus-visible:-outline-offset-2 ${value.id === props.focusedId && props.isOpen ? "bg-bg-primary-hover outline-2 -outline-offset-2" : ""}`,
          ),
        ],
        [
          itemIcon(value.icon, h),
          h.span(
            [h.Class("grow truncate text-sm font-semibold text-text-secondary")],
            [value.label],
          ),
        ],
      ),
    ],
  );

const chevronDown = <Message>(h: HtmlBuilder<Message>): Html =>
  outlineIcon("m6 9 6 6 6-6", h, "size-4 shrink-0 stroke-[2.25px] text-current/70");

export const dropdownIntegration = <Message>(
  props: DropdownIntegrationProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative inline-flex")],
    [
      h.button(
        [
          h.Class(
            "group relative inline-flex h-max cursor-pointer items-center justify-center gap-1 rounded-lg bg-bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-text-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
          ),
          h.Type("button"),
          h.AriaHasPopup("menu"),
          h.AriaExpanded(props.isOpen),
          h.OnClick(props.onToggle),
          h.Style({ "anchor-name": "--dropdown-integration-trigger" }),
        ],
        [h.span([h.Class("px-0.5")], ["Copy"]), chevronDown(h)],
      ),
      ...(props.isOpen
        ? [h.div([h.AriaHidden(true), h.Class("fixed inset-0 z-10"), h.OnClick(props.onClose)])]
        : []),
      h.div(
        [
          h.Class(
            `${props.isOpen ? "" : "hidden"} fixed z-20 w-54 origin-top-right overflow-auto rounded-lg bg-bg-primary shadow-lg ring-1 ring-border-secondary-alt`,
          ),
          h.Style({
            "position-anchor": "--dropdown-integration-trigger",
            right: "min(anchor(right), calc(100vw - 13.5rem - 0.75rem))",
            top: "calc(anchor(bottom) + 0.5rem)",
          }),
        ],
        [
          h.div(
            [h.Class("h-min overflow-y-auto py-1 outline-none select-none"), h.Role("menu")],
            sections.flatMap((section, index) => [
              ...section.map((value) => menuItem(value, props, h)),
              ...(index === sections.length - 1
                ? []
                : [h.hr([h.Class("my-1 h-px w-full border-0 bg-border-secondary")])]),
            ]),
          ),
        ],
      ),
    ],
  );
