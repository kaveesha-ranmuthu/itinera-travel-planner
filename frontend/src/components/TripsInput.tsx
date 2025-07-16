import React from "react";
import { twMerge } from "tailwind-merge";

interface TripsInputProps {
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputWidth?: string;
  defaultValue?: string | number;
  className?: string;
  value?: string | number;
}

const TripsInput: React.FC<TripsInputProps> = ({
  id,
  onChange,
  type,
  placeholder,
  inputWidth,
  defaultValue,
  className,
  value,
}) => {
  return (
    <input
      type={type}
      id={id}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      className={twMerge(
        "border border-secondary rounded-xl px-2 py-1 w-20 focus:outline-secondary",
        inputWidth,
        className
      )}
    />
  );
};

export default TripsInput;
