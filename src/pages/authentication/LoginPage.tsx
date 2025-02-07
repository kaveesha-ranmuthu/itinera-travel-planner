import BackgroundWrapper from "../../components/BackgroundWrapper";
import Logo from "../../components/Logo";
import FormWrapper from "./components/FormWrapper";
import { InputText } from "./components/Input";

const LoginPage = () => {
  return (
    <BackgroundWrapper>
      <div className="absolute left-0 top-0 flex flex-col items-center justify-center w-full">
        <Logo scale="scale-70" />
        <FormWrapper>
          <form className="text-secondary">
            <h1 className="font-brand uppercase italic text-3xl font-light text-center">
              Log in
            </h1>
            <InputText label="email" inputId="email" />
          </form>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

export default LoginPage;
