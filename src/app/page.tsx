import { Card } from "./components/Card";
import Link from "next/link";
const Page = async () => {
  return (
    <section className="relative w-full h-full bg-cyan-600">
      <div className="container flex flex-col h-full justify-around max-w-3xl mx-auto px-4 py-4 sm:px-6">
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            D3JS Experiments
          </h1>
          <p className="text-lg max-w-md mx-auto">
            This page explores the different ways to visualise data depending on
            the number of datapoints
          </p>
          <p className="inline-block max-w-none mt-5 underline font-bold text-slate-300">
            <a
              className="text-lg max-w-md mx-auto"
              href="https://github.com/mj-life-is-once/scatter-plot"
            >
              Source Code
            </a>
          </p>
        </div>
        <div className="relative flex max-lg:flex-row max-md:flex-col jusitfy-center flex-wrap gap-4 [&>h1]: lg:text-3xl md:text-3xl sm:text-3xl font-bold leading-tighter tracking-tighter mb-4">
          <Card className="bg-slate-900">
            <h1 className="pb-5">Canvas Chart with SVG domains</h1>
            <p className="font-bold pb-10 text-lg">~10k datapoints</p>
            <Link
              className="absolute right-10 bottom-5 inline-block"
              href="/canvas"
            >
              Explore
            </Link>
            <p></p>
          </Card>
          <Card className="bg-slate-900">
            <h1 className="pb-5">WebGL Chart with SVG domains</h1>
            <p className="pb-10 text-lg">~1M datapoints</p>
            <Link
              className="absolute right-10 bottom-5 inline-block"
              href="/webgl"
            >
              Explore
            </Link>
          </Card>
        </div>
        <div className="text-center">
          <ul className="text-lg">
            Resource
            <li className="text-sm pt-2 underline">
              <a href="https://blog.scottlogic.com/2020/05/01/rendering-one-million-points-with-d3.html">
                Rendering One Million Datapoints with D3 and WebGL by Scott
                Logic
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Page;
