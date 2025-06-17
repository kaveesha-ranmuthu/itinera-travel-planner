import React from "react";
import PopupModal from "./PopupModal";
import TripsInput from "./TripsInput";
import Button from "../../../components/Button";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";

interface CreateCustomSectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCustomSectionPopup: React.FC<
  CreateCustomSectionPopupProps
> = ({ isOpen, onClose }) => {
  const { settings } = useAuth();
  return (
    <PopupModal isOpen={isOpen} onClose={onClose} className="w-fit">
      <h1 className="text-xl">Create a new section</h1>
      <h1 className="text-base mt-2 mb-1">
        What would you like to call this section?
      </h1>
      <TripsInput
        id="section-name"
        type="text"
        onChange={() => null}
        className="w-full rounded-sm"
      />
      <div className="w-full flex items-center justify-end space-x-2 mt-3">
        <Button.Primary
          className={twMerge(
            "normal-case not-italic border border-secondary text-sm",
            settings?.font
          )}
          onClick={onClose}
        >
          Cancel
        </Button.Primary>
        <Button.Secondary
          className={twMerge("normal-case text-sm not-italic", settings?.font)}
          type="submit"
        >
          Confirm
        </Button.Secondary>
      </div>
    </PopupModal>
  );
};
