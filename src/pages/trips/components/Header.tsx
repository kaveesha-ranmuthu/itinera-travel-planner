import React from "react";
import { FontFamily } from "../../../types";
import { PaperPlane } from "../assets/PaperPlane";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";
import Button from "../../../components/Button";
import { useHotToast } from "../../../hooks/useHotToast";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase-config";
import PopoverMenu from "./PopoverMenu";
import { updateUserSettings } from "../helpers";
import { useAuth } from "../../../hooks/useAuth";

const Header = () => {
  const { notify } = useHotToast();
  const navigate = useNavigate();
  const { settings, setSettings } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  const updateFont = async (newFont: FontFamily) => {
    if (auth.currentUser) {
      try {
        await updateUserSettings(auth.currentUser.uid, {
          font: newFont,
        });
        setSettings({ font: newFont });
      } catch {
        notify("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <nav className="px-6 py-2 flex items-center justify-between">
      <Link to="/">
        <PaperPlane fill="#3b4043" width={30} />
      </Link>
      <PopoverMenu
        popoverTrigger={
          <div className="cursor-pointer hover:opacity-80 transition ease-in-out">
            <HiOutlineCog6Tooth stroke="#3b4043" size={25} />
          </div>
        }
      >
        <p className={twMerge("lowercase text-3xl pb-3", settings?.font)}>
          settings
        </p>
        <div>
          <p className={settings?.font}>Change font</p>
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
            <Button.Secondary
              onClick={handleLogout}
              className={twMerge("normal-case", settings?.font)}
            >
              Log Out
            </Button.Secondary>
            <Button.Primary
              onClick={handleLogout}
              className={twMerge(
                "normal-case border border-secondary",
                settings?.font
              )}
            >
              Update Profile
            </Button.Primary>
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
        "w-12 h-12 border  rounded-lg flex items-center justify-center cursor-pointer",
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
