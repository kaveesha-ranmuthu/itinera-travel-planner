import React from "react";

interface EmailAndPasswordDisplayProps {
  userEmail: string;
}

export const EmailAndPasswordDisplay: React.FC<
  EmailAndPasswordDisplayProps
> = ({ userEmail }) => {
  return (
    <>
      <div>
        <p className="text-lg">email</p>
        <p className="opacity-50">{userEmail}</p>
      </div>
      <div>
        <p className="text-lg">password</p>
        <p className="opacity-50 text-xs">●●●●●●●●●●●●</p>
      </div>
    </>
  );
};
