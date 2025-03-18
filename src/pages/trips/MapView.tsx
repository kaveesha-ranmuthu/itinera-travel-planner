import "mapbox-gl/dist/mapbox-gl.css";
import React, { useMemo } from "react";
import { FaTheaterMasks } from "react-icons/fa";
import { RiHotelBedFill, RiRestaurantFill } from "react-icons/ri";
import Map from "react-map-gl/mapbox";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import ErrorPage from "../error/ErrorPage";
import { LocationCardDetails } from "./components/LocationWithPhotoCard";
import { AccommodationRow } from "./components/sections/Accommodation";
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
    <div className={twMerge("flex", settings?.font)}>
      <div className="w-1/2">
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
      <CustomMap
        accommodation={accommodation}
        food={food}
        activities={activities}
      />
    </div>
  );
};

interface MapProps {
  accommodation: AccommodationRow[];
  food: LocationCardDetails[];
  activities: LocationCardDetails[];
}

const CustomMap: React.FC<MapProps> = ({ accommodation, activities, food }) => {
  const activityMarkers = useMemo(
    () =>
      activities.map((activity) => (
        <div key={activity.id}>
          {getMapMarker(
            activity,
            "bg-secondary",
            <FaTheaterMasks size={20} className="text-primary" />
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
            "bg-secondary",
            <RiRestaurantFill size={20} className="text-primary" />
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
            "bg-secondary",
            <RiHotelBedFill size={20} className="text-primary" />
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
