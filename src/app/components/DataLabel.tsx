import { GalaxyData } from "../types/types";
import c from "./DataLabel.module.css";

const DataLabel = ({ data }: { data: GalaxyData }) => {
  return (
    <div className={c.label}>
      <h1>{data.parallax.toString()}</h1>
      <ul>
        <li>{data.longitude.toString()}</li>
        <li>{data.latitude.toString()}</li>
      </ul>
    </div>
  );
};
export default DataLabel;
