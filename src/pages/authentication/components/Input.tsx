import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface InputProps {
  label: string;
  inputId: string;
  register: UseFormRegisterReturn;
  isPassword?: boolean;
  inputWidth?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  inputId,
  register,
  isPassword,
  inputWidth,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div
      className={twMerge(
        "text-secondary text-xl tracking-wide font-brand italic lowercase relative",
        inputWidth
      )}
    >
      <label htmlFor={inputId}>{label}</label>
      <input
        type={isPasswordVisible || !isPassword ? "text" : "password"}
        id={inputId}
        {...register}
        className="w-full h-11 rounded-md border border-secondary pl-2 mt-2 focus:outline-blue-munsell"
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
