import React from "react";
import Button from "../../../../shared/components/ui/Button";

interface GoogleSignInButtonProps {
  onClick: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
}) => {
  return (
    <Button.Primary
      className="border border-secondary"
      type="button"
      onClick={onClick}
    >
      Continue with Google
    </Button.Primary>
  );
};
