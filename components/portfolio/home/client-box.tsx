import { ReactNode } from "react";

type ClientBoxProps = {
  children: ReactNode;
};

export default function ClientBox({ children }: ClientBoxProps) {
  return (
    <div className="flex items-center justify-center max-h-20 min-h-20 min-w-[10rem] border border-neutral-10 rounded-lg">
      {children}
    </div>
  );
}
