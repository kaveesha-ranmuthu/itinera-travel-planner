import React from "react";
import { twMerge } from "tailwind-merge";

interface ViewSelectorProps {
  selectedView: "gallery" | "list";
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  selectedView = "gallery",
}) => {
  return (
    <div className="cursor-pointer border border-secondary w-fit rounded-lg divide-x divide-secondary py-1 text-sm text-secondary">
      <span
        className={twMerge(
          "px-2",
          selectedView === "gallery" ? "opacity-100" : "opacity-60"
        )}
      >
        Gallery
      </span>
      <span
        className={twMerge(
          "px-2",
          selectedView === "list" ? "opacity-100" : "opacity-60"
        )}
      >
        List
      </span>
    </div>
  );
};

export default ViewSelector;
