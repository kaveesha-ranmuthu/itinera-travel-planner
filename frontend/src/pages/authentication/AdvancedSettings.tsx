import { FaArrowLeft } from "react-icons/fa";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import Logo from "../../components/Logo";
import FormWrapper from "./components/FormWrapper";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthenticationInput } from "./components/AuthenticationInput";

const AdvancedSettings = () => {
  const navigate = useNavigate();

  return (
    <BackgroundWrapper>
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="z-10 absolute cursor-pointer hover:opacity-80 transition ease-in-out duration-300 text-primary left-3 top-5 flex items-center"
      >
        <IoIosArrowRoundBack className="text-primary" size={30} />
        <span className="font-brand italic text-lg">Go back</span>
      </button>
      <div className="font-brand italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <FormWrapper>
          <h1 className="text-2xl">Settings</h1>
          <div>
            <h1 className="text-lg">Update profile</h1>
            <AuthenticationInput
              label="email"
              inputId="email"
              onChange={() => null}
              onBlur={() => null}
            />
          </div>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

export default AdvancedSettings;
