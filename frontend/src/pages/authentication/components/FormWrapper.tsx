import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface FormWrapperProps {
  className?: string;
}

const FormWrapper: React.FC<PropsWithChildren<FormWrapperProps>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge("bg-primary w-md rounded-xl py-12 px-10", className)}
    >
      {children}
    </div>
  );
};

export default FormWrapper;
