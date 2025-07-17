import Button, { ButtonProps } from "../../components/Button";

export const DeleteAccountButton: React.FC<ButtonProps> = ({ onClick }) => {
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
