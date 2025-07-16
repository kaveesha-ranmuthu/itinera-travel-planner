import React, { PropsWithChildren } from "react";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";
import { twMerge } from "tailwind-merge";

interface SmallButtonProps {
  onClick: () => void;
  className?: string;
}

const SmallButton: React.FC<PropsWithChildren<SmallButtonProps>> = ({
  onClick,
  children,
  className,
}) => {
  const { settings } = useAuth();
  return (
    <Button.Primary
      type="button"
      onClick={onClick}
      className={twMerge(
        "border border-secondary normal-case text-xs px-3 not-italic",
        settings?.font,
        className
      )}
    >
      {children}
    </Button.Primary>
  );
};

export default SmallButton;
