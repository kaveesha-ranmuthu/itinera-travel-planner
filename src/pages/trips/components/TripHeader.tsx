import React from "react";
import { IoCalendarClearOutline } from "react-icons/io5";
import { TripData } from "../hooks/getters/useGetTrips";
import moment from "moment";
import { FiDollarSign } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { HiArrowLongRight } from "react-icons/hi2";
import { FontFamily } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import SimpleTooltip from "./SimpleTooltip";

interface TripHeaderProps {
  trip: TripData;
}

const TripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  const { settings } = useAuth();
  const {
    tripName,
    imageData,
    budget,
    currency,
    numberOfPeople,
    startDate,
    endDate,
  } = trip;

  const startDateFormat = moment(startDate).format("MMM Do YYYY");
  const endDateFormat = moment(endDate).format("MMM Do YYYY");

  return (
    <div className="bg-black rounded-3xl relative drop-shadow-(--drop-shadow-default)">
      <img
        src={imageData}
        alt={tripName}
        className="object-cover w-full h-[311px] rounded-3xl opacity-40"
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <p className="text-primary text-5xl">{tripName}</p>
      </div>
      <div className="absolute bottom-3 left-5 text-primary space-y-1.5">
        <span className="flex space-x-3 items-center">
          <FiDollarSign size={20} strokeWidth={1.5} />
          <p>
            {currency?.otherInfo?.symbol}
            {budget}
          </p>
        </span>
        <span className="flex space-x-3 items-center">
          <GoPerson size={20} />
          <p>{numberOfPeople}</p>
        </span>
        <span className="flex space-x-3 items-center">
          <IoCalendarClearOutline size={20} />
          <span className="flex items-center space-x-1">
            <p>{startDateFormat}</p>
            <span
              className={
                settings?.font === FontFamily.HANDWRITTEN ? "pt-0.5" : ""
              }
            >
              <HiArrowLongRight size={20} />
            </span>
            <p>{endDateFormat}</p>
          </span>
        </span>
        <SimpleTooltip content="Update your savings progress">
          <button
            type="button"
            className="flex items-center space-x-3 mt-3 cursor-pointer"
          >
            <div className="w-60 bg-primary h-1.5 rounded-full">
              <div className="w-20 bg-green h-1.5 rounded-full" />
            </div>
            <p
              className={twMerge(
                "text-xs",
                settings?.font === FontFamily.HANDWRITTEN && "mb-1"
              )}
            >
              0%
            </p>
          </button>
        </SimpleTooltip>
      </div>
    </div>
  );
};

export default TripHeader;
