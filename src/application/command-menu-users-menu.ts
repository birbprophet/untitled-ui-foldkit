/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/no-length-comparison, mps/prefer-arr-match, mps/prefer-option-over-null -- The authenticated menu and stacked menu share the same people fixture and exact preview anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { commandMenu, filterCommandGroups } from "./command-menu.ts";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu.ts";
import { emptyState } from "./empty-state.ts";

interface ControlledUsersMenuProps<Message> {
  readonly avatars: Partial<Record<CommandMenuUsersMenuPersonId, string>>;
  readonly focusedId?: string;
  readonly id: string;
  readonly isOpen: boolean;
  readonly messageForFocus: (id: string) => NoInfer<Message>;
  readonly messageForSelect: (id: string) => NoInfer<Message>;
  readonly onClose: NoInfer<Message>;
  readonly onFollow: NoInfer<Message>;
  readonly onQueryChange: (query: string) => NoInfer<Message>;
  readonly onViewPortfolio: NoInfer<Message>;
  readonly placeholder?: string;
  readonly query: string;
  readonly selectedId: string;
}

export type CommandMenuUsersMenuProps<Message> = ControlledUsersMenuProps<Message>;
export type CommandMenuUsersMenuStackedProps<Message> = ControlledUsersMenuProps<Message>;

export type CommandMenuUsersMenuPersonId =
  | "user-01"
  | "user-02"
  | "user-03"
  | "user-04"
  | "user-05"
  | "user-06"
  | "user-07"
  | "user-08";

const people = [
  ["user-01", "Phoenix Baker", "@phoenix"],
  ["user-02", "Olivia Rhye", "@olivia"],
  ["user-03", "Lana Steiner", "@lana"],
  ["user-04", "Demi Wilkinson", "@demi"],
  ["user-05", "Candice Wu", "@candice"],
  ["user-06", "Natali Craig", "@natali"],
  ["user-07", "Drew Cano", "@drew"],
  ["user-08", "Kari Rasmussen", "@kari"],
] as const satisfies readonly (readonly [CommandMenuUsersMenuPersonId, string, string])[];

type SocialIcon = "dribbble" | "linkedin" | "x";

const socialIcon = <Message>(kind: SocialIcon, h: HtmlBuilder<Message>): Html => {
  const paths: Record<SocialIcon, string> = {
    dribbble:
      "M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.612 0 12 0Zm7.926 5.531a10.19 10.19 0 0 1 2.317 6.378c-.338-.065-3.722-.755-7.132-.326-.078-.169-.143-.351-.222-.533-.208-.495-.442-1.002-.676-1.484 3.774-1.536 5.492-3.748 5.713-4.035ZM12 1.77c2.603 0 4.985.976 6.794 2.577-.182.26-1.731 2.33-5.375 3.696-1.679-3.084-3.54-5.61-3.827-6A10.26 10.26 0 0 1 12 1.77ZM7.64 2.733c.273.365 2.095 2.903 3.8 5.922-4.789 1.276-9.019 1.25-9.475 1.25A10.28 10.28 0 0 1 7.64 2.733ZM1.744 12.013v-.312c.443.013 5.414.078 10.529-1.458.3.573.573 1.158.833 1.744l-.403.117c-5.284 1.705-8.096 6.364-8.33 6.755a10.2 10.2 0 0 1-2.629-6.846ZM12 22.256a10.2 10.2 0 0 1-6.286-2.16c.182-.378 2.264-4.387 8.043-6.404l.065-.026c1.445 3.735 2.03 6.872 2.187 7.77A10.2 10.2 0 0 1 12 22.256Zm5.714-1.757c-.104-.625-.651-3.618-1.992-7.302 3.215-.507 6.026.326 6.378.443a10.27 10.27 0 0 1-4.386 6.859Z",
    linkedin:
      "M22.223 0H1.772A1.75 1.75 0 0 0 0 1.73v20.536C0 23.222.792 24 1.772 24h20.451C23.203 24 24 23.222 24 22.27V1.73C24 .773 23.203 0 22.223 0ZM7.12 20.452H3.558V8.995H7.12v11.457ZM5.34 7.434a2.067 2.067 0 1 1 0-4.125 2.067 2.067 0 0 1 0 4.125Zm15.112 13.018h-3.558v-5.569c0-1.327-.023-3.038-1.852-3.038-1.851 0-2.133 1.449-2.133 2.944v5.663H9.356V8.995h3.413v1.566h.047c.473-.9 1.636-1.852 3.365-1.852 3.605 0 4.271 2.372 4.271 5.457v6.286Z",
    x: "M15.946 22 10.396 14.09 3.449 22H.51l8.582-9.769L.51 0h7.546l5.23 7.455L19.84 0h2.939l-8.184 9.316L23.49 22h-7.545Zm3.273-2.23H17.24L4.718 2.23h1.979l5.015 7.023.867 1.219 6.64 9.298Z",
  };
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5"),
      h.Fill("currentColor"),
      h.ViewBox(kind === "x" ? "0 0 24 22" : "0 0 24 24"),
    ],
    [h.path([h.D(paths[kind])])],
  );
};

const plusIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.DataAttribute("icon", "plus"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M12 5v14m-7-7h14")])],
  );

const profilePhoto = <Message>(avatarSrc: string | undefined, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative flex size-18 shrink-0 items-center justify-center rounded-full bg-bg-primary p-0.75 ring-1 ring-border-secondary-alt",
      ),
    ],
    [
      avatarSrc === undefined
        ? h.div([h.Class("size-full rounded-full bg-bg-tertiary")])
        : h.img([
            h.Alt(""),
            h.Class(
              "size-full rounded-full object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/16",
            ),
            h.Src(avatarSrc),
          ]),
      h.svg(
        [
          h.AriaHidden(true),
          h.Class("absolute right-0.5 bottom-0.5 z-10 size-6 text-utility-blue-500"),
          h.Fill("none"),
          h.ViewBox("0 0 10 10"),
        ],
        [
          h.path([
            h.D(
              "M7.722 1.771c.095.23.277.412.507.508l.805.333a.937.937 0 0 1 .507 1.225l-.333.804a.937.937 0 0 0 0 .718l.333.804a.937.937 0 0 1-.507 1.225l-.805.334a.937.937 0 0 0-.507.507l-.334.804a.937.937 0 0 1-1.225.508l-.804-.333a.937.937 0 0 0-.717 0l-.805.333a.937.937 0 0 1-1.224-.507l-.334-.805a.937.937 0 0 0-.507-.507l-.805-.334A.937.937 0 0 1 .46 6.164l.333-.805a.937.937 0 0 0 0-.717L.46 3.836a.937.937 0 0 1 .507-1.225l.805-.333a.937.937 0 0 0 .507-.507l.333-.805A.937.937 0 0 1 3.837.46l.805.333a.937.937 0 0 0 .717 0L6.164.46a.937.937 0 0 1 1.225.507l.333.805Z",
            ),
            h.Fill("currentColor"),
          ]),
          h.path([
            h.D(
              "M6.958 3.689a.469.469 0 0 0-.791-.503L4.331 6.07l-.84-1.05a.469.469 0 1 0-.732.586l1.25 1.562a.469.469 0 0 0 .761-.042l2.188-3.437Z",
            ),
            h.Fill("white"),
          ]),
        ],
      ),
    ],
  );

const profilePreview = <Message>(
  selectedId: string,
  stacked: boolean,
  avatars: Readonly<Partial<Record<CommandMenuUsersMenuPersonId, string>>>,
  onViewPortfolio: Message,
  onFollow: Message,
  h: HtmlBuilder<Message>,
): Html => {
  const person = people.find(([id]) => id === selectedId) ?? people[1];
  const description = stacked
    ? "I'm a Product Designer based in Melbourne, Australia."
    : "I'm a Product Designer and Webflow Developer based in Melbourne, Australia.";
  const avatarUrl = avatars[person[0]];
  return h.div(
    [
      h.Class(
        `absolute right-0 top-14 bottom-0 flex flex-col items-center border-l border-border-secondary bg-bg-primary ${stacked ? "w-100" : "w-90"}`,
      ),
    ],
    [
      h.div(
        [h.Class("w-full px-1 pt-1")],
        [
          h.div([
            h.Class(
              `w-full rounded-xl bg-linear-to-t from-profile-preview-start to-profile-preview-end ${stacked ? "h-28" : "h-22"}`,
            ),
          ]),
        ],
      ),
      h.div(
        [h.Class("relative -mt-8 w-full px-4")],
        [
          h.div(
            [h.Class("relative flex flex-col items-center gap-4")],
            [
              profilePhoto(avatarUrl, h),
              h.div(
                [h.Class("flex w-full flex-col items-center gap-4")],
                [
                  h.div(
                    [h.Class("flex flex-col items-center gap-0.5 text-center")],
                    [
                      h.p([h.Class("text-md font-semibold text-text-primary")], [person[1]]),
                      h.p([h.Class("text-sm text-text-tertiary")], [description]),
                    ],
                  ),
                  h.ul(
                    [h.Class("flex gap-4")],
                    (["x", "linkedin", "dribbble"] as const).map((kind) =>
                      h.li(
                        [],
                        [
                          h.a(
                            [
                              h.AriaLabel(
                                kind === "x" ? "X" : kind === "linkedin" ? "LinkedIn" : "Dribbble",
                              ),
                              h.Class(
                                "flex rounded-xs text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:text-fg-quaternary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
                              ),
                              h.Href(kind === "x" ? "https://x.com/" : `https://${kind}.com/`),
                              h.Rel("noopener noreferrer"),
                              h.Target("_blank"),
                            ],
                            [socialIcon(kind, h)],
                          ),
                        ],
                      ),
                    ),
                  ),
                  h.div(
                    [h.Class("flex w-full justify-center gap-3 pt-2")],
                    [
                      button(
                        {
                          color: "secondary",
                          label: "View portfolio",
                          onPress: onViewPortfolio,
                          size: "md",
                        },
                        h,
                      ),
                      button(
                        {
                          iconLeadingElement: plusIcon(h),
                          label: "Follow",
                          onPress: onFollow,
                          size: "md",
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
    ],
  );
};

const emptyContent = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("overflow-hidden p-6 pb-10")],
    [
      emptyState(
        {
          contentMargin: "none",
          decoration: "featured-icon",
          description: "Your search did not match any users. Please try again.",
          size: "sm",
          title: "No users found",
        },
        h,
      ),
    ],
  );

const renderMenu = <Message>(
  props: ControlledUsersMenuProps<Message>,
  stacked: boolean,
  h: HtmlBuilder<Message>,
): Html => {
  const items: readonly CommandMenuItem[] = people.map(([id, label, description]) => ({
    avatarUrl: props.avatars[id],
    description,
    id,
    label,
    stacked,
    type: "avatar",
  }));
  const groups: readonly CommandMenuGroup[] = [
    { id: stacked ? "default" : "designers", items, ...(stacked ? {} : { title: "Designers" }) },
  ];
  const empty = filterCommandGroups(groups, props.query).length === 0;
  return commandMenu(
    {
      ariaLabel: "Command menu",
      dialogClassName: stacked
        ? empty
          ? "h-93.5 w-180"
          : "h-106 w-180"
        : empty
          ? "h-92.5"
          : "h-102.5",
      emptyContent: emptyContent(h),
      focusedId: props.focusedId,
      groups,
      id: props.id,
      isOpen: props.isOpen,
      messageForFocus: props.messageForFocus,
      messageForSelect: props.messageForSelect,
      onClose: props.onClose,
      onQueryChange: props.onQueryChange,
      placeholder: props.placeholder,
      previewContent: profilePreview(
        props.selectedId,
        stacked,
        props.avatars,
        props.onViewPortfolio,
        props.onFollow,
        h,
      ),
      query: props.query,
      resultsClassName: stacked ? "w-80 max-h-92! min-h-49" : "w-70 max-h-88.5!",
      selectedId: props.selectedId,
      showFooter: false,
    },
    h,
  );
};

export const commandMenuUsersMenu = <Message>(
  props: CommandMenuUsersMenuProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderMenu(props, false, h);

export const commandMenuUsersMenuStacked = <Message>(
  props: CommandMenuUsersMenuStackedProps<Message>,
  h: HtmlBuilder<Message>,
): Html => renderMenu(props, true, h);
