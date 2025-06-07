import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useMemo, useState } from "react";
import { FaTheaterMasks } from "react-icons/fa";
import { RiHotelBedFill, RiRestaurantFill } from "react-icons/ri";
import Map from "react-map-gl/mapbox";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "../error/ErrorPage";
import CondensedTripHeader from "./components/sections/CondensedTripHeader";
import Header from "./components/sections/Header";
import {
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getFoodLocalStorageKey,
} from "./components/sections/helpers";
import Itinerary from "./components/sections/Itinerary";
import { getMapMarker } from "./helpers";
import { useGetAccommodation } from "./hooks/getters/useGetAccommodation";
import { useGetActivities } from "./hooks/getters/useGetActivities";
import { useGetFood } from "./hooks/getters/useGetFood";
import useGetTrip from "./hooks/getters/useGetTrip";
import { LoadingState } from "../landing-page/LandingPage";
import { useHotToast } from "../../hooks/useHotToast";
import { useGetItinerary } from "./hooks/getters/useGetItinerary";
import { AccommodationDetails, LocationDetails } from "./types";

const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

const MapViewPage = () => {
  const { tripId } = useParams();
  if (!tripId) {
    return <ErrorPage />;
  }

  return (
    <div className="max-h-screen h-screen overflow-hidden">
      <MapView tripId={tripId} />
    </div>
  );
};

interface MapViewProps {
  tripId: string;
}

const MapView: React.FC<MapViewProps> = ({ tripId }) => {
  const { error, loading, trip } = useGetTrip(tripId);
  const { settings } = useAuth();

  const {
    error: accomodationError,
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
    activities: activitiesData,
  } = useGetActivities(tripId);

  const {
    error: itineraryError,
    itinerary,
    loading: itineraryLoading,
  } = useGetItinerary(tripId);

  const { notify } = useHotToast();

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const isLoading =
      loading ||
      accommodationLoading ||
      foodLoading ||
      activitiesLoading ||
      itineraryLoading;

    if (isLoading) {
      setShowLoading(true); // Ensure loading state stays while data is loading
    } else {
      const timeout = setTimeout(() => {
        setShowLoading(false); // Only hide loading after delay
      }, 1500);

      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [
    loading,
    accommodationLoading,
    foodLoading,
    activitiesLoading,
    itineraryLoading,
  ]);

  if (showLoading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorPage />;
  }

  // TODO: make more specific to type of error
  if (activitiesError || accomodationError || foodError) {
    notify("Something went wrong. Please try again.", "error");
  }

  const accommodationLocalStorage = localStorage.getItem(
    getAccommodationLocalStorageKey(tripId)
  );

  const foodLocalStorage = localStorage.getItem(getFoodLocalStorageKey(tripId));

  const activitiesLocalStorage = localStorage.getItem(
    getActivitiesLocalStorageKey(tripId)
  );

  const accommodation: AccommodationDetails[] = accommodationLocalStorage
    ? JSON.parse(accommodationLocalStorage).data
    : accommodationRows;

  const food: LocationDetails[] = foodLocalStorage
    ? JSON.parse(foodLocalStorage).data
    : foodItems;

  const activities: LocationDetails[] = activitiesLocalStorage
    ? JSON.parse(activitiesLocalStorage).data
    : activitiesData;

  return (
    <div className={twMerge("flex relative animate-fade", settings?.font)}>
      <div className="w-1/3 bg-primary absolute z-10 top-0 left-0 h-full overflow-y-scroll pb-4">
        <Header />
        <div className="px-6 space-y-5">
          <CondensedTripHeader trip={trip} />
          <Itinerary
            tripId={tripId}
            endDate={trip.endDate}
            startDate={trip.startDate}
            showHeader={false}
            itinerary={itinerary}
            error={itineraryError}
          />
        </div>
      </div>
      <CustomMap
        accommodation={accommodation}
        food={food}
        activities={activities}
      />
    </div>
  );
};

interface MapProps {
  accommodation: AccommodationDetails[];
  food: LocationDetails[];
  activities: LocationDetails[];
}

const CustomMap: React.FC<MapProps> = ({ accommodation, activities, food }) => {
  const activityMarkers = useMemo(
    () =>
      activities.map((activity) => (
        <div key={activity.id}>
          {getMapMarker(
            activity,
            "bg-[#D6E5BD]",
            <FaTheaterMasks size={20} className="text-secondary" />
          )}
        </div>
      )),
    [activities]
  );

  const foodMarkers = useMemo(
    () =>
      food.map((f) => (
        <div key={f.id}>
          {getMapMarker(
            f,
            "bg-[#f9e1a8]",
            <RiRestaurantFill size={20} className="text-secondary" />
          )}
        </div>
      )),
    [food]
  );

  const accommodationMarkers = useMemo(
    () =>
      accommodation.map((acc) => (
        <div key={acc.id}>
          {getMapMarker(
            acc,
            "bg-[#BCD8EC]",
            <RiHotelBedFill size={20} className="text-secondary" />
          )}
        </div>
      )),
    [accommodation]
  );

  return (
    <Map
      mapboxAccessToken={API_KEY}
      initialViewState={{
        longitude: activities[0]?.location.longitude || -122.4,
        latitude: activities[0]?.location.latitude || 37.7,
        zoom: 10,
        padding: { left: 300 },
      }}
      style={{ width: "100%", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {activityMarkers}
      {foodMarkers}
      {accommodationMarkers}
    </Map>
  );
};

export default MapViewPage;
