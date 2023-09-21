import { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
export const Button = ({
  className,
  children,
  href,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      className={`absolute max-sm:static max-sm:m-5 top-10 left-10 text-lg font-bold border border-white rounded p-3 font-extrabold leading-tighter uppercase text-white hover:bg-emerald-green hover:text-black hover:border-stone-800 hover:opacity-90 ${
        className ?? ""
      }`}
      onClick={onClick}
    >
      {href && <Link href={href}>{children}</Link>}
    </button>
  );
};
