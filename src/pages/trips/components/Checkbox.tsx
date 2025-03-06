import React from "react";
import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "w-5 h-5 rounded-md border border-secondary cursor-pointer",
        checked
          ? "bg-secondary transition ease-in-out duration-200"
          : "bg-transparent transition ease-in-out duration-200"
      )}
    />
  );
};

export default Checkbox;
