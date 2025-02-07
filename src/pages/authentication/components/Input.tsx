import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { RiErrorWarningLine } from "react-icons/ri";

interface InputProps {
  label: string;
  inputId: string;
  register: UseFormRegisterReturn;
  isPassword?: boolean;
  inputWidth?: string;
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  inputId,
  register,
  isPassword,
  errorMessage,
  inputWidth,
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
          <span className="text-orange-fulvous ml-2">
            <RiErrorWarningLine />
          </span>
        )}
      </label>
      <input
        type={isPasswordVisible || !isPassword ? "text" : "password"}
        id={inputId}
        {...register}
        className="w-full h-11 rounded-md border border-secondary pl-2 mt-2"
      />
      {isPassword && (
        <button
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute top-12 right-3 cursor-pointer "
        >
          {isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      )}
    </div>
  );
};
