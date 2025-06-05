import React, { PropsWithChildren } from "react";
import { Tooltip } from "radix-ui";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../hooks/useAuth";

interface TooltipProps {
  content: string | React.ReactNode;
  iconStyles?: string;
  margin?: string;
  theme?: "light" | "dark";
  side?: "bottom" | "top" | "right" | "left";
  width?: string;
  className?: string;
}

const SimpleTooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  content,
  children,
  iconStyles,
  margin,
  theme = "light",
  side = "bottom",
  width,
  className,
}) => {
  const { settings } = useAuth();

  const lightStyles = "bg-primary text-secondary border border-secondary";
  const darkStyles = "bg-secondary text-primary";

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
            side={side}
            className={twMerge(
              "origin-[var(--radix-tooltip-content-transform-origin)] data-[state=closed]:animate-scale-out data-[state=delayed-open]:animate-scale-in rounded-md text-xs px-3 py-2 mt-1 tracking-wide z-20",
              theme === "light" ? lightStyles : darkStyles,
              settings?.font,
              margin,
              width,
              className
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
