import React, { PropsWithChildren } from "react";
import { Tooltip } from "radix-ui";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../hooks/useAuth";

interface TooltipProps {
  content: string | React.ReactNode;
  iconStyles?: string;
}

const SimpleTooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  content,
  children,
  iconStyles,
}) => {
  const { settings } = useAuth();

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
            className={twMerge(
              "bg-primary rounded-md text-xs px-3 py-2 text-secondary border border-secondary mt-1 tracking-wide",
              settings?.font
            )}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default SimpleTooltip;
