import React from "react";
import Button from "../../components/Button";
import { twMerge } from "tailwind-merge";

interface LocationViewSelectorProps {
  onChange: (view: "gallery" | "list") => void;
  currentView: "gallery" | "list";
}

export const LocationViewSelector: React.FC<LocationViewSelectorProps> = ({
  currentView,
  onChange,
}) => {
  return (
    <div className="space-x-2">
      <Button.Primary
        onClick={() => onChange("gallery")}
        type="submit"
        className={twMerge(
          "mt-1 border border-secondary hover:opacity-100 px-4 py-1 w-20 text-base transition ease-in-out duration-300",
          currentView === "gallery" ? "opacity-100" : "opacity-60 "
        )}
        disabled={currentView === "gallery"}
      >
        Gallery
      </Button.Primary>
      <Button.Primary
        onClick={() => onChange("list")}
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
  );
};
