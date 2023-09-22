"use client";
import * as fc from "d3fc";
import * as d3 from "d3";
import "./WebGLChart.css";
import {
  //   distance,
  trunc,
  hashCode,
  webglColor,
  iterateElements,
} from "../helper/annotationHelper";
import { HathiData } from "../types/types";

//https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer/blob/master/index.js

import { useEffect, useMemo, useState, useCallback, useRef } from "react";

interface ChartProps {
  data: any[];
  className?: string;
}
const WebGLChart = (props: ChartProps) => {
  // data and quadtree cannot be defined as useMemo as it's called
  // before render and the data won't be updated once called
  const chartRef = useRef<any>(null);
  const dataRef = useRef<any>([]);
  const quadtreeRef = useRef<any>(null);

  const xScale = useMemo(() => d3.scaleLinear().domain([-50, 50]), []);
  const yScale = useMemo(() => d3.scaleLinear().domain([-50, 50]), []);
  const xScaleOriginal = useMemo(() => xScale.copy(), [xScale]);
  const yScaleOriginal = useMemo(() => yScale.copy(), [yScale]);

  const pointSeries = useMemo(
    () =>
      fc
        .seriesWebglPoint()
        .equals(
          (previousData: any, currentData: any) => previousData === currentData
        )
        .size(1)
        .crossValue((d: any) => d.x)
        .mainValue((d: any) => d.y),
    []
  );

  const chart = useMemo(
    () =>
      fc.chartCartesian(xScale, yScale).webglPlotArea(
        // only render the point series on the WebGL layer
        fc
          .seriesWebglMulti()
          .series([pointSeries])
          .mapping((d: any) => {
            console.log("webplotArea", d.data.length);
            return d.data;
          })
      ),
    [pointSeries, xScale, yScale]
  )
    // .svgPlotArea(
    //   // only render the annotations series on the SVG layer
    //   fc
    //     .seriesSvgMulti()
    //     .series([annotationSeries])
    //     .mapping(d => d.annotations)
    // )
    .decorate((sel: any) =>
      sel
        .enter()
        .selectAll(".plot-area")
        .on("measure.range", (event: any) => {
          xScaleOriginal.range([0, event.detail.width]);
          yScaleOriginal.range([event.detail.height, 0]);
        })
        .call(zoom as any)
        .call(pointer)
    );

  const redraw: any = useCallback(
    async (data?: any, annotation?: any) => {
      // Pass over data by parameter, otherwise it would only update the subsets of data
      console.log("redraw", data.length);
      chartRef.current.datum({ data }).call(chart);
    },
    [chart]
  );

  const annotations = useMemo(() => [], []);

  // does not update
  const pointer = useMemo(
    () =>
      fc.pointer().on("point", ([coord]: any[]) => {
        annotations.pop();

        if (!coord || !quadtreeRef.current) {
          return;
        }

        // find the closes datapoint to the pointer
        const x = xScale.invert(coord.x);
        const y = yScale.invert(coord.y);
        const radius = Math.abs(
          xScale.invert(coord.x) - xScale.invert(coord.x - 20)
        );

        const closestDatum = quadtreeRef.current.find(
          x,
          y,
          radius
        ) as unknown as HathiData;

        // if the closest point is within 20 pixels, show the annotation
        if (closestDatum) {
          console.log(
            "closestDatum",
            // closestDatum.title,
            closestDatum.x,
            closestDatum.y
          );

          // console.log("quadtree", quadtreeRef.current.size());
          redraw(dataRef.current);
        }
      }),
    [annotations, redraw, xScale, yScale]
  );

  const zoom = useMemo(
    () =>
      d3
        .zoom()
        .scaleExtent([0.8, 10])
        .on("zoom", (event: any, d: any) => {
          // update the scales based on current zoom
          // console.log("zoom called");
          xScale.domain(event.transform.rescaleX(xScaleOriginal).domain());
          yScale.domain(event.transform.rescaleY(yScaleOriginal).domain());

          console.log(
            "on zoom",
            d.data.length,
            dataRef.current.length
            // bigData.length
          );
          // Note: need to pass the data as a paremeter in redraw function,
          // otherwise the data only shows the initial chunk of data loaded before.
          redraw(d.data);
        }),
    [redraw, xScale, xScaleOriginal, yScale, yScaleOriginal]
  );

  // useEffect(() => {
  //   console.log("check quadtree", quadtree.size());
  // }, [quadtree]);

  // useEffect(() => {
  //   console.log("data", bigData);
  // }, [bigData]);

  useEffect(() => {
    console.log("set data called");
    // setBigData(props.data);
    dataRef.current = props.data;
  }, [props.data]);

  useEffect(() => {
    // console.log(props.data);
    chartRef.current = d3.select("#chart");
    dataRef.current = props.data;

    quadtreeRef.current = d3
      .quadtree()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .addAll(props.data);

    const languageColorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const yearColorScale = d3
      .scaleSequential()
      .domain([1850, 2000])
      .interpolator(d3.interpolateRdYlGn);

    const languageFill = (d: any) =>
      webglColor(languageColorScale((hashCode(d.language) % 10).toString()));

    const yearFill = (d: any) => webglColor(yearColorScale(d.year));

    const fillColor = fc
      .webglFillColor()
      .value(languageFill)
      .data(dataRef.current);
    pointSeries.decorate((program: any) => fillColor(program));

    // wire up the fill color selector
    // iterateElements(".controls a", (el: any) => {
    //   el.addEventListener("click", () => {
    //     iterateElements(".controls a", (el2: any) =>
    //       el2.classList.remove("active")
    //     );
    //     el.classList.add("active");
    //     fillColor.value(el.id === "language" ? languageFill : yearFill);
    //     redraw(bigData);
    //   });
    // });

    redraw(dataRef.current);
  }, [chart, pointSeries, props.data, redraw]);
  return (
    <>
      <div id="chart" className={`relative ${props.className ?? ""}`}>
        {/* <div className="absolute top-0 left-0">
          <svg width="100" height="50">
            <g>
              <circle
                fill="#000"
                stroke="#fff"
                r="10px"
                // cx={(node as any).x}
                // cy={(node as any).y}
              >
                <title>
                  <title></title>
                </title>
              </circle>

              <text
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="1rem"
                // x={(node as any).x}
                // y={(node as any).y}
                fill={"#ffffff"}
                stroke="none"
              >
                data
              </text>
            </g>
          </svg>
        </div> */}
      </div>
    </>
  );
};

export default WebGLChart;
