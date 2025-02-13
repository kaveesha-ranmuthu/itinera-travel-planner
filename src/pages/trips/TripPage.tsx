import React from "react";
import { useParams } from "react-router-dom";
import useGetTrip from "./hooks/getters/useGetTrip";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";

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

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorPage />;
  }

  console.log(trip);
};

export default TripPage;
