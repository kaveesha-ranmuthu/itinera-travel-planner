import React, { PropsWithChildren } from "react";

export const Heading: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1 className="text-3xl font-brand italic tracking-wide">{children}</h1>
  );
};
