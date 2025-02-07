import React, { PropsWithChildren } from "react";

const FormWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-primary/80 w-md rounded-xl py-12 px-10">{children}</div>
  );
};

export default FormWrapper;
