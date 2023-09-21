import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Slider from "@mui/material/Slider";
import EnhancedTable from "./DataBoard";
import { SampleData } from "../types/types";

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
    <div
      className={`text-center p-3 mx-2 my-1 max-w-2xl max-lg:max-w-xl max-md:max-w-md max-sm:max-w-sm rounded bg-emerald-green text-slate-900 ${
        className || ""
      }}`}
    >
      <div className="text-center m-2 ">
        <h3 className="max-sm:text-3xl text-4xl uppercase font-extrabold m-5">
          toolbox
        </h3>
        <ul className="max-w-xl text-center list-none m-auto">
          <li>Use Mouse-wheel to scroll</li>
          <li>Adjust radius to search more datapoints</li>
          <li>Click to create a table</li>
        </ul>
      </div>

      <div className="flex flex-row flex-wrap content-center item-center p-10 justify-around">
        <div>
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
        <div className="self-center">
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
  );
};

export default ToolTip;
