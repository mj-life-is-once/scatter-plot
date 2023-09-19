import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Slider from "@mui/material/Slider";
import EnhancedTable from "./DataBoard";
import { SampleData } from "../types/types";
import c from "./ToolTip.module.css";

const marks = [
  {
    value: 10,
    label: "10px",
  },
  {
    value: 101,
    label: "100px",
  },
];

const ToolTip = ({
  reset,
  setSearchRadius,
  className,
  data,
}: {
  reset: any;
  setSearchRadius: any;
  className?: string;
  data: Array<SampleData>;
}) => {
  const [value, setValue] = useState<number | number[]>(10);
  const onSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
      setSearchRadius(newValue);
    }
  };
  return (
    <div className={`${c.tooltip} ${className || ""}}`}>
      <div className={c.titleBox}>
        <h1>toolbox</h1>
        <ul>
          <li>Use Mouse-wheel to scroll</li>
          <li>Adjust radius to search more datapoints</li>
          <li>Click to create a table</li>
        </ul>
      </div>

      <div className={c.allTools}>
        <div className={c.toolGroup}>
          <div className={c.sliderGroup}>
            <div>
              <p>{`Search Radius: ${value} px`}</p>
            </div>
            <Slider
              defaultValue={10}
              valueLabelDisplay="auto"
              min={10}
              max={100}
              marks={marks}
              onChange={onSliderChange}
            />
          </div>
          <div className={c.ButtonGroup}>
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
            >
              <Button id="reset" onClick={reset}>
                Reset
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <EnhancedTable data={data} />
      </div>
    </div>
  );
};

export default ToolTip;
