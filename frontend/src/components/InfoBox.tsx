import React, { PropsWithChildren } from "react";
import { ClipLoader } from "react-spinners";

const Box: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border border-secondary h-60 rounded-2xl mt-4 flex items-center justify-center">
      {children}
    </div>
  );
};

export const ErrorBox = () => {
  return (
    <Box>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl mb-1">Oops! Something went wrong.</h1>
        <p className="text-base text-balance">
          We're having trouble right now. Please try again in a moment.
        </p>
      </div>
    </Box>
  );
};

export const LoadingBox = () => {
  return (
    <Box>
      <div className="flex flex-col items-center justify-center text-center">
        <ClipLoader
          color="#3b404384"
          loading={true}
          size={20}
          speedMultiplier={0.5}
        />
      </div>
    </Box>
  );
};

interface NoDataBoxProps {
  subtitle?: string;
}

export const NoDataBox: React.FC<NoDataBoxProps> = ({ subtitle }) => {
  return (
    <Box>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl mb-1">Your journey hasn’t started yet!</h1>
        <p className="text-base">
          {subtitle ?? "Start by searching for a location."}
        </p>
      </div>
    </Box>
  );
};
