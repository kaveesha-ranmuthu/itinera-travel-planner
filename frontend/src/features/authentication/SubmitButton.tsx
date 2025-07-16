import React, { PropsWithChildren } from "react";
import Button from "../../components/Button";

interface SubmitButtonProps {
  disabled?: boolean;
}

export const SubmitButton: React.FC<PropsWithChildren<SubmitButtonProps>> = ({
  disabled,
  children,
}) => {
  return (
    <Button.Secondary type="submit" disabled={disabled}>
      {children}
    </Button.Secondary>
  );
};
