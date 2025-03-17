import React from "react";
import { TripHeaderProps } from "./TripHeader";

const CondensedTripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  const { tripName, imageData } = trip;

  return (
    <div className="bg-black rounded-3xl relative drop-shadow-(--drop-shadow-default)">
      <img
        src={imageData}
        alt={tripName}
        className="object-cover w-full h-[100px] rounded-3xl opacity-40"
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-primary text-2xl w-[60%] text-center truncate py-5">
          {tripName}
        </span>
      </div>
    </div>
  );
};

export default CondensedTripHeader;
