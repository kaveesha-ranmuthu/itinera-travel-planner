import Logo from "../../shared/components/ui/Logo";
import BackgroundWrapper from "../../shared/components/ui/BackgroundWrapper";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/ui/Button";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <BackgroundWrapper>
      <div className="absolute bottom-5 left-0 flex items-center justify-center w-full h-full animate-fade">
        <div className="text-center space-y-5">
          <Logo marginLeft="ml-24" />
          <Button.Primary
            onClick={() => navigate("/signup")}
            className="hover:scale-98 hover:opacity-90 transition ease-in-out duration-100"
          >
            Get Started
          </Button.Primary>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export const LoadingState = () => {
  return (
    <BackgroundWrapper>
      <div className="absolute bottom-5 left-0 flex items-center justify-center w-full h-full">
        <div className="text-center animate-pulse">
          <Logo marginLeft="ml-24" />
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default LandingPage;
