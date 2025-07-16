import React, { useState } from "react";
import PopupModal from "../../components/PopupModal";
import TripsInput from "../../components/TripsInput";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import { debounce } from "lodash";
import { useHotToast } from "../../hooks/useHotToast";

interface CreateCustomSectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentCollections: string[];
  onConfirm: (sectionName: string) => void;
}

export const CreateCustomSectionPopup: React.FC<
  CreateCustomSectionPopupProps
> = ({ isOpen, onClose, currentCollections, onConfirm }) => {
  const { settings } = useAuth();
  const { notify } = useHotToast();

  const [sectionName, setSectionName] = useState("");

  const handleChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSectionName(event.target.value);
    },
    300
  );

  return (
    <PopupModal isOpen={isOpen} onClose={onClose} className="w-fit">
      <h1 className="text-xl">Create a new section</h1>
      <h1 className="text-base mt-2 mb-1">
        What would you like to call this section?
      </h1>
      <TripsInput
        id="section-name"
        type="text"
        onChange={handleChange}
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
          onClick={() => {
            const trimmedSectionName = sectionName.trim();
            if (!trimmedSectionName) {
              notify("Please enter a section name.", "info");
              return;
            }

            if (currentCollections.includes(trimmedSectionName)) {
              notify(
                "Section already exists. Please choose a different name.",
                "info"
              );
              return;
            }
            onConfirm(trimmedSectionName);
            onClose();
          }}
        >
          Confirm
        </Button.Secondary>
      </div>
    </PopupModal>
  );
};
