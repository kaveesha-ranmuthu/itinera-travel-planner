import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { auth } from "../../firebase-config";
import { useHotToast } from "../../hooks/useHotToast";
import { FontFamily } from "../../types";
import FormWrapper from "./components/FormWrapper";
import { ContinueWithGoogle } from "./components/GoogleSignIn";
import { Input } from "./components/Input";
import { getFirebaseErrorMessage, setUserSettings } from "./helpers";
import { LoginFormInput } from "./LoginPage";

interface SignupFormInput extends LoginFormInput {
  confirmPassword: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { notify } = useHotToast();

  const formik = useFormik<SignupFormInput>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {} as SignupFormInput;

      if (!values.email) {
        errors.email = "Please enter an email address";
      }
      if (!values.password) {
        errors.password = "Please enter a password";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        setUserSettings(userCredential.user, {
          font: FontFamily.HANDWRITTEN,
        });
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
      <div className="absolute left-0 top-0 flex flex-col items-center justify-center w-full">
        <Logo scale="scale-70" />
        <FormWrapper>
          <form className="text-secondary" onSubmit={formik.handleSubmit}>
            <h1 className="font-brand uppercase italic text-3xl font-light text-center">
              sign up
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
            <div className="mt-6 flex space-x-5">
              <div className="w-1/2">
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
              <div className="w-1/2">
                <Input
                  label="confirm password"
                  inputId="confirmPassword"
                  isPassword
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                />
              </div>
            </div>
            <div className="text-center mt-8">
              <Button.Secondary type="submit" disabled={!formik.isValid}>
                Sign up
              </Button.Secondary>
            </div>
          </form>
          <div className="flex flex-col items-center mt-6 space-y-6">
            <div className="flex items-center space-x-4">
              <hr className="border-0 border-b border-secondary w-28" />
              <p className="font-brand italic">OR</p>
              <hr className="border-0 border-b border-secondary w-28" />
            </div>
            <ContinueWithGoogle />
          </div>
        </FormWrapper>
        <div className="text-center mt-10 text-primary cursor-pointer font-brand italic text-lg font-light tracking-wide">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default SignupPage;
