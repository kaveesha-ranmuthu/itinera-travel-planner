import React, { useState } from "react";
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
  const { settings } = useAuth();
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }

  return (
    <div className={settings?.font}>
      <Header />
      <div className="px-10">
        <TripHeader trip={trip} />
      </div>
      <div className="px-16">
        <HeaderIcons
          trip={trip}
          onEditButtonClick={() => setIsEditTripModalOpen(true)}
        />
        <Transport
          userCurrency={trip.currency?.otherInfo?.symbol}
          startDate={trip.startDate}
          endDate={trip.endDate}
          tripId={trip.id}
        />
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
