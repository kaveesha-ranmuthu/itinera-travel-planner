import React from "react";
import SimpleTooltip from "../SimpleTooltip";
import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";

const PackingList = () => {
  const { settings } = useAuth();

  return (
    <div>
      <div className="flex items-center space-x-3 mb-5">
        <h1 className="text-3xl">packing list</h1>
        <SimpleTooltip
          content="Create a packing list from scratch or quickly copy over your default list. You can set up your default list in settings."
          theme="dark"
          side="top"
          width="w-50"
        >
          <PiSealQuestionFill
            size={20}
            className={twMerge(
              "opacity-50 cursor-pointer",
              settings?.font === FontFamily.HANDWRITTEN ? "mt-2.5" : ""
            )}
          />
        </SimpleTooltip>
      </div>
    </div>
  );
};

export default PackingList;
