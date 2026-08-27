/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- The two upstream advanced dropdowns share one controlled fixture. */
import * as S from "effect/Schema";
import type { Html, HtmlBuilder } from "foldkit/html";
import type { DropdownAdvancedProps, DropdownAdvancedSubmenu } from "ui/base";

const Args = S.Struct({});
const Submenu = S.Union([
  S.Literal("developer"),
  S.Literal("more-tools"),
  S.Literal("none"),
  S.Literal("save-as"),
]);
const ViewOption = S.Union([S.Literal("show-bookmarks"), S.Literal("show-urls")]);
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  openSubmenu: Submenu,
  selectedViewOptions: S.Array(ViewOption),
});
type Model = typeof Model.Type;
type ViewOption = "show-bookmarks" | "show-urls";
type Renderer = <Message>(props: DropdownAdvancedProps<Message>, h: HtmlBuilder<Message>) => Html;
export type AdvancedMessage =
  | Readonly<{ _tag: "Closed" | "Toggled" }>
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>
  | Readonly<{ _tag: "SubmenuChanged"; submenu: DropdownAdvancedSubmenu }>
  | Readonly<{ _tag: "ViewOptionToggled"; id: ViewOption }>;

export const advancedDefinition = (renderer: Renderer, initiallyOpen: boolean) => {
  const specimen = (model: Model, h: Parameters<typeof renderer<AdvancedMessage>>[1]) =>
    renderer(
      {
        focusedId: model.focusedId,
        isOpen: model.isOpen,
        onClose: { _tag: "Closed" },
        onFocus: (id): AdvancedMessage => ({ _tag: "Focused", id }),
        onSelect: (id): AdvancedMessage => ({ _tag: "Selected", id }),
        onSubmenuChange: (submenu): AdvancedMessage => ({ _tag: "SubmenuChanged", submenu }),
        onToggle: { _tag: "Toggled" },
        onViewOptionToggle: (id): AdvancedMessage => ({ _tag: "ViewOptionToggled", id }),
        openSubmenu: model.openSubmenu,
        selectedViewOptions: model.selectedViewOptions,
      },
      h,
    );
  const definition = {
    Args,
    Model,
    init: (_args: typeof Args.Type): Model => ({
      focusedId: "back",
      isOpen: initiallyOpen,
      openSubmenu: "none",
      selectedViewOptions: ["show-bookmarks"],
    }),
    update: (model: Model, message: AdvancedMessage): Model => {
      if (message._tag === "Toggled") {
        return { ...model, isOpen: !model.isOpen, openSubmenu: "none" };
      }
      if (message._tag === "Closed" || message._tag === "Selected") {
        return { ...model, isOpen: false, openSubmenu: "none" };
      }
      if (message._tag === "Focused") {
        return { ...model, focusedId: message.id };
      }
      if (message._tag === "SubmenuChanged") {
        return { ...model, openSubmenu: message.submenu };
      }
      if (message._tag === "ViewOptionToggled") {
        const selected = model.selectedViewOptions.includes(message.id);
        return {
          ...model,
          selectedViewOptions: selected
            ? model.selectedViewOptions.filter((id) => id !== message.id)
            : [...model.selectedViewOptions, message.id],
        };
      }
      return model;
    },
    view: (model: Model, h: Parameters<typeof renderer<AdvancedMessage>>[1]) =>
      h.div([h.Class("min-h-[36rem]")], [specimen(model, h)]),
  };
  return { definition, specimen };
};
