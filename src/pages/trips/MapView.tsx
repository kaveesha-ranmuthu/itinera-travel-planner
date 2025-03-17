import {
  AdvancedMarker,
  APIProvider,
  ColorScheme,
  Map,
  Marker,
  Pin,
} from "@vis.gl/react-google-maps";
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
import TripHeader from "./components/sections/TripHeader";
import CondensedTripHeader from "./components/sections/CondensedTripHeader";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    <APIProvider apiKey={API_KEY}>
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
          mapId="itinera-map-view"
          style={{ width: "66.6%", height: "100vh" }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          defaultZoom={3}
          gestureHandling="greedy"
          disableDefaultUI={true}
          colorScheme={ColorScheme.LIGHT}
        >
          {accommodation.map((row) => {
            if (!row.location.latitude || !row.location.longitude) return;
            return (
              <AdvancedMarker
                key={row.id}
                position={{
                  lat: row.location.latitude,
                  lng: row.location.longitude,
                }}
              >
                <AccommodationPin />
              </AdvancedMarker>
            );
          })}
          {food.map((row) => {
            if (!row.location.latitude || !row.location.longitude) return;
            return (
              <AdvancedMarker
                key={row.id}
                position={{
                  lat: row.location.latitude,
                  lng: row.location.longitude,
                }}
              >
                <FoodPin />
              </AdvancedMarker>
            );
          })}
          {activities.map((row) => {
            if (!row.location.latitude || !row.location.longitude) return;
            return (
              <AdvancedMarker
                key={row.id}
                position={{
                  lat: row.location.latitude,
                  lng: row.location.longitude,
                }}
              >
                <ActivityPin />
              </AdvancedMarker>
            );
          })}
        </Map>
      </div>
    </APIProvider>
  );
};

const AccommodationPin = () => {
  return (
    <Pin background="#05829E" borderColor="#F4F1E8" scale={1.5}>
      <BiSolidHotel className="text-primary" size={20} />
    </Pin>
  );
};

const FoodPin = () => {
  return (
    <Pin background="#609553" borderColor="#F4F1E8" scale={1.5}>
      <IoRestaurantSharp className="text-primary" size={20} />
    </Pin>
  );
};

const ActivityPin = () => {
  return (
    <Pin background="#B04A46" borderColor="#F4F1E8" scale={1.5}>
      <FaMasksTheater className="text-primary" size={20} />
    </Pin>
  );
};

export default MapViewPage;
