import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import Button from "../../components/Button";
import FormWrapper from "../../components/FormWrapper";
import Logo from "../../components/Logo";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import { auth, functions } from "../../config/firebase-config";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import SimpleTooltip from "../../components/SimpleTooltip";
import { getFirebaseErrorMessage } from "../../utils/helpers";
import { Heading } from "./Heading";
import { Preferences } from "./Preferences";

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useHotToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!user) navigate("/");

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
    <BackgroundWrapper>
      <BackArrow />
      <div className="font-brand tracking-wide italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <WarningConfirmationModal
          font="font-brand italic tracking-wide"
          hideIcon={true}
          isOpen={isDeleteModalOpen}
          onConfirm={deleteUser}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Are you sure you want to delete your account?"
          description="This action is permanent and cannot be undone. All of your saved trips and data will be permanently deleted."
        />
        <FormWrapper className="py-9">
          <h1 className="text-2xl mb-3 text-center">Settings</h1>
          <div className="space-y-6">
            <Preferences />
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
                {!isPasswordResetAllowed ? (
                  <SimpleTooltip
                    content="Password reset is not available for Google sign-in. Please manage your password through your Google account settings."
                    side="top"
                    theme="dark"
                    margin="mb-3 font-brand italic tracking-wide text-sm"
                    width="w-60"
                  >
                    <Button.Primary
                      disabled={true}
                      type="button"
                      className="disabled:opacity-40 mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
                    >
                      Reset password
                    </Button.Primary>
                  </SimpleTooltip>
                ) : (
                  <Button.Primary
                    onClick={sendResetLink}
                    type="button"
                    className="mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
                  >
                    Reset password
                  </Button.Primary>
                )}
                <Button.Danger
                  type="button"
                  className="mt-4 px-4 py-1 text-base transition ease-in-out duration-300"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete account
                </Button.Danger>
              </div>
            </div>
          </div>
        </FormWrapper>
      </div>
    </BackgroundWrapper>
  );
};

export default AdvancedSettings;
