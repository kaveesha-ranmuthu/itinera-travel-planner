import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import FormWrapper from "../../components/FormWrapper";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";
import { Preferences } from "./Preferences";
import { AccountSettings } from "./AccountSettings";

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) navigate("/");

  return (
    <BackgroundWrapper>
      <BackArrow />
      <div className="font-brand tracking-wide italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <FormWrapper className="py-9">
          <h1 className="text-2xl mb-3 text-center">Settings</h1>
          <div className="space-y-6">
            <Preferences />
            <AccountSettings />
          </div>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

export default AdvancedSettings;
