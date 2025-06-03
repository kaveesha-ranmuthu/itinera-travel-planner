import { useNavigate } from "react-router-dom";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";
import BackArrow from "./components/BackArrow";
import FormWrapper from "./components/FormWrapper";

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <BackgroundWrapper>
      <BackArrow />
      <div className="font-brand italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <FormWrapper>
          <h1 className="text-2xl mb-3 text-center">Settings</h1>
          <div>
            <Heading title="Account" />
            <div className="space-y-2">
              <div>
                <p className="text-lg">email</p>
                <p className="opacity-50">{user?.email}</p>
              </div>
              <div>
                <p className="text-lg">password</p>
                <p className="opacity-50 text-xs">●●●●●●●●●●●●</p>
              </div>
            </div>
            <div className="space-x-2">
              <Button.Primary
                onClick={() => navigate("/reset-password")}
                type="submit"
                className="mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
              >
                Reset password
              </Button.Primary>
              <Button.Danger
                type="submit"
                className="mt-4 px-4 py-1 text-base transition ease-in-out duration-300"
              >
                Delete account
              </Button.Danger>
            </div>
          </div>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

interface HeadingProps {
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ title }) => {
  return (
    <>
      <h1 className="text-xl">{title}</h1>
      <hr className="opacity-20 mb-2 mt-1" />
    </>
  );
};

export default AdvancedSettings;
