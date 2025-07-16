import Button, { ButtonProps } from "../../components/Button";
import SimpleTooltip from "../../components/SimpleTooltip";

interface ResetPasswordButtonProps extends ButtonProps {
  isPasswordResetAllowed?: boolean;
}

export const ResetPasswordButton: React.FC<ResetPasswordButtonProps> = ({
  isPasswordResetAllowed = false,
  onClick,
}) => {
  if (!isPasswordResetAllowed) return;
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
  </SimpleTooltip>;

  return (
    <Button.Primary
      onClick={onClick}
      type="button"
      className="mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
    >
      Reset password
    </Button.Primary>
  );
};
