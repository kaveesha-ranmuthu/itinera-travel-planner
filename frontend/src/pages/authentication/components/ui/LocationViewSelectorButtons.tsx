import React from "react";
import Button from "../../../../shared/components/ui/Button";
import { twMerge } from "tailwind-merge";

interface LocationViewSelectorButtonsProps {
  currentView: "gallery" | "list";
  onUpdateView: (view: "gallery" | "list") => void;
}

export const LocationViewSelectorButtons: React.FC<
  LocationViewSelectorButtonsProps
> = ({ currentView, onUpdateView }) => {
  return (
    <div className="space-x-2">
      <Button.Primary
        onClick={() => onUpdateView("gallery")}
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
        onClick={() => onUpdateView("list")}
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
