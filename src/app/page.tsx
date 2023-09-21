import { Card } from "./components/Card";
import Link from "next/link";
const Page = async () => {
  return (
    <section className="relative w-full h-full bg-cyan-600">
      <div className="container flex flex-col max-w-3xl mx-auto py-20 px-4 py-4 sm:px-6">
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            D3JS Experiments
          </h1>
          <p className="text-lg  max-w-md mx-auto">
            This page explores the different ways to visualise data despending
            on the number of datapoints
          </p>
        </div>
        <div className="flex max-lg:flex-row max-md:flex-col jusitfy-center flex-wrap gap-4 [&>h1]: lg:text-3xl md:text-3xl sm:text-3xl font-bold leading-tighter tracking-tighter mb-4">
          {/* <Card className="bg-slate-900">
            <h1>SVG Chart</h1>
          </Card> */}
          <Card className="bg-slate-900">
            <h1 className="pb-5">Canvas Chart with SVG domains</h1>
            <Link href="/canvas">Explore</Link>
          </Card>
          <Card className="bg-slate-900">
            <h1 className="pb-5">WebGL Chart with SVG domains</h1>
            <Link href="/webgl">Explore</Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Page;
