import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase-config";
import { getFirebaseErrorMessage } from "../helpers";
import { useHotToast } from "../../../hooks/useHotToast";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useCreateNewUser } from "../hooks/setters/useCreateNewUser";
import Button from "../../../components/Button";

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

  return (
    <Button.Primary
      className="border border-secondary"
      type="button"
      onClick={handleGoogleSignup}
    >
      Continue with Google
    </Button.Primary>
  );
};
