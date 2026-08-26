/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/imperative-loops -- The authenticated gradient math keeps its geometric and four-segment algorithms explicit. */
export type GradientType = "linear" | "radial" | "angular" | "diamond";

export interface GradientStop {
  readonly alpha: number;
  readonly color: string;
  readonly id: string;
  readonly position: number;
}

export interface GradientPoint {
  readonly x: number;
  readonly y: number;
}

const clamp = (amount: number, minimum: number, maximum: number): number =>
  Math.max(minimum, Math.min(maximum, amount));

export const angleToGradientPoints = (
  angle: number,
): Readonly<{ end: GradientPoint; start: GradientPoint }> => {
  const radians = (angle * Math.PI) / 180;
  const directionX = Math.sin(radians);
  const directionY = -Math.cos(radians);
  const scaleX = directionX === 0 ? Number.POSITIVE_INFINITY : 50 / Math.abs(directionX);
  const scaleY = directionY === 0 ? Number.POSITIVE_INFINITY : 50 / Math.abs(directionY);
  const scale = Math.min(scaleX, scaleY);
  return {
    end: { x: 50 + directionX * scale, y: 50 + directionY * scale },
    start: { x: 50 - directionX * scale, y: 50 - directionY * scale },
  };
};

export const gradientPointAt = (
  start: GradientPoint,
  end: GradientPoint,
  position: number,
): GradientPoint => {
  const unit = position / 100;
  return {
    x: start.x + (end.x - start.x) * unit,
    y: start.y + (end.y - start.y) * unit,
  };
};

const colorChannel = (color: string, offset: number): number => {
  const normalized = color.replace(/^#/u, "").padEnd(6, "0");
  return Number.parseInt(normalized.slice(offset, offset + 2), 16);
};

const stopColor = (stop: GradientStop): string =>
  `rgba(${String(colorChannel(stop.color, 0))}, ${String(colorChannel(stop.color, 2))}, ${String(colorChannel(stop.color, 4))}, ${String(clamp(stop.alpha, 0, 100) / 100)})`;

const stopCss = (stop: GradientStop): string =>
  `${stopColor(stop)} ${String(clamp(stop.position, 0, 100))}%`;

export const gradientCss = (
  stops: readonly GradientStop[],
  type: GradientType,
  angle: number,
): string => {
  const sorted = [...stops].toSorted((left, right) => left.position - right.position);
  const css = sorted.map(stopCss).join(", ");
  if (type === "radial") {
    return `radial-gradient(circle, ${css})`;
  }
  if (type === "angular") {
    return `conic-gradient(from ${String(angle)}deg, ${css})`;
  }
  if (type === "diamond") {
    const segments: string[] = [];
    for (let segment = 0; segment < 4; segment += 1) {
      const reverse = segment % 2 === 1;
      const ordered = reverse ? sorted.toReversed() : sorted;
      for (let index = 0; index < ordered.length; index += 1) {
        if (segment > 0 && index === 0) {
          continue;
        }
        const stop = ordered[index];
        if (stop === undefined) {
          continue;
        }
        const unit = reverse ? (100 - stop.position) / 100 : stop.position / 100;
        segments.push(`${stopColor(stop)} ${String(segment * 90 + unit * 90)}deg`);
      }
    }
    return `conic-gradient(from ${String(angle)}deg, ${segments.join(", ")})`;
  }
  return `linear-gradient(${String(angle)}deg, ${css})`;
};

export const moveGradientStop = (
  stops: readonly GradientStop[],
  stopId: string,
  position: number,
): readonly GradientStop[] => {
  const sorted = [...stops].toSorted((left, right) => left.position - right.position);
  const index = sorted.findIndex((stop) => stop.id === stopId);
  if (index === -1) {
    return stops;
  }
  const previous = sorted[index - 1]?.position ?? 0;
  const next = sorted[index + 1]?.position ?? 100;
  const moved = clamp(position, previous, next);
  return stops.map((stop) => (stop.id === stopId ? { ...stop, position: moved } : stop));
};

export const reverseGradientStops = (stops: readonly GradientStop[]): readonly GradientStop[] => {
  const sorted = [...stops].toSorted((left, right) => left.position - right.position);
  return stops.map((stop) => {
    const index = sorted.findIndex((candidate) => candidate.id === stop.id);
    const mirror = sorted.at(sorted.length - 1 - index);
    return mirror === undefined ? stop : { ...stop, alpha: mirror.alpha, color: mirror.color };
  });
};
