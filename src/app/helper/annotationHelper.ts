import * as d3 from "d3";
import * as fc from "d3fc";
import { HathiData } from "../types/types";
import { annotation } from "d3-svg-annotation";

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

export const createAnnotationData = (datapoint: HathiData) => ({
  note: {
    label: datapoint.first_author_name + " " + datapoint.year,
    bgPadding: 5,
    title: trunc(datapoint.title, 100),
  },
  color: ["#fff"],
  x: datapoint.x,
  y: datapoint.y,
  dx: 20,
  dy: 20,
});

// Note : d3 annotation does not work in the latest d3 package
export const seriesSvgAnnotation = () => {
  let xScale = d3.scaleLinear();
  let yScale = d3.scaleLinear();
  const join = fc.dataJoin("g", "annotation");

  const d3Annotation = annotation();

  const series = (selection: any) => {
    selection.each((data: any[], index: number, group: any) => {
      if (data === undefined) return;
      const projectedData = data.map((datum: any) => ({
        ...datum,
        x: xScale(datum.x),
        y: yScale(datum.y),
      }));

      d3Annotation.annotations(projectedData);
      join(d3.select(group[index]), projectedData).call(d3Annotation);
    });
  };

  series.xScale = (...args: any[]) => {
    if (!args.length) {
      return xScale;
    }
    xScale = args[0];
    return series;
  };

  series.yScale = (...args: any[]) => {
    if (!args.length) {
      return yScale;
    }
    yScale = args[0];
    return series;
  };

  fc.rebindAll(series, d3Annotation);

  return series;
};
