import { Popover } from "radix-ui";
import React, { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FontFamily } from "../../../types";

interface PopoverProps {
  popoverTrigger: ReactNode;
}

const PopoverMenu: React.FC<PropsWithChildren<PopoverProps>> = ({
  popoverTrigger,
  children,
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{popoverTrigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={twMerge(
            "mr-7 mt-2 rounded-xl px-4 py-4 bg-primary border border-secondary w-2xs drop-shadow-(--drop-shadow-default)",
            FontFamily.HANDWRITTEN
          )}
          sideOffset={5}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PopoverMenu;
