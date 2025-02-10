import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UserSettings } from "../../types";
import { db } from "../../firebase-config";

export const getFirebaseErrorMessage = (error: FirebaseError) => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use":
      "This email is already in use. Try logging in or reset your password if needed.",
    "auth/invalid-email":
      "Please enter a valid email address (e.g., name@example.com).",
    "auth/weak-password":
      "Your password is too weak. Use at least 6 characters for better security.",
    "auth/wrong-password": "Incorrect password. Double-check it and try again.",
    "auth/network-request-failed":
      "Network issue detected. Check your connection and try again.",
    "auth/invalid-credential":
      "Incorrect email or password. Try again or reset your password.",
    "auth/popup-closed-by-user":
      "Sign-in process was interrupted. Please try again.",
  };

  return errorMessages[error.code] || "Something went wrong. Please try again.";
};

export const setUserSettings = async (user: User, settings: UserSettings) => {
  const userSettingsRef = doc(db, "user-settings", user.uid);
  await setDoc(userSettingsRef, settings);
};
