import React, { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FontFamily } from "../../../types";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

interface PopoverProps {
  popoverTrigger: ReactNode;
}

const PopoverMenu: React.FC<PropsWithChildren<PopoverProps>> = ({
  popoverTrigger,
  children,
}) => {
  return (
    <Popover className="relative">
      <PopoverButton>{popoverTrigger}</PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        className={twMerge(
          "PopoverContent mr-7 rounded-xl px-4 py-4 bg-primary border border-secondary w-xs drop-shadow-(--drop-shadow-default)",
          FontFamily.HANDWRITTEN
        )}
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default PopoverMenu;
