import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import Header from "./components/Header";
import TripHeader from "./components/TripHeader";
import useGetTrip from "./hooks/getters/useGetTrip";

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
  const { error, loading, trip } = useGetTrip(tripId);
  const { settings } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }
  console.log(trip);

  return (
    <div className={settings?.font}>
      <Header />
      <div className="px-10">
        <TripHeader trip={trip} />
      </div>
    </div>
  );
};

export default TripPage;
