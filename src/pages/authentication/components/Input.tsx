import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { RiErrorWarningLine } from "react-icons/ri";
import StyledTooltip from "../../../components/StyledTooltip";

interface InputProps {
  label: string;
  inputId: string;
  isPassword?: boolean;
  inputWidth?: string;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputType: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  inputId,
  isPassword,
  errorMessage,
  inputWidth,
  onChange,
  onBlur,
  inputType,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div
      className={twMerge(
        "text-secondary text-xl tracking-wide font-brand italic relative",
        inputWidth
      )}
    >
      <label htmlFor={inputId} className="lowercase flex items-center">
        <span>{label}</span>
        {errorMessage && (
          <StyledTooltip
            iconStyles="text-red-sienna ml-2"
            content={errorMessage}
          >
            <RiErrorWarningLine />
          </StyledTooltip>
        )}
      </label>
      <input
        type={isPasswordVisible || !isPassword ? "text" : "password"}
        id={inputId}
        onChange={onChange}
        onBlur={onBlur}
        className={twMerge(
          "w-full h-11 rounded-md border pl-2 mt-2",
          errorMessage
            ? "border-red-sienna focus:outline-red-sienna"
            : "border-secondary focus:outline-blue-munsell"
        )}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute top-12 right-3 cursor-pointer "
        >
          {isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      )}
    </div>
  );
};
