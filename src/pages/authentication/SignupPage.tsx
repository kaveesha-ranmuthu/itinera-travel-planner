import BackgroundWrapper from "../../components/BackgroundWrapper";
import Logo from "../../components/Logo";
import FormWrapper from "./components/FormWrapper";
import { Input } from "./components/Input";
import Button from "../../components/Button";
import { useFormik } from "formik";
import { SignUpWithGoogle } from "./components/GoogleSignIn";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { FirebaseError } from "firebase/app";
import { useHotToast } from "../../hooks/useHotToast";
import { getFirebaseErrorMessage } from "./helpers";

type FormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { notify } = useHotToast();

  const formik = useFormik<FormInput>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {} as FormInput;

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
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        navigate("/");
      } catch (e) {
        const error = e as FirebaseError;
        const errorMessage = getFirebaseErrorMessage(error);
        notify(errorMessage, "error");
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
              <Button.Secondary
                type="submit"
                disabled={!formik.isValid}
                className="hover:bg-secondary-hover transition ease-in-out duration-300"
              >
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
            <SignUpWithGoogle />
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
