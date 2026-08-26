import type { Html, HtmlBuilder } from "foldkit/html";
import * as Match from "effect/Match";

export interface RangePresetProps<Message> {
  readonly isSelected?: boolean;
  readonly label: string;
  readonly onPress: NoInfer<Message>;
}

const stateClass = (isSelected: boolean): string =>
  Match.value(isSelected).pipe(
    Match.when(true, () => "bg-bg-active text-text-secondary-hover hover:bg-bg-secondary-hover"),
    Match.orElse(
      () => "text-text-secondary hover:bg-bg-primary-hover hover:text-text-secondary-hover",
    ),
  );

export const rangePreset = <Message>(
  props: RangePresetProps<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaPressed(String(props.isSelected ?? false)),
      h.Class(
        `cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 ${stateClass(props.isSelected === true)}`,
      ),
      h.OnClick(props.onPress),
      h.Type("button"),
    ],
    [props.label],
  );
