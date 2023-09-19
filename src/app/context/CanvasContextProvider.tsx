import {
  ReactNode,
  createContext,
  useRef,
  MutableRefObject,
  useMemo,
} from "react";

interface CanvasContextInterface {
  contextRef: MutableRefObject<CanvasRenderingContext2D | null>;
  overlayContextRef: MutableRefObject<CanvasRenderingContext2D | null>;
  canvas: MutableRefObject<d3.Selection<
    HTMLCanvasElement,
    unknown,
    HTMLElement,
    any
  > | null>;
  overlayCanvas: MutableRefObject<d3.Selection<
    HTMLCanvasElement,
    unknown,
    HTMLElement,
    any
  > | null>;
  svg: MutableRefObject<d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > | null>;
}
// const pointColor = "#3585ff";

export const Canvas2DContext = createContext<CanvasContextInterface>({
  contextRef: { current: null },
  overlayContextRef: { current: null },
  canvas: { current: null },
  overlayCanvas: { current: null },
  svg: { current: null },
});

export const CanvasContextProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const overlayContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvas = useRef<d3.Selection<
    HTMLCanvasElement,
    unknown,
    HTMLElement,
    any
  > | null>(null);
  const overlayCanvas = useRef<d3.Selection<
    HTMLCanvasElement,
    unknown,
    HTMLElement,
    any
  > | null>(null);
  const svg = useRef<d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  > | null>(null);

  const value = useMemo(
    () => ({ contextRef, overlayContextRef, canvas, overlayCanvas, svg }),
    [contextRef, overlayContextRef, canvas, overlayCanvas, svg]
  );

  return (
    <Canvas2DContext.Provider value={value}>
      {children}
    </Canvas2DContext.Provider>
  );
};
