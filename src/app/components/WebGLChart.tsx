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
  const [data, setData] = useState(props.data);
  const [callDraw, setCallDraw] = useState(false);
  const chartRef = useRef<unknown>(null);

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

  // const annotationSeries = seriesSvgAnnotation()
  //   .notePadding(15)
  //   .type(d3.annotationCallout);

  // const annotations: any[] = [];

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

  const redraw = useCallback(
    async (data: any, chart: any) => {
      // Pass over data by parameter, otherwise it would only update the subsets of data
      console.log("redraw", data.length);
      d3.select("#chart").datum(data).call(chart);
    },
    [callDraw]
  );

  const chart = useMemo(
    () =>
      fc
        .chartCartesian(xScale, yScale)
        .webglPlotArea(fc.seriesWebglMulti().series([pointSeries]))
        //   .svgPlotArea(
        //     // only render the annotations series on the SVG layer
        //     fc
        //       .seriesSvgMulti()
        //       .series([annotationSeries])
        //       .mapping((d: any) => d.annotations)
        //   )
        .decorate((sel) =>
          sel
            .enter()
            .selectAll(".plot-area")
            .on("measure.range", (event: any) => {
              xScaleOriginal.range([0, event.detail.width]);
              yScaleOriginal.range([event.detail.height, 0]);
            })
            .call(
              d3
                .zoom()
                .scaleExtent([0.8, 10])
                .on("zoom", (event: any) => {
                  // update the scales based on current zoom
                  // console.log("zoom called");
                  xScale.domain(
                    event.transform.rescaleX(xScaleOriginal).domain()
                  );
                  yScale.domain(
                    event.transform.rescaleY(yScaleOriginal).domain()
                  );
                  redraw(data, chart);
                  // setCallDraw((prev) => !prev);
                }) as any
            )
            .call(
              fc.pointer().on("point", ([coord]: any[]) => {
                //   annotations.pop();

                if (!coord || !quadtree) {
                  return;
                }

                // find the closes datapoint to the pointer
                const x = xScale.invert(coord.x);
                const y = yScale.invert(coord.y);
                const radius = Math.abs(
                  xScale.invert(coord.x) - xScale.invert(coord.x - 20)
                );
                const closestDatum = quadtree.find(
                  x,
                  y,
                  radius
                ) as unknown as HathiData;

                // if the closest point is within 20 pixels, show the annotation
                if (closestDatum) {
                  console.log(
                    "closestDatum",
                    closestDatum.title,
                    closestDatum.x,
                    closestDatum.y
                  );
                  // only draw when there's data to show -> separate the canvas
                  // setCallDraw((prev) => !prev);
                  console.log(data.length);
                  redraw(data, chart);
                }
              })
            )
        ),
    [
      data,
      pointSeries,
      quadtree,
      redraw,
      xScale,
      xScaleOriginal,
      yScale,
      yScaleOriginal,
    ]
  );

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    console.log("set data called");
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    // console.log(props.data);
    chartRef.current = d3.select("#chart");

    const languageColorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const yearColorScale = d3
      .scaleSequential()
      .domain([1850, 2000])
      .interpolator(d3.interpolateRdYlGn);

    const languageFill = (d: any) =>
      webglColor(languageColorScale((hashCode(d.language) % 10).toString()));

    const yearFill = (d: any) => webglColor(yearColorScale(d.year));

    const fillColor = fc.webglFillColor().value(languageFill).data(data);
    pointSeries.decorate((program: any) => fillColor(program));

    // wire up the fill color selector
    iterateElements(".controls a", (el: any) => {
      el.addEventListener("click", () => {
        iterateElements(".controls a", (el2: any) =>
          el2.classList.remove("active")
        );
        el.classList.add("active");
        fillColor.value(el.id === "language" ? languageFill : yearFill);
        redraw(data, chart);
      });
    });
    redraw(data, chart);
  }, [chart, data, pointSeries, redraw]);
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
