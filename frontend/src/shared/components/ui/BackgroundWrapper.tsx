import React, { PropsWithChildren } from "react";
import backgroundArt from "../../assets/background-art.jpg";

const BackgroundWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className=" w-dvw h-dvh bg-cover bg-black">
      <img src={backgroundArt} className="w-full h-full opacity-50" />
      {children}
    </div>
  );
};

export default BackgroundWrapper;
