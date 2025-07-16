import React from "react";
import Button, { ButtonProps } from "../../components/Button";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";

export const CreateTripButton: React.FC<ButtonProps> = ({ onClick }) => {
  const { settings } = useAuth();

  return (
    <Button.Primary
      className={twMerge(
        "border border-secondary normal-case text-lg hover:bg-secondary hover:text-primary hover:opacity-100 transition ease-in-out duration-500",
        settings?.font
      )}
      onClick={onClick}
      type="button"
    >
      Create new trip
    </Button.Primary>
  );
};
