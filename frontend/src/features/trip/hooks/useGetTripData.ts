import { useGetAccommodation } from "../../../hooks/useGetAccommodation";
import { useGetActivities } from "../../../hooks/useGetActivities";
import { useGetFood } from "../../../hooks/useGetFood";
import { useGetItinerary } from "../../../hooks/useGetItinerary";
import { useGetTransport } from "./useGetTransport";

const useGetTripData = (tripId: string) => {
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

  return {
    loading:
      accommodationLoading ||
      foodLoading ||
      activitiesLoading ||
      transportLoading ||
      itineraryLoading,
    accommodationError,
    accommodationRows,
    foodError,
    foodItems,
    activitiesError,
    activities,
    transportError,
    transportRows,
    itineraryError,
    itinerary,
  };
};

export default useGetTripData;
