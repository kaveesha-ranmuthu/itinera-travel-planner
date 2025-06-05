import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";
import { ViewDisplayOptions } from "../trips/components/ViewSelector";
import BackArrow from "./components/BackArrow";
import FormWrapper from "./components/FormWrapper";
import { twMerge } from "tailwind-merge";
import DefaultPackingListEditor from "./components/DefaultPackingListEditor";
import { useUpdateUserSettings } from "../trips/hooks/setters/useUpdateUserSettings";
import { useHotToast } from "../../hooks/useHotToast";
import { auth, functions } from "../../firebase-config";
import WarningConfirmationModal from "../trips/components/WarningConfirmationModal";
import { httpsCallable } from "firebase/functions";
import { signOut } from "firebase/auth";

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const { user, settings, setSettings } = useAuth();
  const { updateSettings } = useUpdateUserSettings();
  const { notify } = useHotToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentView = settings?.preferredDisplay || "gallery";

  const [isPackingListEditorOpen, setIsPackingListEditorOpen] = useState(false);
  const currentPackingList = settings?.packingList;

  const updateDefaultView = async (view: ViewDisplayOptions) => {
    if (auth.currentUser) {
      try {
        await updateSettings({
          ...settings!,
          preferredDisplay: view,
        });
        setSettings({ ...settings!, preferredDisplay: view });
      } catch {
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
    <BackgroundWrapper>
      <BackArrow />
      <div className="font-brand tracking-wide italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <DefaultPackingListEditor
          open={isPackingListEditorOpen}
          onClose={() => setIsPackingListEditorOpen(false)}
        />
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
            <div className="space-y-2">
              <Heading title="Preferences" />
              <div className="space-y-3 ">
                <div>
                  <p className="text-lg">default packing list</p>
                  <Button.Primary
                    onClick={() => setIsPackingListEditorOpen(true)}
                    type="submit"
                    className="mt-1 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
                  >
                    {currentPackingList
                      ? "Edit default packing list"
                      : "Create default packing list"}
                  </Button.Primary>
                </div>
                <div>
                  <p className="text-lg">default food & activity view</p>
                  <div className="space-x-2">
                    <Button.Primary
                      onClick={() => updateDefaultView("gallery")}
                      type="submit"
                      className={twMerge(
                        "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
                        currentView === "gallery"
                          ? "opacity-100"
                          : "opacity-60 "
                      )}
                      disabled={currentView === "gallery"}
                    >
                      Gallery
                    </Button.Primary>
                    <Button.Primary
                      onClick={() => updateDefaultView("list")}
                      type="submit"
                      className={twMerge(
                        "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
                        currentView === "list" ? "opacity-100" : "opacity-60"
                      )}
                      disabled={currentView === "list"}
                    >
                      List
                    </Button.Primary>
                  </div>
                </div>
              </div>
            </div>
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
                <Button.Primary
                  onClick={() => navigate("/reset-password")}
                  type="button"
                  className="mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
                >
                  Reset password
                </Button.Primary>
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

interface HeadingProps {
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ title }) => {
  return (
    <>
      <h1 className="text-xl">{title}</h1>
      <hr className="opacity-20 mb-2 mt-1" />
    </>
  );
};

export default AdvancedSettings;
