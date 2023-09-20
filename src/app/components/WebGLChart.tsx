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

//https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer/blob/master/index.js

import { useEffect, useMemo, useState, useCallback, useRef } from "react";

interface ChartProps {
  data: any[];
  className?: string;
}
const WebGLChart = (props: ChartProps) => {
  const [data, setData] = useState(props.data);
  const [callDraw, setCallDraw] = useState(0);
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

  const redraw = useCallback(
    async (chart: any) => {
      //   console.log("redraw", data);
      d3.select("#chart").datum(data).call(chart);
    },
    [data, callDraw]
  );

  const createAnnotationData = useCallback(
    (datapoint: any) => ({
      note: {
        label: datapoint.first_author_name + " " + datapoint.year,
        bgPadding: 5,
        title: trunc(datapoint.title, 100),
      },
      x: datapoint.x,
      y: datapoint.y,
      dx: 20,
      dy: 20,
    }),
    []
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

    const pointSeries = fc
      .seriesWebglPoint()
      .equals(
        (previousData: any, currentData: any) => previousData === currentData
      )
      .size(1)
      .crossValue((d: any) => d.x)
      .mainValue((d: any) => d.y);

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
        redraw(chart);
      });
    });

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

    // const annotationSeries = seriesSvgAnnotation()
    //   .notePadding(15)
    //   .type(d3.annotationCallout);

    const chart = fc
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
          .call(zoom as any)
          .call(pointer)
      );

    // const annotations: any[] = [];

    const pointer = fc.pointer().on("point", ([coord]: any[]) => {
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
      const closestDatum = quadtree.find(x, y, radius);

      // if the closest point is within 20 pixels, show the annotation
      if (closestDatum) {
        console.log("closestDatum", closestDatum);
        // annotations[0] = createAnnotationData(closestDatum);
      }
      setCallDraw((draw) => -1 * draw);
    });

    redraw(chart);
  }, [
    createAnnotationData,
    data,
    quadtree,
    redraw,
    xScale,
    xScaleOriginal,
    yScale,
    yScaleOriginal,
  ]);
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
