import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import { auth, functions } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import { getFirebaseErrorMessage } from "../../utils/helpers";
import { Heading } from "./Heading";
import { DeletePasswordButton } from "./DeletePasswordButton";
import { ResetPasswordButton } from "./ResetPasswordButton";

export const AccountSettings = () => {
  const { user } = useAuth();
  const { notify } = useHotToast();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isPasswordResetAllowed = user?.providerData
    .map((provider) => provider.providerId)
    .includes("password");

  const deleteUser = async () => {
    const deleteUserFn = httpsCallable(functions, "deleteUser");
    try {
      await deleteUserFn();
      localStorage.clear();
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete user:", error);
      notify("Something went wrong. Please try again.", "error");
    }
  };

  const sendResetLink = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      notify("Reset link sent! Check your email.", "info");
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getFirebaseErrorMessage(error);
        notify(errorMessage, "error");
      } else {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <>
      <div>
        <Heading title="Account" />
        <div className="space-y-2">
          <div>
            <p className="text-lg">email</p>
            <p className="opacity-50">{user?.email}</p>
          </div>
          <div>
            <p className="text-lg">password</p>
            <p className="opacity-50 text-xs">●●●●●●●●●●●●</p>
          </div>
        </div>
        <div className="space-x-2">
          <ResetPasswordButton
            isPasswordResetAllowed={isPasswordResetAllowed}
            onClick={sendResetLink}
          />
          <DeletePasswordButton onClick={() => setIsDeleteModalOpen(true)} />
        </div>
      </div>
      <WarningConfirmationModal
        font="font-brand italic tracking-wide"
        hideIcon={true}
        isOpen={isDeleteModalOpen}
        onConfirm={deleteUser}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Are you sure you want to delete your account?"
        description="This action is permanent and cannot be undone. All of your saved trips and data will be permanently deleted."
      />
    </>
  );
};
