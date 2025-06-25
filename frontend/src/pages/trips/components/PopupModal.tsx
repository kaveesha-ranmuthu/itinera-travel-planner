import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { PropsWithChildren } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import { twMerge } from "tailwind-merge";

export interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalWidth?: string;
  className?: string;
  lightOpacity?: boolean;
}

const PopupModal: React.FC<PropsWithChildren<PopupModalProps>> = ({
  isOpen,
  onClose,
  children,
  modalWidth,
  className,
  lightOpacity = false,
}) => {
  const { settings } = useAuth();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transition
      className={twMerge(
        "relative z-10 transition duration-400 ease-out data-[closed]:opacity-0",
        settings?.font
      )}
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogBackdrop
          className={twMerge(
            "fixed inset-0",
            lightOpacity ? `bg-secondary/20` : "bg-secondary/80"
          )}
        />
        <DialogPanel
          className={twMerge(
            "absolute border border-secondary bg-primary w-xl rounded-2xl p-5",
            modalWidth,
            className
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PopupModal;
