"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import BrushIcon from "@mui/icons-material/Brush";
import Canvas from "./Canvas";
import { CanvasContextProvider } from "../context/CanvasContextProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Script from "next/script";
import { SampleData } from "../types/types";

interface Props {
  data: Array<SampleData>;
  time: string;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Plotter = (props: Props) => {
  const [toolTipShow, setToolTipShow] = useState(false);

  useEffect(() => {
    console.log(props.data.length);
    console.log(props.data);
  }, [props.data, props.data.length]);

  return (
    <CanvasContextProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Script
          type="text/javascript"
          src="https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js"
        />
        <div className="flex flex-col my-10 text-center items-center justify-center">
          {/* <h3 className="my-1">{props.time}</h3> */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter">
            D3 Scatter Plot
          </h1>
          <p className="text-lg max-w-md mx-auto font-extrabold text-slate-300">
            with (SVG + Canvas)
          </p>
          <div className="m-3">
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <Fab
                className="bg-white hover:bg-yellow-400"
                variant="extended"
                onClick={() => {
                  setToolTipShow(!toolTipShow);
                }}
              >
                <BrushIcon sx={{ mr: 1 }} />
                ToolBox
              </Fab>
            </Box>
          </div>
        </div>
        <Canvas
          data={props.data}
          toolTipShow={toolTipShow}
          setToolTipShow={setToolTipShow}
        />
      </ThemeProvider>
    </CanvasContextProvider>
  );
};

export default Plotter;
