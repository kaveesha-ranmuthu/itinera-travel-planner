import React from "react";
import { twMerge } from "tailwind-merge";

interface TripsInputProps {
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputWidth?: string;
}

const TripsInput: React.FC<TripsInputProps> = ({
  id,
  onChange,
  type,
  placeholder,
  inputWidth,
}) => {
  return (
    <input
      type={type}
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      className={twMerge(
        "border border-secondary rounded-xl px-2 py-1 w-20 focus:outline-secondary",
        inputWidth
      )}
    />
  );
};

export default TripsInput;
