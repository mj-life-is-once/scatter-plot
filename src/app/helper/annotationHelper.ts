import * as d3 from "d3";

export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x1 - x2,
    dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

export const trunc = (str: string, len: number) =>
  str.length > len ? str.substring(0, len - 1) + "..." : str;

export const hashCode = (s: string): number =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

export const webglColor = (color: any) => {
  const { r, g, b, opacity } = d3.color(color)!.rgb();
  return [r / 255, g / 255, b / 255, opacity];
};

export const iterateElements = (selector: any, fn: any) =>
  [].forEach.call(document.querySelectorAll(selector), fn);
