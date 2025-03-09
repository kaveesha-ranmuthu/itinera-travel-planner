import SimpleTooltip from "../SimpleTooltip";
import { PiSealQuestionFill } from "react-icons/pi";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import { twMerge } from "tailwind-merge";

const Itinerary = () => {
  const { settings } = useAuth();
  return (
    <div className="text-secondary">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl">itinerary</h1>
        <SimpleTooltip content="" theme="dark" side="top" width="w-50">
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

export default Itinerary;
