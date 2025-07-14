import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useFormik } from "formik";
import BackgroundWrapper from "../components/BackgroundWrapper";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { auth } from "../config/firebase-config";
import { useHotToast } from "../hooks/useHotToast";
import { AuthenticationInput } from "../features/authentication-input/components/AuthenticationInput";
import BackArrow from "../components/BackArrow";
import FormWrapper from "../components/FormWrapper";
import { getFirebaseErrorMessage } from "../utils/helpers";

export interface ResetPasswordFormInput {
  email: string;
}

const ResetPassword = () => {
  const { notify } = useHotToast();

  const formik = useFormik<ResetPasswordFormInput>({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const errors = {} as ResetPasswordFormInput;
      const emailRegEx = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

      if (!values.email) {
        errors.email = "Please enter an email address";
      } else if (!emailRegEx.test(values.email)) {
        errors.email = "Please use a valid email like name@example.com.";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        notify("Reset link sent! Check your email.", "info");
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
      <BackArrow />
      <div className="absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <FormWrapper>
          <form className="text-secondary" onSubmit={formik.handleSubmit}>
            <h1 className="font-brand tracking-wide italic text-2xl font-light text-center">
              Reset Password
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
            <div className="text-center mt-8">
              <Button.Secondary
                type="submit"
                className="hover:bg-secondary-hover transition ease-in-out duration-300"
              >
                Send reset link
              </Button.Secondary>
            </div>
          </form>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

export default ResetPassword;
