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

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentView] = useState<ViewDisplayOptions>("gallery");
  const [isPackingListEditorOpen, setIsPackingListEditorOpen] = useState(false);

  return (
    <BackgroundWrapper>
      <BackArrow />
      <div className="font-brand tracking-wide italic absolute left-0 top-0 flex flex-col items-center justify-center w-full animate-fade-in-top">
        <Logo scale="scale-70" />
        <DefaultPackingListEditor
          open={isPackingListEditorOpen}
          onClose={() => setIsPackingListEditorOpen(false)}
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
                    Create default packing list
                  </Button.Primary>
                </div>
                <div>
                  <p className="text-lg">default food & activity view</p>
                  <div className="space-x-2">
                    <Button.Primary
                      onClick={() => navigate("/reset-password")}
                      type="submit"
                      className={twMerge(
                        "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
                        currentView === "gallery"
                          ? "opacity-100"
                          : "opacity-60 "
                      )}
                    >
                      Gallery
                    </Button.Primary>
                    <Button.Primary
                      onClick={() => navigate("/reset-password")}
                      type="submit"
                      className={twMerge(
                        "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
                        currentView === "list" ? "opacity-100" : "opacity-60"
                      )}
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
                  type="submit"
                  className="mt-4 border border-secondary px-4 py-1 text-base transition ease-in-out duration-300"
                >
                  Reset password
                </Button.Primary>
                <Button.Danger
                  type="submit"
                  className="mt-4 px-4 py-1 text-base transition ease-in-out duration-300"
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
