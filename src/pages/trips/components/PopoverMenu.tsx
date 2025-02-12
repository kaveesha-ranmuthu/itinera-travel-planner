import React, { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FontFamily } from "../../../types";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface PopoverProps {
  popoverTrigger: ReactNode;
  popoverWidth?: string;
  className?: string;
}

const PopoverMenu: React.FC<PropsWithChildren<PopoverProps>> = ({
  popoverTrigger,
  children,
  className,
  popoverWidth,
}) => {
  return (
    <Popover className={twMerge("relative", className)}>
      <PopoverButton>{popoverTrigger}</PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        className={twMerge(
          "h-60 mr-7 rounded-xl px-4 py-4 bg-primary border border-secondary drop-shadow-(--drop-shadow-default)",
          FontFamily.HANDWRITTEN,
          popoverWidth || "w-xs"
        )}
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default PopoverMenu;
