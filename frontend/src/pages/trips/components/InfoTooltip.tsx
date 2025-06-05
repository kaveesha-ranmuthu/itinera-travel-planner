import React from "react";
import SimpleTooltip from "./SimpleTooltip";
import { PiSealQuestionFill } from "react-icons/pi";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import { FontFamily } from "../../../types";

interface InfoTooltipProps {
  content: string;
  width?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, width }) => {
  const { settings } = useAuth();

  return (
    <SimpleTooltip
      content={content}
      theme="dark"
      side="top"
      width={width ?? "w-50"}
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
