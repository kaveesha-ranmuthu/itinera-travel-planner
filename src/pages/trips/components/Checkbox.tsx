import React from "react";
import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  checked: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked }) => {
  return (
    <div
      className={twMerge(
        "w-5 h-5 rounded-md border border-secondary cursor-pointer",
        checked && "bg-secondary"
      )}
    />
  );
};

export default Checkbox;
