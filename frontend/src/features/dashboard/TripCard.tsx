import { httpsCallable } from "firebase/functions";
import moment from "moment";
import { useState } from "react";
import { GoCopy } from "react-icons/go";
import { PiTrashSimple } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useHotToast } from "../../hooks/useHotToast";
import { deleteTripFromLocalStorage } from "../trip/utils/helpers";
import WarningConfirmationModal from "../../components/WarningConfirmationModal";
import useDuplicateTrip from "./hooks/useDuplicateTrip";
import { functions } from "../../config/firebase-config";
import { TripData } from "../../types/types";

interface TripCardProps {
  trip: TripData;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const {
    tripName,
    startDate,
    endDate,
    imageData: backgroundImage,
    id: tripId,
  } = trip;
  const startDateFormat = moment(startDate).format("MMM Do YYYY");
  const endDateFormat = moment(endDate).format("MMM Do YYYY");
  const dateFormatted =
    startDate === endDate
      ? startDateFormat
      : `${startDateFormat} - ${endDateFormat}`;

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const { notify } = useHotToast();
  const { duplicateTrip } = useDuplicateTrip();

  const deleteTrip = async (tripId: string) => {
    const deleteTripFn = httpsCallable(functions, "deleteTrip");
    try {
      await deleteTripFn({ tripId });
      deleteTripFromLocalStorage(tripId);
      notify(`Trip deleted successfully!`, "success");
    } catch (error) {
      console.error("Failed to delete trip:", error);
      notify("Something went wrong. Please try again.", "error");
    }
  };

  const duplicate = async () => {
    const error = await duplicateTrip(tripId);
    if (error) {
      notify("Something went wrong. Please try again.", "error");
    } else {
      notify("Trip duplicated successfully!", "success");
    }
  };

  return (
    <>
      <div className="bg-black rounded-2xl w-72 relative group cursor-pointer hover:scale-98 transition ease-in-out duration-400">
        <Link to={`/trip/${tripId}`}>
          <img
            src={backgroundImage}
            className="object-cover group-hover:opacity-60 transition ease-in-out duration-400 cursor-pointer w-full rounded-2xl h-48  flex items-center justify-center drop-shadow-(--drop-shadow-default)"
          />
          <div className="absolute space-y-1 opacity-0 flex flex-col group-hover:opacity-100 top-0 transition ease-in-out duration-400 text-primary text-2xl items-center w-full justify-center h-full">
            <span className="w-[70%] text-center truncate">{tripName}</span>
            <span className="text-center text-sm">{dateFormatted}</span>
          </div>
        </Link>
        <div className="space-x-2 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition ease-in-out duration-400">
          <button
            onClick={duplicate}
            className="cursor-pointer bg-primary rounded-full p-1.5 hover:opacity-85 transition ease-in-out duration-400"
          >
            <GoCopy stroke="var(--color-secondary)" size={17} />
          </button>
          <button
            onClick={() => setShowDeleteWarning(true)}
            className="cursor-pointer bg-primary rounded-full p-1.5 hover:opacity-85 transition ease-in-out duration-400"
          >
            <PiTrashSimple stroke="var(--color-secondary)" size={17} />
          </button>
        </div>
      </div>
      <WarningConfirmationModal
        isOpen={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        title={`Are you sure you want to delete "${tripName}"?`}
        description="Once deleted, this trip is gone forever. Are you sure you want to continue?"
        onConfirm={() => deleteTrip(tripId)}
      />
    </>
  );
};
