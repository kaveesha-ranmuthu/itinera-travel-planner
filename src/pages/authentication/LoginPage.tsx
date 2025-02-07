import { useForm } from "react-hook-form";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import Logo from "../../components/Logo";
import FormWrapper from "./components/FormWrapper";
import { Input } from "./components/Input";
import Button from "../../components/Button";
import SignInWithGoogle from "./components/GoogleIcons";

type FormInput = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>();

  const emailRegEx = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

  const onSubmit = (data: FormInput) => {
    console.log(data);
  };

  console.log(errors);

  return (
    <BackgroundWrapper>
      <div className="absolute left-0 top-0 flex flex-col items-center justify-center w-full">
        <Logo scale="scale-70" />
        <FormWrapper>
          <form className="text-secondary" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="font-brand uppercase italic text-3xl font-light text-center">
              Log in
            </h1>
            <Input
              label="email"
              inputId="email"
              register={register("email", {
                required: true,
                pattern: emailRegEx,
              })}
            />
            <div className="mt-6">
              <Input
                label="password"
                inputId="password"
                register={register("password", { required: true })}
                isPassword
              />
            </div>
            <div className="text-center mt-8">
              <Button.Secondary
                type="submit"
                className="hover:bg-secondary-hover transition ease-in-out duration-300"
              >
                Log in
              </Button.Secondary>
            </div>
          </form>
          <div className="flex flex-col items-center mt-6 space-y-6">
            <div className="flex items-center space-x-4">
              <hr className="border-0 border-b border-secondary w-28" />
              <p className="font-brand italic">OR</p>
              <hr className="border-0 border-b border-secondary w-28" />
            </div>
            <SignInWithGoogle />
          </div>
        </FormWrapper>
        <div className="text-center mt-3 space-y-1">
          <div className="cursor-pointer text-primary font-brand italic underline text-lg font-light tracking-wide">
            Forgot password?
          </div>
          <div className="text-primary cursor-pointer font-brand italic text-lg font-light tracking-wide">
            Need an account? <span className="underline">Sign up</span>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default LoginPage;
