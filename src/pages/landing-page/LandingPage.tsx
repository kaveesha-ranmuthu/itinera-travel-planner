import Logo from "../../components/Logo";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <BackgroundWrapper>
      <div className="absolute bottom-5 left-0 flex items-center justify-center w-full h-full">
        <div className="text-center space-y-5">
          <Logo />
          <button
            onClick={() => navigate("/login")}
            className="hover:scale-98 transition ease-in-out duration-100  font-brand cursor-pointer italic uppercase bg-primary text-secondary px-7 py-1.5 rounded-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default LandingPage;
