import { useNavigate } from "react-router-dom";
import BackgroundWrapper from "../../../../shared/components/ui/BackgroundWrapper";
import Logo from "../../../../shared/components/ui/Logo";
import { useAuth } from "../../../../shared/hooks/useAuth";
import BackArrow from "../ui/BackArrow";
import FormWrapper from "../ui/FormWrapper";
import { AccountSettings } from "./AccountSettings";
import { UserPreferences } from "./UserPreferences";

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/");
    return;
  }

  return (
    <BackgroundWrapper>
      <BackArrow />
      <div className="font-brand tracking-wide italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <FormWrapper className="py-9">
          <h1 className="text-2xl mb-3 text-center">Settings</h1>
          <div className="space-y-6">
            <UserPreferences />
            <AccountSettings user={user} />
          </div>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

export default AdvancedSettings;
