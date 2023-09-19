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
import c from "./Plotter.module.css";
import { SampleData } from "../types/types";

interface Props {
  data: Array<SampleData>;
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
        <div className={c.title}>
          <h1>D3 Scatter Plot</h1>
          <p>with (SVG + Canvas)</p>
          <div className={c.toolbox}>
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <Fab
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
