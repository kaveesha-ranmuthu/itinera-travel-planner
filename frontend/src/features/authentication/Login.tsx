import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import FormWrapper from "../../components/FormWrapper";
import Logo from "../../components/Logo";
import { auth } from "../../config/firebase-config";
import { useHotToast } from "../../hooks/useHotToast";
import { getFirebaseErrorMessage } from "../../utils/helpers";
import { AuthenticationInput } from "./AuthenticationInput";
import { ContinueWithGoogle } from "./GoogleSignIn";
import { Heading } from "./Heading";
import { ResetPasswordFormInput } from "./ResetPassword";
import { SubmitButton } from "./SubmitButton";
import { OrDivider } from "./OrDivider";

export interface LoginFormInput extends ResetPasswordFormInput {
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { notify } = useHotToast();

  const formik = useFormik<LoginFormInput>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {} as LoginFormInput;
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
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate("/");
      } catch (error) {
        if (error instanceof FirebaseError) {
          const errorMessage = getFirebaseErrorMessage(error);
          notify(errorMessage, "error");
        } else {
          notify("Something went wrong. Please try again.", "error");
        }
      }
    },
  });

  return (
    <BackgroundWrapper>
      <div className="absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <FormWrapper>
          <form className="text-secondary" onSubmit={formik.handleSubmit}>
            <Heading>Log In</Heading>
            <AuthenticationInput
              label="email"
              inputId="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={
                formik.touched.email ? formik.errors.email : undefined
              }
            />
            <div className="mt-3">
              <AuthenticationInput
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
              <SubmitButton disabled={!formik.isValid}>Log In</SubmitButton>
            </div>
          </form>
          <div className="flex flex-col items-center mt-4 space-y-4">
            <OrDivider />
            <ContinueWithGoogle />
          </div>
        </FormWrapper>
        <div className="text-center mt-9 space-y-1">
          <Link
            to="/reset-password"
            className="cursor-pointer text-primary font-brand italic underline text-lg font-light tracking-wide"
          >
            Forgot password?
          </Link>
          <div className="text-primary font-brand italic text-lg font-light tracking-wide">
            Need an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Login;
