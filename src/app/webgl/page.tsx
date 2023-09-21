"use client";
import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "../components/Button";

const WebGLChart = dynamic(() => import("../components/WebGLChart"), {
  ssr: false,
});

// https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-web-worker?file=pages%2Findex.tsx

const Page = () => {
  const workerRef = useRef<Worker>();
  const [bigData, setBigData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../helper/streamingTSVParser.ts", import.meta.url)
    );

    workerRef.current.onmessage = ({
      data: { items, totalBytes, finished },
    }) => {
      const rows = items
        .map((d: any) => ({
          ...d,
          x: Number(d.x),
          y: Number(d.y),
          year: Number(d.date),
        }))
        .filter((d: any) => d.year);

      setBigData((data) => data.concat(rows));

      if (finished) {
        console.log("finished loading data");
        setShowLoading(false);
      }
    };

    workerRef.current.postMessage("data.tsv");

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <section className="relative w-full h-full bg-blue-400">
      <Button className="top-20 left-10" href="/">
        Back
      </Button>
      <div className="flex flex-col justify-center w-full h-full pt-20 mx-auto px-4 py-4 sm:px-6">
        <div className="text-white text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            WebGL
          </h1>
          <p className="text-lg  max-w-md mx-auto">
            This page explores the different ways to visualise data despending
            on the number of datapoints
          </p>

          <p className="text-sm  max-w-none mx-auto pt-5 text-slate-200">
            The code is a reimplementation of{" "}
            <a
              className="underline text-emerald-green"
              href="https://github.com/ColinEberhardt/d3fc-webgl-hathi-explorer"
            >
              Colin Eberhardt&apos;s code
            </a>{" "}
            into React
          </p>
        </div>
        <WebGLChart className="px-10" data={bigData} />
      </div>
      {showLoading && (
        <div className="absolute flex flex-col justify-center item-center bottom-0 left-0 w-full h-full bg-slate-900 bg-opacity-90 text-center">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            Loading Data ...
          </h1>
        </div>
      )}
    </section>
  );
};

export default Page;
