import fsPromises from "fs/promises";
import path from "path";
import { SampleData } from "../types/types";
import Plotter from "../components/Plotter";
import { parse } from "papaparse";
import { Button } from "../components/Button";

const getCSVData = async (f: string) => {
  const filePath = path.join(process.cwd(), f);
  const file = await fsPromises.readFile(filePath, "utf-8");
  const { data } = parse(file, {
    header: true,
    skipEmptyLines: true,
  });

  return data;
};

interface Time {
  datetime: string;
}

const getTime = async (): Promise<Time> => {
  const res = await fetch(
    "http://worldtimeapi.org/api/timezone/Europe/London",
    {
      next: {
        revalidate: 5,
      },
    }
  );

  return res.json();
};

const Page = async () => {
  const sampleData = getCSVData("./src/files/sample.csv") as Promise<
    Array<SampleData>
  >;
  const time = getTime() as Promise<Time>;
  const [promiseData, promiseTime] = await Promise.all([sampleData, time]);

  return (
    <div className="relative bg-purple-600">
      <Button className="inline-block text-center" href="/">
        Back
      </Button>
      <Plotter data={promiseData} time={promiseTime.datetime} />
    </div>
  );
};

export default Page;
