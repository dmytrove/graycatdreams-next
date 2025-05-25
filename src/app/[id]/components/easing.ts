export const linear = (t: number) => t;
export const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
export const easeValueTo = (from: number, to: number, factor = 0.08) => from + (to - from) * factor;

export const easeFunctions = {
  linear,
  easeInOutQuad,
  easeInOutCubic,
  easeValueTo,
}; 