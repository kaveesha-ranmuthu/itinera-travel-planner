import React from "react";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../hooks/useAuth";
import SimpleTooltip from "./SimpleTooltip";
import { FontFamily } from "../types/types";

interface InfoTooltipProps {
  content: string;
  width?: string;
  className?: string;
  theme?: "light" | "dark";
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  width,
  className,
  theme = "dark",
}) => {
  const { settings } = useAuth();

  return (
    <SimpleTooltip
      content={content}
      theme={theme}
      side="top"
      width={width ?? "w-50"}
      className={className}
    >
      <PiSealQuestionFill
        size={20}
        className={twMerge(
          "opacity-50 cursor-pointer",
          settings?.font === FontFamily.HANDWRITTEN ? "mt-2.5" : ""
        )}
      />
    </SimpleTooltip>
  );
};

export default InfoTooltip;
