import { signOut } from "firebase/auth";
import React from "react";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import { auth } from "../config/firebase-config";
import { useAuth } from "../hooks/useAuth";
import { useHotToast } from "../hooks/useHotToast";
import { useSaving } from "../hooks/useSaving";
import useSaveAllData from "../hooks/useSaveAllData";
import PopoverMenu from "./PopoverMenu";
import { CheckoutButton } from "./CheckoutButton";
import { saveTripData } from "../features/trip/utils/helpers";
import { FontFamily } from "../types/types";
import { useUpdateUserSettings } from "../hooks/useUpdateUserSettings";
import { isProductionEnvironment } from "../utils/flags";

const Header = () => {
  const { notify } = useHotToast();
  const navigate = useNavigate();
  const { settings, setSettings } = useAuth();
  const { updateSettings } = useUpdateUserSettings();
  const { saveAllData } = useSaveAllData();
  const [logoutLoading, setLogoutLoading] = React.useState(false);
  const { isSaving } = useSaving();

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await saveTripData(saveAllData);
      await signOut(auth);
      navigate("/login");
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
    setLogoutLoading(false);
  };

  const updateFont = async (newFont: FontFamily) => {
    if (auth.currentUser) {
      try {
        await updateSettings({
          ...settings!,
          font: newFont,
        });
        setSettings({ ...settings!, font: newFont });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <nav className="px-6 py-2 flex items-center justify-between sticky top-0 z-10 h-16 bg-primary animate-fade">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <h1 className="text-3xl font-brand uppercase text-secondary">
            Itinera
          </h1>
        </Link>
        {!isProductionEnvironment() && <CheckoutButton />}
      </div>
      {isSaving && <p>Saving...</p>}
      <PopoverMenu
        popoverWidth="w-62 h-fit pb-7"
        popoverTrigger={
          <div className="cursor-pointer hover:opacity-80 transition mt-1 ease-in-out">
            <HiOutlineCog6Tooth stroke="#3b4043" size={25} />
          </div>
        }
      >
        <p className={twMerge("lowercase text-xl pb-3", settings?.font)}>
          settings
        </p>
        <div>
          <p className={twMerge(settings?.font, "text-base")}>Change font</p>
          <div className="flex items-center space-x-3 mt-2">
            {Object.values(FontFamily).map((font) => {
              return (
                <FontDisplayBox
                  key={font}
                  fontFamily={font}
                  selected={font === settings?.font}
                  onClick={() => updateFont(font)}
                />
              );
            })}
          </div>
          <div className="flex items-center space-x-2 mt-9">
            <Button.Primary
              onClick={() => navigate("/advanced-settings")}
              className={twMerge(
                "normal-case border text-sm px-3 border-secondary",
                settings?.font
              )}
            >
              Advanced Settings
            </Button.Primary>
            <Button.Secondary
              onClick={handleLogout}
              className={twMerge("normal-case text-sm px-3", settings?.font)}
              loading={logoutLoading}
            >
              Log Out
            </Button.Secondary>
          </div>
        </div>
      </PopoverMenu>
    </nav>
  );
};

interface FontDisplayBoxProps {
  fontFamily: FontFamily;
  selected?: boolean;
  onClick: () => void;
}

const FontDisplayBox: React.FC<FontDisplayBoxProps> = ({
  fontFamily,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "w-10 h-10 border rounded-lg flex items-center justify-center cursor-pointer",
        fontFamily,
        selected
          ? "border-secondary opacity-100"
          : "opacity-20 hover:opacity-40 transition ease-in-out duration-500"
      )}
    >
      Aa
    </button>
  );
};

export default Header;
