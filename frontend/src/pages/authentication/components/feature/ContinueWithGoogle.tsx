import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../../../firebase-config";
import { useHotToast } from "../../../../shared/hooks/useHotToast";
import { getFirebaseErrorMessage } from "../../utility/helpers";
import { useCreateNewUser } from "../../hooks/setters/useCreateNewUser";
import { GoogleSignInButton } from "../ui/GoogleSignInButton";

export const ContinueWithGoogle = () => {
  const { notify } = useHotToast();
  const navigate = useNavigate();
  const { createUser } = useCreateNewUser();

  const handleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      if (!user) throw new Error("No user found after Google Sign-In");

      await createUser(userCredential.user);

      return null;
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      return error;
    }
  };

  const handleGoogleSignup = async () => {
    const error = await handleSignup();
    if (!error) {
      navigate("/");
    } else {
      if (error instanceof FirebaseError) {
        const errorMessage = getFirebaseErrorMessage(error);
        notify(errorMessage, "error");
      } else {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return <GoogleSignInButton onClick={handleGoogleSignup} />;
};
