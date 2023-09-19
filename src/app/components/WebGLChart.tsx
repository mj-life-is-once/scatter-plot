"use client";
import * as fc from "d3fc";
import * as d3 from "d3";

//https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer/blob/master/index.js

import { useEffect, useMemo, useRef, MutableRefObject } from "react";

interface ChartProps {
  data: any[];
}
const WebGLChart = (props: ChartProps) => {
  //   const chartContainerRef =;

  const quadtree = useMemo(
    () =>
      d3
        .quadtree()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
        .addAll(props.data),
    [props.data]
  );
  //   const xScale = useMemo(() => d3.scaleLinear().domain([-50, 50]), []);
  //   const yScale = useMemo(() => d3.scaleLinear().domain([-50, 50]), []);
  //   const xScaleOriginal = useMemo(() => xScale.copy(), [xScale]);
  //   const yScaleOriginal = useMemo(() => yScale.copy(), [yScale]);

  useEffect(() => {
    //console.log(props.data);
    const xScale = d3.scaleLinear().domain([-50, 50]);
    const yScale = d3.scaleLinear().domain([-50, 50]);
    const xScaleOriginal = xScale.copy();
    const yScaleOriginal = yScale.copy();

    // chartContainerRef.current = d3.select("#chart");

    const pointSeries = fc
      .seriesWebglPoint()
      .equals((a: any, b: any) => a === b)
      .size(1)
      .crossValue((d: any) => d.x)
      .mainValue((d: any) => d.y);

    const zoom = d3
      .zoom()
      .scaleExtent([0.8, 10])
      .on("zoom", (event: any) => {
        // update the scales based on current zoom
        xScale.domain(event.transform.rescaleX(xScaleOriginal).domain());
        yScale.domain(event.transform.rescaleY(yScaleOriginal).domain());
        redraw();
      }) as any;

    const chart = fc
      .chartCartesian(xScale, yScale)
      .webglPlotArea(
        // only render the point series on the WebGL layer
        fc
          .seriesWebglMulti()
          .series([pointSeries])
          .mapping((d: any) => d.data)
      )
      //   .svgPlotArea(
      //     // only render the annotations series on the SVG layer
      //     fc
      //       .seriesSvgMulti()
      //       .series([annotationSeries])
      //       .mapping((d: any) => d.annotations)
      //   )
      .decorate(
        (sel) =>
          sel
            .enter()
            .select("d3fc-svg.plot-area")
            .on("measure.range", (event) => {
              xScaleOriginal.range([0, event.detail.width]);
              yScaleOriginal.range([event.detail.height, 0]);
            })
            .call(zoom)
        //   .call(pointer)
      );

    const redraw = () => {
      d3.select("#chart").call(chart);
    };
  }, [props.data]);
  return <div id="chart"></div>;
};

export default WebGLChart;
