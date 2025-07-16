import React from "react";
import { twMerge } from "tailwind-merge";
import { ViewDisplayOptions } from "../../types/types";

interface ViewSelectorProps {
  selectedView: ViewDisplayOptions;
  onSelectView: (view: ViewDisplayOptions) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  selectedView = "gallery",
  onSelectView,
}) => {
  return (
    <div className="border border-secondary w-fit rounded-lg divide-x divide-secondary py-1 text-sm text-secondary">
      <span
        className={twMerge(
          "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
          selectedView === "gallery" ? "opacity-100" : "opacity-60"
        )}
        onClick={() => onSelectView("gallery")}
      >
        Gallery
      </span>
      <span
        className={twMerge(
          "px-2 cursor-pointer hover:opacity-100 transition ease-in-out duration-300",
          selectedView === "list" ? "opacity-100" : "opacity-60"
        )}
        onClick={() => onSelectView("list")}
      >
        List
      </span>
    </div>
  );
};

export default ViewSelector;
