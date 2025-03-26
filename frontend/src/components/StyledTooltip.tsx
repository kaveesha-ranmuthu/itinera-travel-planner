import React, { PropsWithChildren } from "react";
import { Tooltip } from "radix-ui";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  content: string;
  iconStyles?: string;
}

const StyledTooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  content,
  children,
  iconStyles,
}) => {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={twMerge(iconStyles, "cursor-pointer")}>
            {children}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            className="bg-red-sienna rounded-md p-3 text-primary font-brand italic mt-1 tracking-wide"
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default StyledTooltip;
