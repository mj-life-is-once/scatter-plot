import * as d3 from "d3";
import {
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { SampleData } from "../types/types";
import c from "./Canvas.module.css";
import ToolTip from "./ToolTip";
import { Canvas2DContext } from "../context/CanvasContextProvider";
import { quadSearch } from "../helper/quadTreeHelper";

const pointColor = "#00ffa2";
const selectedColor = "#ffee00";

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const outerWidth = 600;
const outerHeight = 600;

const Canvas = ({
  data,
  toolTipShow,
  setToolTipShow,
}: {
  data: Array<SampleData>;
  toolTipShow: boolean;
  setToolTipShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { contextRef, overlayContextRef, canvas, overlayCanvas, svg } =
    useContext(Canvas2DContext);

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const useSearchRadiusRef = useRef(10);
  const [searchResult, setSearchResult] = useState<Array<SampleData>>([]);

  const gxAxisRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > | null>(null);

  const gyAxisRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > | null>(null);

  const [dimensions, setDimensions] = useState({
    width: chartContainerRef.current?.offsetWidth || outerWidth,
    height: chartContainerRef.current?.offsetHeight || outerHeight,
  });

  const canvasWidth = useMemo(
    () => dimensions.width - margin.left - margin.right,
    [dimensions]
  );

  const canvasHeight = useMemo(
    () => dimensions.height - margin.top - margin.bottom,
    [dimensions]
  );

  const maxDataX = useMemo(() => {
    const max =
      d3.max(
        data,
        (d) => Math.round(d.x * Math.pow(10, 6)) / Math.pow(10, 6)
      ) || canvasWidth;
    console.log(`maxX: ${max}`);
    return max;
  }, [canvasWidth, data]);

  const maxDataY = useMemo(() => {
    const max =
      d3.max(
        data,
        (d) => Math.round(d.y * Math.pow(10, 6)) / Math.pow(10, 6)
      ) || canvasHeight;
    console.log(`maxY: ${max}`);
    return max;
  }, [canvasHeight, data]);

  //quadtree
  const quadTree = useMemo(
    () =>
      d3
        .quadtree<SampleData>()
        .extent([
          [0, 0],
          [canvasWidth, canvasHeight],
        ])
        .x((d: SampleData) => d.x)
        .y((d: SampleData) => d.y)
        .addAll(data),
    [canvasHeight, canvasWidth, data]
  );

  const x = useMemo(
    () => d3.scaleLinear().domain([0, maxDataX]).range([0, canvasWidth]).nice(),
    [maxDataX, canvasWidth]
  );

  const y = useMemo(
    () =>
      d3.scaleLinear().domain([0, maxDataY]).range([canvasHeight, 0]).nice(),
    [maxDataY, canvasHeight]
  );

  const xAxis = useMemo(() => d3.axisBottom(x), [x]);
  const yAxis = useMemo(() => d3.axisLeft(y), [y]);

  const drawPoint = useCallback(
    (
      context: CanvasRenderingContext2D,
      scaleX: any,
      scaleY: any,
      p_x: number,
      p_y: number,
      type: string
    ) => {
      context?.beginPath();
      if (context)
        context.fillStyle = type == "selected" ? selectedColor : pointColor;

      const px = scaleX(Math.floor(p_x));
      const py = scaleY(Math.floor(p_y));

      context?.arc(px, py, 1.2 * transformRef.current.k, 0, 2 * Math.PI, true);
      context?.fill();
    },
    []
  );

  // Draw plot on canvas
  const draw = useCallback(
    (
      gxAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
      gyAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) => {
      const scaleX = transformRef.current.rescaleX(x);
      const scaleY = transformRef.current.rescaleY(y);

      gxAxis?.call(xAxis.scale(scaleX));
      gyAxis?.call(yAxis.scale(scaleY));

      contextRef.current?.clearRect(0, 0, canvasWidth, canvasHeight);

      data.forEach((point: SampleData) => {
        drawPoint(
          contextRef.current!,
          scaleX,
          scaleY,
          point.x,
          point.y,
          "default"
        );
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("redraw points");
        }, 2000);
      });
    },
    [canvasHeight, canvasWidth, contextRef, data, drawPoint, x, xAxis, y, yAxis]
  );

  // Draw plot on canvas
  const drawOverlay = useCallback(
    (selected: Array<SampleData>, event_x: number, event_y: number) => {
      const scaleX = transformRef.current.rescaleX(x);
      const scaleY = transformRef.current.rescaleY(y);

      overlayContextRef.current?.clearRect(0, 0, canvasWidth, canvasHeight);
      selected.forEach((point: SampleData, index: number) => {
        drawPoint(
          overlayContextRef.current!,
          scaleX,
          scaleY,
          point.x,
          point.y,
          "selected"
        );
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("redrew overlay");
        }, 2000);
      });
    },
    [canvasHeight, canvasWidth, drawPoint, overlayContextRef, x, y]
  );

  const zoom = useMemo(
    () =>
      d3
        .zoom()
        .scaleExtent([1, 100])
        .extent([
          [0, 0],
          [canvasWidth, canvasHeight],
        ])
        .on("zoom", (event: any) => {
          overlayContextRef.current?.clearRect(0, 0, canvasWidth, canvasHeight);
          transformRef.current = event.transform;
          contextRef.current?.save(); // pause current context
          draw(gxAxisRef.current!, gyAxisRef.current!);
          contextRef.current?.restore(); // and restore it afterward
        }) as any,

    [canvasHeight, canvasWidth, contextRef, draw, overlayContextRef]
  );

  const resetHandler = () => {
    console.log("reset from d3 selection");
    const t = d3.zoomIdentity.translate(0, 0).scale(1);
    canvas.current
      ?.transition()
      .duration(200)
      .ease(d3.easeLinear)
      .call(zoom.transform, t);
  };

  const setRadiusHandler = (radius: number) => {
    useSearchRadiusRef.current = radius;
  };

  useEffect(() => {
    setDimensions({
      width: chartContainerRef.current?.getClientRects()[0].width!,
      height: chartContainerRef.current?.getClientRects()[0].height!,
    });
  }, [toolTipShow]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: chartContainerRef.current?.getClientRects()[0].width!,
        height: chartContainerRef.current?.getClientRects()[0].height!,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // init svg
    svg.current = d3.select("#axes");

    // init canvas
    canvas.current = d3.select("#graph") as unknown as d3.Selection<
      HTMLCanvasElement,
      unknown,
      HTMLElement,
      undefined
    >;

    // init canvas
    overlayCanvas.current = d3.select("#overlay") as unknown as d3.Selection<
      HTMLCanvasElement,
      unknown,
      HTMLElement,
      undefined
    >;

    // add axes
    gxAxisRef.current = (
      svg.current?.select("#gxAxis") as d3.Selection<
        SVGGElement,
        unknown,
        HTMLElement,
        any
      >
    ).call(xAxis);

    gyAxisRef.current = (
      svg.current?.select("#gyAxis") as d3.Selection<
        SVGGElement,
        unknown,
        HTMLElement,
        any
      >
    ).call(yAxis);

    // get context
    contextRef.current = (
      canvas.current.node()! as HTMLCanvasElement
    ).getContext("2d");

    // get context
    overlayContextRef.current = (
      overlayCanvas.current.node()! as HTMLCanvasElement
    ).getContext("2d");

    // initial draw with no zoom
    const drawAllPoints = async () => {
      const result = await draw(gxAxisRef.current!, gyAxisRef.current!);
      console.log(result);
    };

    drawAllPoints();

    canvas.current!.call(zoom);

    canvas.current!.on("mousemove click", (event: any) => {
      /*
      Need to convert
      FROM : mouse input (x, canvasHeight - y) in range (canvasWidth, canvasHeight)
      TO : to range (maxDataX, maxDataY)
       */

      // const hoveredX = (event.offsetX * maxDataX) / canvasWidth;
      // const hoveredY =
      //   ((canvasHeight - event.offsetY) * maxDataY) / canvasHeight;

      const transformedX = Math.floor(
        transformRef.current.invertX(event.offsetX) * (maxDataX / canvasWidth)
      );
      const transformedY = Math.floor(
        (canvasHeight - transformRef.current.invertY(event.offsetY)) *
          (maxDataY / canvasHeight)
      );

      // console.log(transformedX, transformedY);

      const result = quadSearch(
        quadTree,
        transformedX,
        transformedY,
        useSearchRadiusRef.current
      );
      //console.log(useSearchResult.current);
      if (result) {
        // console.log(result);
        drawOverlay(result, event.offsetX, event.offsetY);

        if (event.type === "click") {
          console.log("clicked");
          //update state
          setSearchResult(result);
          if (!toolTipShow) {
            setToolTipShow(true);
          }
        }
      }
    });

    // add zoom function
  }, [
    canvas,
    canvasHeight,
    canvasWidth,
    contextRef,
    data,
    draw,
    drawOverlay,
    maxDataX,
    maxDataY,
    overlayCanvas,
    overlayContextRef,
    quadTree,
    setToolTipShow,
    svg,
    toolTipShow,
    xAxis,
    yAxis,
    zoom,
  ]);

  return (
    <div className={`${c.container}`}>
      {toolTipShow && (
        <ToolTip
          className={c.toolTip}
          reset={resetHandler}
          setSearchRadius={setRadiusHandler}
          data={searchResult}
        />
      )}
      <div
        className={c.chartDiv}
        ref={chartContainerRef}
        style={{
          minWidth: `${outerWidth}px`,
          minHeight: `${outerHeight}px`,
        }}
      >
        <div className={c.svgContainer}>
          <svg width={dimensions.width} height={dimensions.height}>
            <g id="axes" transform={`translate(${margin.left}, ${margin.top})`}>
              <g id="gxAxis" transform={`translate(0, ${canvasHeight})`}></g>
              <g id="gyAxis"></g>
            </g>
          </svg>
        </div>
        <canvas
          id="graph"
          className={c.graphCanvas}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            marginLeft: margin.left + "px",
            marginTop: margin.top + "px",
          }}
        ></canvas>
        <canvas
          id="overlay"
          className={c.overlayCanvas}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            marginLeft: margin.left + "px",
            marginTop: margin.top + "px",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Canvas;
