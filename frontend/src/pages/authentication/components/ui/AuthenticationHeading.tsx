import React, { PropsWithChildren } from "react";

export const AuthenticationHeading: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <h1 className="font-brand tracking-wide italic text-2xl font-light text-center">
      {children}
    </h1>
  );
};
