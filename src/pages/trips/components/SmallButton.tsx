import React, { PropsWithChildren } from "react";
import Button from "../../../components/Button";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";

interface SmallButtonProps {
  onClick: () => void;
}

const SmallButton: React.FC<PropsWithChildren<SmallButtonProps>> = ({
  onClick,
  children,
}) => {
  const { settings } = useAuth();
  return (
    <Button.Primary
      type="button"
      onClick={onClick}
      className={twMerge(
        "border border-secondary normal-case text-xs px-3 not-italic",
        settings?.font
      )}
    >
      {children}
    </Button.Primary>
  );
};

export default SmallButton;
