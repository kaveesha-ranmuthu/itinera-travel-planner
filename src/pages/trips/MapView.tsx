import React from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../error/ErrorPage";
import { AccommodationRow } from "./components/sections/Accommodation";
import {
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getFoodLocalStorageKey,
} from "./components/sections/helpers";
import { useGetAccommodation } from "./hooks/getters/useGetAccommodation";
import { BiSolidHotel } from "react-icons/bi";
import { useGetFood } from "./hooks/getters/useGetFood";
import { LocationCardDetails } from "./components/LocationWithPhotoCard";
import { IoRestaurantSharp } from "react-icons/io5";
import { useGetActivities } from "./hooks/getters/useGetActivities";
import { FaMasksTheater } from "react-icons/fa6";
import Itinerary from "./components/sections/Itinerary";
import useGetTrip from "./hooks/getters/useGetTrip";
import { useAuth } from "../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import Header from "./components/sections/Header";
import CondensedTripHeader from "./components/sections/CondensedTripHeader";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

const MapViewPage = () => {
  const { tripId } = useParams();
  if (!tripId) {
    return <ErrorPage />;
  }

  return <MapView tripId={tripId} />;
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

  if (!trip) return;

  const accommodationLocalStorage = localStorage.getItem(
    getAccommodationLocalStorageKey(tripId)
  );

  const foodLocalStorage = localStorage.getItem(getFoodLocalStorageKey(tripId));

  const activitiesLocalStorage = localStorage.getItem(
    getActivitiesLocalStorageKey(tripId)
  );

  const accommodation: AccommodationRow[] = accommodationLocalStorage
    ? JSON.parse(accommodationLocalStorage).data
    : accommodationRows;

  const food: LocationCardDetails[] = foodLocalStorage
    ? JSON.parse(foodLocalStorage).data
    : foodItems;

  const activities: LocationCardDetails[] = activitiesLocalStorage
    ? JSON.parse(activitiesLocalStorage).data
    : activitiesData;

  return (
    <div>
      <div className={twMerge("flex", settings?.font)}>
        <div className="w-1/3">
          <Header />
          <div className="px-6 space-y-7">
            <CondensedTripHeader trip={trip} />
            <Itinerary
              tripId={tripId}
              endDate={trip.endDate}
              startDate={trip.startDate}
              showHeader={false}
            />
          </div>
        </div>
        <Map
          mapboxAccessToken={API_KEY}
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14,
          }}
          style={{ width: "100%", height: "100vh" }}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
        />
      </div>
    </div>
  );
};

export default MapViewPage;
