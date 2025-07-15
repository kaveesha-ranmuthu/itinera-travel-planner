import { sortBy } from "lodash";
import { useEffect, useState } from "react";
import Error from "../../components/Error";
import { Loading } from "../../components/Loading";
import { useAuth } from "../../hooks/useAuth";
import CreateTripPopup from "../../components/CreateTripPopup";
import Header from "../../components/Header";
import { useGetTrips } from "./hooks/useGetTrips";
import { useCreateNewTrip } from "./hooks/useCreateNewTrip";
import { FontFamily, Trip } from "../../types/types";
import { CreateTripButton } from "./CreateTripButton";
import { TripsGrid } from "./TripsGrid";

const Dashboard = () => {
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
    return <Loading />;
  }

  if (tripsFetchError) {
    return <Error />;
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
          <CreateTripButton onClick={() => setIsModalOpen(true)} />
        </div>
        <div className="py-14">
          <TripsGrid trips={sortedTrips} />
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

export default Dashboard;
