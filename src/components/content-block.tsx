import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ContentBlock = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "bg-[#F7F8FA] shadow-md rounded-md overflow-hidden h-full w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentBlock;
