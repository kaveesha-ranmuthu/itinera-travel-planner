import React, { useState } from "react";
import { AdvancedSettingsHeading } from "../ui/AdvancedSettingsHeading";
import { EmailAndPasswordDisplay } from "../ui/EmailAndPasswordDisplay";
import { ResetPasswordButton } from "../ui/ResetPasswordButton";
import DeleteAccountButton from "../ui/DeleteAccountButton";
import { sendPasswordResetEmail, signOut, User } from "firebase/auth";
import { auth, functions } from "../../../../firebase-config";
import { useHotToast } from "../../../../shared/hooks/useHotToast";
import { FirebaseError } from "firebase/app";
import { getFirebaseErrorMessage } from "../../utility/helpers";
import WarningConfirmationModal from "../../../trips/components/WarningConfirmationModal";
import { httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

interface AccountSettingsProps {
  user: User;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const { notify } = useHotToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const isPasswordResetAllowed = user?.providerData
    .map((provider) => provider.providerId)
    .includes("password");

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

  return (
    <>
      <div>
        <AdvancedSettingsHeading>Account</AdvancedSettingsHeading>
        <div className="space-y-2">
          <EmailAndPasswordDisplay userEmail={user?.email ?? ""} />
        </div>
        <div className="space-x-2">
          <ResetPasswordButton
            isPasswordResetAllowed={!!isPasswordResetAllowed}
            onResetPasswordClick={sendResetLink}
          />
          <DeleteAccountButton onClick={() => setIsDeleteModalOpen(true)} />
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
