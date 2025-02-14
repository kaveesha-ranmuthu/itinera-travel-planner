import React from "react";
import { useParams } from "react-router-dom";
import useGetTrip from "./hooks/getters/useGetTrip";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import Header from "./components/Header";
import { useAuth } from "../../hooks/useAuth";

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

  const { tripName, imageData } = trip;

  return (
    <div className={settings?.font}>
      <Header />
      <div className="px-10">
        <div className="bg-black rounded-3xl relative">
          <img
            src={imageData}
            alt={tripName}
            className="object-cover w-full h-[311px] rounded-3xl opacity-50"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <p className="text-primary text-5xl">{tripName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPage;
