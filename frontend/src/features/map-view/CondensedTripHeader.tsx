import React from "react";
import { TripHeaderProps } from "../trip/TripHeader";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CondensedTripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  const { tripName, imageData, id } = trip;

  return (
    <div className="bg-black rounded-3xl relative drop-shadow-(--drop-shadow-default)">
      <img
        src={imageData}
        alt={tripName}
        className="object-cover w-full h-[100px] rounded-3xl opacity-40"
      />
      <Link
        to={`/trip/${id}`}
        className="absolute top-3 left-3 cursor-pointer z-40 hover:scale-105 transition ease-in-out duration-300"
      >
        <FaArrowLeft className="text-primary" size={20} />
      </Link>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className="text-primary text-2xl w-[60%] text-center truncate py-5">
          {tripName}
        </span>
      </div>
    </div>
  );
};

export default CondensedTripHeader;
