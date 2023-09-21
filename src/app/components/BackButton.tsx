import Link from "next/link";
export const BackButton = ({ className }: { className?: string }) => {
  return (
    <>
      <Link
        className={`absolute max-sm:static max-sm:m-5 top-10 left-10 text-lg font-bold border border-white rounded p-3 font-extrabold leading-tighter uppercase text-white hover:bg-emerald-green hover:text-black hover:border-stone-800 hover:opacity-90 ${
          className ?? ""
        }`}
        href="/"
      >
        Back
      </Link>
    </>
  );
};
