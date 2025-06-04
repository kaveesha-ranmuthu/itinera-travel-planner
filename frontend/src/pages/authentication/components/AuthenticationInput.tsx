import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { RiErrorWarningLine } from "react-icons/ri";
import StyledTooltip from "../../../components/StyledTooltip";
import { Field, Input, Label } from "@headlessui/react";

interface InputProps {
  label: string;
  inputId: string;
  isPassword?: boolean;
  inputWidth?: string;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const AuthenticationInput: React.FC<InputProps> = ({
  label,
  inputId,
  isPassword,
  errorMessage,
  inputWidth,
  onChange,
  onBlur,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Field
      className={twMerge(
        "text-secondary text-lg tracking-wide font-brand tracking-wide italic relative",
        inputWidth
      )}
    >
      <Label className="lowercase flex items-center">
        {label}
        {errorMessage && (
          <StyledTooltip
            iconStyles="text-red-sienna ml-2"
            content={errorMessage}
          >
            <RiErrorWarningLine />
          </StyledTooltip>
        )}
      </Label>
      <Input
        className={twMerge(
          "text-base w-full h-11 rounded-md border pl-2",
          errorMessage
            ? "border-red-sienna focus:outline-red-sienna"
            : "border-secondary focus:outline-blue-munsell"
        )}
        name={inputId}
        onChange={onChange}
        onBlur={onBlur}
        type={isPasswordVisible || !isPassword ? "text" : "password"}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute top-10 right-3 cursor-pointer "
        >
          {isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      )}
    </Field>
  );
};
