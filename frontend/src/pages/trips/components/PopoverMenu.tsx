import React, { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FontFamily } from "../../../types/types";

interface PopoverProps {
  popoverTrigger: ReactNode;
  popoverWidth?: string;
  panelClassName?: string;
  className?: string;
  anchor?: "bottom end" | "bottom start";
}

const PopoverMenu: React.FC<PropsWithChildren<PopoverProps>> = ({
  popoverTrigger,
  children,
  className,
  popoverWidth,
  panelClassName,
  anchor,
}) => {
  return (
    <Popover className={twMerge("relative", className)}>
      <PopoverButton className="focus:outline-0">
        {popoverTrigger}
      </PopoverButton>
      <PopoverPanel
        anchor={anchor ?? "bottom end"}
        transition
        className={twMerge(
          "transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 h-60 mr-7 z-20 rounded-xl px-4 py-4 bg-primary border border-secondary drop-shadow-(--drop-shadow-default)",
          FontFamily.HANDWRITTEN,
          popoverWidth || "w-xs",
          panelClassName
        )}
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default PopoverMenu;
