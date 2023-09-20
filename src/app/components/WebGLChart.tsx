"use client";
import * as fc from "d3fc";
import * as d3 from "d3";
import "./WebGLChart.css";

//https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer/blob/master/index.js

import { useEffect, useMemo, useState, useCallback } from "react";

interface ChartProps {
  data: any[];
  className?: string;
}
const WebGLChart = (props: ChartProps) => {
  const [data, setData] = useState(props.data);
  const [callDraw, setCallDraw] = useState(0);
  const quadtree = useMemo(
    () =>
      d3
        .quadtree()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
        .addAll(data),
    [data]
  );

  const xScale = useMemo(() => d3.scaleLinear().domain([-50, 50]), []);
  const yScale = useMemo(() => d3.scaleLinear().domain([-50, 50]), []);
  const xScaleOriginal = useMemo(() => xScale.copy(), [xScale]);
  const yScaleOriginal = useMemo(() => yScale.copy(), [yScale]);

  const redraw = useCallback(
    async (chart: any) => {
      //   console.log("redraw", data);
      d3.select("#chart").datum(data).call(chart);
    },
    [data, callDraw]
  );

  //   const pointSeries = useMemo(
  //     () =>
  //       fc
  //         .seriesWebglPoint()
  //         .equals(
  //           (previousData: any, currentData: any) => previousData === currentData
  //         )
  //         .size(1)
  //         .crossValue((d: any) => d.x)
  //         .mainValue((d: any) => d.y),
  //     []
  //   );

  //   const zoom = useCallback(() => {
  //     d3.zoom()
  //       .scaleExtent([0.8, 10])
  //       .on("zoom", (event: any) => {
  //         // update the scales based on current zoom
  //         console.log("zoom called");
  //         xScale.domain(event.transform.rescaleX(xScaleOriginal).domain());
  //         yScale.domain(event.transform.rescaleY(yScaleOriginal).domain());
  //         redraw(chart);
  //       });
  //   }, [chart, redraw, xScale, xScaleOriginal, yScale, yScaleOriginal]);

  //   const chart = useMemo(
  //     () =>
  //       fc
  //         .chartCartesian(xScale, yScale)
  //         .webglPlotArea(pointSeries)
  //         .decorate((sel) =>
  //           sel
  //             .enter()
  //             .selectAll(".plot-area")
  //             .on("measure.range", (event: any) => {
  //               xScaleOriginal.range([0, event.detail.width]);
  //               yScaleOriginal.range([event.detail.height, 0]);
  //             })
  //             .call(zoom as any)
  //         ),
  //     [pointSeries, xScale, xScaleOriginal, yScale, yScaleOriginal, zoom]
  //   );

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    console.log("set data called");
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    // console.log(props.data);

    const pointSeries = fc
      .seriesWebglPoint()
      .equals(
        (previousData: any, currentData: any) => previousData === currentData
      )
      .size(1)
      .crossValue((d: any) => d.x)
      .mainValue((d: any) => d.y);

    // zoom needs to be called whenever data changes
    const zoom = d3
      .zoom()
      .scaleExtent([0.8, 10])
      .on("zoom", (event: any) => {
        // update the scales based on current zoom
        // console.log("zoom called");
        xScale.domain(event.transform.rescaleX(xScaleOriginal).domain());
        yScale.domain(event.transform.rescaleY(yScaleOriginal).domain());
        // console.log("onzoom", data);
        setCallDraw((draw) => -1 * draw); // needs to be forcefully called..
        // redraw(chart);
      });

    const chart = fc
      .chartCartesian(xScale, yScale)
      .webglPlotArea(fc.seriesWebglMulti().series([pointSeries]))
      .decorate((sel) =>
        sel
          .enter()
          .selectAll(".plot-area")
          .on("measure.range", (event: any) => {
            xScaleOriginal.range([0, event.detail.width]);
            yScaleOriginal.range([event.detail.height, 0]);
          })
          .call(zoom as any)
      );

    redraw(chart);
  }, [data, quadtree, redraw, xScale, xScaleOriginal, yScale, yScaleOriginal]);
  return (
    <>
      {/* <button
        onClick={() => {
          console.log("clicked", data);
          setCallDraw((draw) => -1 * draw);
        }}
      >
        data
      </button> */}
      <div id="chart" className={props.className ?? ""}></div>
    </>
  );
};

export default WebGLChart;
