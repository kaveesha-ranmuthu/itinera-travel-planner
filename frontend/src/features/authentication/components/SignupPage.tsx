import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import BackgroundWrapper from "../../../components/BackgroundWrapper";
import Button from "../../../components/Button";
import Logo from "../../../components/Logo";
import { auth } from "../../../config/firebase-config";
import { useHotToast } from "../../../hooks/useHotToast";
import FormWrapper from "../../../components/FormWrapper";
import { ContinueWithGoogle } from "./GoogleSignIn";
import { AuthenticationInput } from "./AuthenticationInput";
import { getFirebaseErrorMessage } from "../../../utils/helpers";
import { LoginFormInput } from "./LoginPage";
import { useCreateNewUser } from "../hooks/setters/useCreateNewUser";

interface SignupFormInput extends LoginFormInput {
  confirmPassword: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { notify } = useHotToast();
  const { createUser } = useCreateNewUser();

  const handleSignup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await createUser(userCredential.user);

      return null;
    } catch (error) {
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      return error;
    }
  };

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
      const error = await handleSignup(values.email, values.password);
      if (error) {
        if (error instanceof FirebaseError) {
          const errorMessage = getFirebaseErrorMessage(error);
          notify(errorMessage, "error");
        } else {
          notify("Something went wrong. Please try again.", "error");
        }
      } else {
        navigate("/");
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
              Sign Up
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
            <div className="mt-3 flex space-x-5">
              <div className="w-1/2">
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
              <div className="w-1/2">
                <AuthenticationInput
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
                Sign Up
              </Button.Secondary>
            </div>
          </form>
          <div className="flex flex-col items-center mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <hr className="border-0 border-b border-secondary w-28" />
              <p className="font-brand tracking-wide italic text-sm">OR</p>
              <hr className="border-0 border-b border-secondary w-28" />
            </div>
            <ContinueWithGoogle />
          </div>
        </FormWrapper>
        <div className="text-center mt-10 text-primary font-brand italic text-lg font-light tracking-wide">
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
