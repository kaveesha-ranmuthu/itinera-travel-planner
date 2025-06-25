import React, { PropsWithChildren } from "react";

export const AdvancedSettingsHeading: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <h1 className="text-xl">{children}</h1>
      <hr className="opacity-20 mb-2 mt-1" />
    </>
  );
};
