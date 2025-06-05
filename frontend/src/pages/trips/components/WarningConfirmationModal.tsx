import React from "react";
import { CiWarning } from "react-icons/ci";
import { twMerge } from "tailwind-merge";
import { FontFamily } from "../../../types";
import PopupModal, { PopupModalProps } from "./PopupModal";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/Button";

interface WarningConfirmationModalProps extends PopupModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  primaryButtonText?: string;
  font?: string;
  hideIcon?: boolean;
}

const WarningConfirmationModal: React.FC<WarningConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  primaryButtonText,
  font,
  hideIcon = false,
}) => {
  const { settings } = useAuth();

  return (
    <PopupModal isOpen={isOpen} onClose={onClose} className={font}>
      <div className="flex items-start space-x-4">
        {!hideIcon && (
          <span
            className={settings?.font === FontFamily.HANDWRITTEN ? "mt-1" : ""}
          >
            <CiWarning size={35} />
          </span>
        )}
        <div>
          <div className="space-y-2">
            <p className="text-2xl text-secondary">{title}</p>
            <p className="text-secondary/70">{description}</p>
          </div>
          <div className="space-x-4 mt-7">
            <Button.Secondary
              className={twMerge(
                "normal-case not-italic",
                font ?? settings?.font
              )}
              type="button"
              onClick={onConfirm}
            >
              {primaryButtonText ?? "Delete"}
            </Button.Secondary>
            <Button.Primary
              className={twMerge(
                "normal-case not-italic border border-secondary",
                font ?? settings?.font
              )}
              onClick={onClose}
            >
              Cancel
            </Button.Primary>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default WarningConfirmationModal;
