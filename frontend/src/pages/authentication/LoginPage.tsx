import BackgroundWrapper from "../../shared/components/ui/BackgroundWrapper";
import Logo from "../../shared/components/ui/Logo";
import FormWrapper from "./components/FormWrapper";
import { AuthenticationInput } from "./components/AuthenticationInput";
import Button from "../../shared/components/ui/Button";
import { ContinueWithGoogle } from "./components/GoogleSignIn";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useHotToast } from "../../shared/hooks/useHotToast";
import { FirebaseError } from "firebase/app";
import { getFirebaseErrorMessage } from "./helpers";
import { ResetPasswordFormInput } from "./ResetPassword";

export interface LoginFormInput extends ResetPasswordFormInput {
  password: string;
}

const LoginPage = () => {
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
            <h1 className="font-brand tracking-wide italic text-2xl font-light text-center">
              Log In
            </h1>
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
              <Button.Secondary type="submit">Log In</Button.Secondary>
            </div>
          </form>
          <div className="flex flex-col items-center mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <hr className="border-0 border-b border-secondary w-28" />
              <p className="font-brand italic text-sm tracking-wide">OR</p>
              <hr className="border-0 border-b border-secondary w-28" />
            </div>
            <ContinueWithGoogle />
          </div>
        </FormWrapper>
        <div className="text-center mt-9 space-y-1">
          <Link
            to="/reset-password"
            className="cursor-pointer text-primary font-brand tracking-wide italic underline text-lg font-light tracking-wide"
          >
            Forgot password?
          </Link>
          <div className="text-primary font-brand tracking-wide italic text-lg font-light tracking-wide">
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

export default LoginPage;
