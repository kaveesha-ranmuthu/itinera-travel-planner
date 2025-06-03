import { PiSealQuestionFill } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import Button from "../../../../components/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { FontFamily } from "../../../../types";
import SimpleTooltip from "../SimpleTooltip";

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
      <div className="border border-secondary rounded-2xl p-4 space-y-4 text-center py-10">
        <div>
          <Button.Secondary
            className={twMerge("normal-case not-italic w-2/3", settings?.font)}
          >
            <span>Copy over default packing list</span>
          </Button.Secondary>
        </div>
        <div className="flex justify-center w-full">
          <div className="flex items-center space-x-4">
            <hr className="border-0 border-b border-secondary w-32" />
            <p className="font-brand italic">OR</p>
            <hr className="border-0 border-b border-secondary w-32" />
          </div>
        </div>
        <div>
          <Button.Primary
            className={twMerge(
              "border border-secondary w-2/3 normal-case not-italic",
              settings?.font
            )}
          >
            <span>Make a new list</span>
          </Button.Primary>
        </div>
      </div>
    </div>
  );
};

export default PackingList;
