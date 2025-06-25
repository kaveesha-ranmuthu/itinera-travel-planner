import React from "react";
import Button from "./Button";

interface ButtonsProps {
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Buttons: React.FC<ButtonsProps> = ({
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="space-x-2">
      <Button.Secondary
        onClick={onConfirm}
        type="submit"
        className="border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
      >
        {confirmText}
      </Button.Secondary>
      <Button.Primary
        onClick={onCancel}
        type="button"
        className="border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
      >
        {cancelText}
      </Button.Primary>
    </div>
  );
};
