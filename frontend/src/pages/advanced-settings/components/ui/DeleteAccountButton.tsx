import React from "react";
import Button from "../../../../shared/components/ui/Button";

interface DeleteAccountButtonProps {
  onClick: () => void;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({
  onClick,
}) => {
  return (
    <Button.Danger
      type="button"
      className="mt-4 px-4 py-1 text-base transition ease-in-out duration-300"
      onClick={onClick}
    >
      Delete account
    </Button.Danger>
  );
};

export default DeleteAccountButton;
