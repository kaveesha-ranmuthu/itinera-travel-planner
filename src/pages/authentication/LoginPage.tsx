import BackgroundWrapper from "../../components/BackgroundWrapper";
import Logo from "../../components/Logo";
import FormWrapper from "./components/FormWrapper";
import { Input } from "./components/Input";
import Button from "../../components/Button";
import SignInWithGoogle from "./components/GoogleIcons";
import { useFormik } from "formik";

type FormInput = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const formik = useFormik<FormInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {} as FormInput;
      const emailRegEx = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

      if (!values.email) {
        errors.email = "Please enter an email address";
      } else if (!emailRegEx.test(values.email)) {
        errors.email = "Please use a valid email like name@example.com.";
      }
      if (!values.password) {
        errors.password = "Please enter a password";
      }

      return errors;
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <BackgroundWrapper>
      <div className="absolute left-0 top-0 flex flex-col items-center justify-center w-full">
        <Logo scale="scale-70" />
        <FormWrapper>
          <form className="text-secondary" onSubmit={formik.handleSubmit}>
            <h1 className="font-brand uppercase italic text-3xl font-light text-center">
              Log in
            </h1>
            <Input
              label="email"
              inputId="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.email ? formik.errors.email : undefined
              }
            />
            <div className="mt-6">
              <Input
                label="password"
                inputId="password"
                isPassword
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                errorMessage={
                  formik.touched.password ? formik.errors.password : undefined
                }
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
