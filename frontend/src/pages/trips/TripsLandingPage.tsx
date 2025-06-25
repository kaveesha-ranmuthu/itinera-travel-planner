import Grid from "@mui/material/Grid";
import { httpsCallable } from "firebase/functions";
import { sortBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { PiTrashSimple } from "react-icons/pi";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Button from "../../shared/components/ui/Button";
import { functions } from "../../firebase-config";
import { useAuth } from "../../shared/hooks/useAuth";
import { useHotToast } from "../../shared/hooks/useHotToast";
import { FontFamily } from "../../types";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import CreateTripPopup from "./components/CreateTripPopup";
import Header from "./components/sections/Header";
import { deleteTripFromLocalStorage } from "./components/sections/helpers";
import { SelectOption } from "./components/Select";
import WarningConfirmationModal from "./components/WarningConfirmationModal";
import { TripData, useGetTrips } from "./hooks/getters/useGetTrips";
import { useCreateNewTrip } from "./hooks/setters/useCreateNewTrip";
import useDuplicateTrip from "./hooks/setters/useDuplicateTrip";
export interface Trip {
  tripName: string;
  startDate: string;
  endDate: string;
  countries: SelectOption[];
  numberOfPeople: number;
  currency: SelectOption | null;
  budget: number;
  imageData: string;
}

const TripsLandingPage = () => {
  const { settings } = useAuth();
  const { trips, error: tripsFetchError, loading } = useGetTrips();
  const { createNewTrip } = useCreateNewTrip();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setShowLoading(true); // Ensure loading state stays while data is loading
    } else {
      const timeout = setTimeout(() => {
        setShowLoading(false); // Only hide loading after delay
      }, 1500);

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [loading]);

  if (showLoading) {
    return <LoadingState />;
  }

  if (tripsFetchError) {
    return <ErrorPage />;
  }

  const sortedTrips = sortBy(trips, "createdAt");

  const handleCreateNewTrip = async (trip: Trip) => {
    const error = await createNewTrip(trip);
    return error;
  };

  return (
    <div className={settings?.font ?? FontFamily.HANDWRITTEN}>
      <Header />
      <div className="px-20 animate-fade">
        <div className="flex justify-center flex-col items-center space-y-8">
          <h1 className="text-5xl tracking-widest">my trips</h1>
          <Button.Primary
            className={twMerge(
              "border border-secondary normal-case text-lg hover:bg-secondary hover:text-primary hover:opacity-100 transition ease-in-out duration-500",
              settings?.font
            )}
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            Create new trip
          </Button.Primary>
        </div>
        <div className="py-14">
          <Grid
            container
            spacing={5}
            display={"flex"}
            justifyContent={"center"}
          >
            {sortedTrips.map((trip) => {
              return (
                <Grid key={trip.id}>
                  <TripCard trip={trip} />
                </Grid>
              );
            })}
          </Grid>
          <CreateTripPopup
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateNewTrip}
          />
        </div>
      </div>
    </div>
  );
};

interface TripCardProps {
  trip: TripData;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
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

export default TripsLandingPage;
