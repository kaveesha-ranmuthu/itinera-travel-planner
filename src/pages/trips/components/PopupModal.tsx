import { Dialog } from "radix-ui";
import React, { PropsWithChildren, ReactNode } from "react";

interface PopupModalProps {
  triggerElement: ReactNode;
}

const PopupModal: React.FC<PropsWithChildren<PopupModalProps>> = ({
  triggerElement,
  children,
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{triggerElement}</Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content className="absolute left-1/2 top-1/2 border -translate-x-1/2 border-secondary bg-primary w-xl rounded-2xl p-5">
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PopupModal;
