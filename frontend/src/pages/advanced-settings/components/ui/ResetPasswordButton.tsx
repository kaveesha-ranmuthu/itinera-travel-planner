import React from "react";
import Button from "../../../../shared/components/ui/Button";
import SimpleTooltip from "../../../trips/components/SimpleTooltip";

interface ResetPasswordButtonProps {
  isPasswordResetAllowed: boolean;
  onResetPasswordClick?: () => void;
}

export const ResetPasswordButton: React.FC<ResetPasswordButtonProps> = ({
  isPasswordResetAllowed,
  onResetPasswordClick,
}) => {
  if (isPasswordResetAllowed) {
    return (
      <Button.Primary
        onClick={onResetPasswordClick}
        type="button"
        className="mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
      >
        Reset password
      </Button.Primary>
    );
  }

  return (
    <SimpleTooltip
      content="Password reset is not available for Google sign-in. Please manage your password through your Google account settings."
      side="top"
      theme="dark"
      margin="mb-3 font-brand italic tracking-wide text-sm"
      width="w-60"
    >
      <Button.Primary
        disabled={true}
        type="button"
        className="disabled:opacity-40 mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
      >
        Reset password
      </Button.Primary>
    </SimpleTooltip>
  );
};
