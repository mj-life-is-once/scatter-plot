import { ReactNode } from "react";

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${
        className ?? ""
      } rounded-lg drop-shadow-md max-w-xs max-h-md bg-white text-slate-600 p-10 hover:bg-emerald-green [&>a]:bg-yellow-300`}
    >
      {children}
    </div>
  );
};
