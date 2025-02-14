import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { PropsWithChildren } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalWidth?: string;
}

const PopupModal: React.FC<PropsWithChildren<PopupModalProps>> = ({
  isOpen,
  onClose,
  children,
  modalWidth,
}) => {
  const { settings } = useAuth();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={twMerge("relative z-10", settings?.font)}
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogBackdrop className="fixed inset-0 bg-secondary/80" />
        <DialogPanel
          className={twMerge(
            "absolute border border-secondary bg-primary w-xl rounded-2xl p-5",
            modalWidth
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PopupModal;
