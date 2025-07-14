import { doc, updateDoc } from "firebase/firestore";
import { debounce, round } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoCalendarClearOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { db } from "../../../../config/firebase-config";
import { useAuth } from "../../../../hooks/useAuth";
import { useHotToast } from "../../../../hooks/useHotToast";
import { FontFamily } from "../../../../types";
import { TripData } from "../../hooks/getters/useGetTrips";
import SimpleTooltip from "../SimpleTooltip";
import TripsInput from "../TripsInput";

export interface TripHeaderProps {
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
    currentSavings,
    id,
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
        <span className="text-primary text-5xl w-[60%] text-center truncate py-5">
          {tripName}
        </span>
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
        <SavingsProgressBar
          currencySymbol={currency?.otherInfo?.symbol}
          currentSavings={currentSavings}
          tripId={id}
          budget={budget}
        />
      </div>
    </div>
  );
};

interface SavingsProgressBarProps {
  currentSavings: number;
  currencySymbol?: string;
  tripId: string;
  budget: number;
}

const SavingsProgressBar: React.FC<SavingsProgressBarProps> = ({
  currencySymbol,
  currentSavings,
  tripId,
  budget,
}) => {
  const { settings, user } = useAuth();
  const { notify } = useHotToast();
  const [savings, setSavings] = useState(currentSavings);

  const savingsProgress =
    (savings / budget) * 100 > 100 ? 100 : (savings / budget) * 100;

  if (!user) {
    notify("Something went wrong. Please try again.", "error");
    return;
  }

  const updateSavingsInFirestore = debounce(async (newSavings) => {
    try {
      const tripRef = doc(db, `users/${user.uid}/trips/${tripId}`);
      await updateDoc(tripRef, { currentSavings: newSavings });
    } catch {
      setSavings(currentSavings);
      notify("Something went wrong. Please try again.", "error");
    }
  }, 500);

  const handleSavingsChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newSavings = parseFloat(e.target.value);
    if (newSavings < 0 || isNaN(newSavings)) {
      newSavings = 0;
    }
    setSavings(newSavings);
    updateSavingsInFirestore(newSavings);
  };

  const content = (
    <div>
      <p className="mb-2">Update your savings progress</p>
      <TripsInput
        type="number"
        placeholder={currencySymbol + round(savings, 2).toString()}
        id="savings"
        inputWidth="w-20"
        onChange={handleSavingsChange}
      />
    </div>
  );
  return (
    <div>
      <SimpleTooltip content={content}>
        <button
          type="button"
          className="flex items-center space-x-3 mt-3 cursor-pointer"
        >
          <div className="w-60">
            <div className="w-full bg-primary h-1.5 rounded-full">
              <div
                className="bg-green h-1.5 rounded-full"
                style={{ width: `${savingsProgress}%` }}
              />
            </div>
          </div>
          <p
            className={twMerge(
              "text-xs",
              settings?.font === FontFamily.HANDWRITTEN && "mb-1"
            )}
          >
            {round(savingsProgress)}%
          </p>
        </button>
      </SimpleTooltip>
    </div>
  );
};

export default TripHeader;
