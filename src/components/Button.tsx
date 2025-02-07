import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick: () => void;
  className?: string;
}

const DefaultButton: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "font-brand cursor-pointer italic uppercase px-7 py-1.5 rounded-lg",
        className
      )}
    >
      {children}
    </button>
  );
};

const Primary: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "font-brand cursor-pointer italic uppercase px-7 py-1.5 rounded-lg bg-primary text-secondary    ",
        className
      )}
    >
      {children}
    </button>
  );
};

interface ButtonComponent extends React.FC<PropsWithChildren<ButtonProps>> {
  Primary: React.FC<PropsWithChildren<ButtonProps>>;
  Secondary: React.FC<PropsWithChildren<ButtonProps>>;
}

const Button = DefaultButton as ButtonComponent;
Button.Primary = Primary;

export default Button;
