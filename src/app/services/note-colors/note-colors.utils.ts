import { SYSTEM_COLOR } from "./note-colors.constants";

export class ColorHelper {
  public static calculateDynamicOpacity(scaleStep: number) {
    if (scaleStep === 0) return 255;
    return (scaleStep > 0)
      ? Math.round(255 * (3 / (scaleStep + 4)))
      : 0;
  }

  public static calculateStaticOpacity(scaleStep?: number) {
    return scaleStep == null ? 0 : 255;
  }

  public static mergeColorWithOpacity(color: string, opacity: number) {
    return color.slice(0, 7) + opacity.toString(16).padStart(2, '0');
  }

  public static colorIsDark(bgColor: string, backgroundColor = SYSTEM_COLOR): boolean {
    const curr = ColorHelper.parseColor(bgColor);
    if (!curr) return ColorHelper.colorIsDark(backgroundColor);
    if (curr.a === 0) return ColorHelper.colorIsDark(backgroundColor);
    if (curr.a === 1) { return ((curr.r * 0.299) + (curr.g * 0.587) + (curr.b * 0.114)) <= 186; }
    const bg = ColorHelper.parseColor(backgroundColor)!;
    const blended = ColorHelper.blendColors(curr.r, curr.g, curr.b, curr.a, bg.r, bg.g, bg.b, bg.a);
    return ((blended.r * 0.299) + (blended.g * 0.587) + (blended.b * 0.114)) <= 186;
  }

  public static blendColors(
    r1: number, g1: number, b1: number, a1: number,
    r2: number, g2: number, b2: number, a2: number
  ) {
    const a = a1 + (a2 - a1);
    return {
      r: Math.round((r1 * a1 + r2 * (a2 - a1)) / a),
      g: Math.round((g1 * a1 + g2 * (a2 - a1)) / a),
      b: Math.round((b1 * a1 + b2 * (a2 - a1)) / a)
    };
  }

  public static parseColor(color: string) {
    if (color.startsWith('rgba')) {
      return ColorHelper.parseRGBA(color);
    }
    if (color.startsWith('#')) {
      return ColorHelper.parseHEX(color);
    }
    return null;
  }

  private static parseRGBA(color: string) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1
      };
    }
    return null;
  }

  private static parseHEX(color: string) {
    if (color.length >= 4 && color.length <= 9) {
      const hex = color.length === 5 || color.length === 4
        ? color.substring(1).split('').map(c => c + c).join('')
        : color.substring(1);

      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: color.length === 5 || color.length === 9
          ? parseInt(hex.substring(6, 8), 16) / 255
          : 1
      };
    }
    return null;
  }
}