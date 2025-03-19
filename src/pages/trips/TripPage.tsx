import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import CreateTripPopup from "./components/CreateTripPopup";
import useGetTrip from "./hooks/getters/useGetTrip";
import Header from "./components/sections/Header";
import TripHeader from "./components/sections/TripHeader";
import HeaderIcons from "./components/sections/HeaderIcons";
import Transport from "./components/sections/Transport";
import { twMerge } from "tailwind-merge";
import Accommodation from "./components/sections/Accommodation";
import Food from "./components/sections/Food";
import Activities from "./components/sections/Activities";
import Itinerary from "./components/sections/Itinerary";
import { Element } from "react-scroll";
import { useGetAccommodation } from "./hooks/getters/useGetAccommodation";
import { useGetFood } from "./hooks/getters/useGetFood";
import { useGetActivities } from "./hooks/getters/useGetActivities";
import { useGetTransport } from "./hooks/getters/useGetTransport";
import { useGetItinerary } from "./hooks/getters/useGetItinerary";

const TripPage = () => {
  const { tripId } = useParams();

  if (!tripId) {
    return <ErrorPage />;
  }

  return <TripInfo tripId={tripId} />;
};

interface TripInfoProps {
  tripId: string;
}

const TripInfo: React.FC<TripInfoProps> = ({ tripId }) => {
  const { error, loading, trip, updateTripDetails } = useGetTrip(tripId);
  const {
    error: accommodationError,
    loading: accommodationLoading,
    accommodationRows,
  } = useGetAccommodation(tripId);
  const {
    error: foodError,
    loading: foodLoading,
    foodItems,
  } = useGetFood(tripId);
  const {
    error: activitiesError,
    loading: activitiesLoading,
    activities,
  } = useGetActivities(tripId);
  const {
    error: transportError,
    loading: transportLoading,
    transportRows,
  } = useGetTransport(tripId);
  const {
    error: itineraryError,
    itinerary,
    loading: itineraryLoading,
  } = useGetItinerary(tripId);

  const { settings } = useAuth();
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const isLoading =
      loading ||
      accommodationLoading ||
      foodLoading ||
      activitiesLoading ||
      transportLoading ||
      itineraryLoading;

    if (isLoading) {
      setShowLoading(true);
    } else {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 1500);

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [
    loading,
    accommodationLoading,
    foodLoading,
    activitiesLoading,
    transportLoading,
    itineraryLoading,
  ]);

  if (showLoading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }

  return (
    <div className={twMerge(settings?.font, "pb-16")}>
      <Header />
      <div className="px-10">
        <TripHeader trip={trip} />
      </div>
      <div className="px-16">
        <HeaderIcons
          trip={trip}
          onEditButtonClick={() => setIsEditTripModalOpen(true)}
        />
        <div className="space-y-10">
          <Element name="transport">
            <Transport
              userCurrency={trip.currency?.otherInfo?.symbol}
              startDate={trip.startDate}
              endDate={trip.endDate}
              tripId={trip.id}
              transportRows={transportRows}
              error={transportError}
            />
          </Element>
          <Element name="accommodation">
            <Accommodation
              userCurrencySymbol={trip.currency?.otherInfo?.symbol}
              userCurrencyCode={trip.currency?.name}
              numberOfPeople={trip.numberOfPeople}
              startDate={trip.startDate}
              endDate={trip.endDate}
              tripId={trip.id}
              accommodationRows={accommodationRows}
              error={accommodationError}
            />
          </Element>
          <Element name="food">
            <Food
              userCurrencySymbol={trip.currency?.otherInfo?.symbol}
              userCurrencyCode={trip.currency?.name}
              tripId={trip.id}
              error={foodError}
              foodItems={foodItems}
            />
          </Element>
          <Element name="activities">
            <Activities
              userCurrencySymbol={trip.currency?.otherInfo?.symbol}
              userCurrencyCode={trip.currency?.name}
              tripId={trip.id}
              error={activitiesError}
              activities={activities}
            />
          </Element>
          <Element name="itinerary">
            <Itinerary
              startDate={trip.startDate}
              endDate={trip.endDate}
              tripId={trip.id}
              error={itineraryError}
              itinerary={itinerary}
            />
          </Element>
        </div>
      </div>
      <CreateTripPopup
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        initialValues={trip}
        onSubmit={updateTripDetails}
      />
    </div>
  );
};

export default TripPage;
