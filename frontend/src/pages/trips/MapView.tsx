import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useMemo, useState } from "react";
import { FaTheaterMasks } from "react-icons/fa";
import { RiHotelBedFill, RiRestaurantFill } from "react-icons/ri";
import Map from "react-map-gl/mapbox";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import ErrorPage from "../error/ErrorPage";
import { LoadingState } from "../landing-page/LandingPage";
import LocationSearch, {
  LocationSearchResult,
} from "./components/LocationSearch";
import MapViewSidebarSelector, {
  MapViewSidebarSelectorOptions,
} from "./components/MapViewSidebarSelector";
import CondensedTripHeader from "./components/sections/CondensedTripHeader";
import Header from "./components/sections/Header";
import {
  addTripToLocalStorage,
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getFoodLocalStorageKey,
  getLocationDetails,
  getPhotoDownloadUrl,
} from "./components/sections/helpers";
import Itinerary, { ItineraryDetails } from "./components/sections/Itinerary";
import SidebarLocationSection, {
  SidebarLocationDetails,
} from "./components/SidebarLocationSection";
import { getMapMarker } from "./helpers";
import { useGetAccommodation } from "./hooks/getters/useGetAccommodation";
import { useGetActivities } from "./hooks/getters/useGetActivities";
import { useGetFood } from "./hooks/getters/useGetFood";
import { useGetItinerary } from "./hooks/getters/useGetItinerary";
import useGetTrip from "./hooks/getters/useGetTrip";
import { TripData } from "./hooks/getters/useGetTrips";
import {
  AccommodationDetails,
  LocationCategories,
  LocationDetails,
} from "./types";
import { useSaving } from "../../saving-provider/useSaving";

const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

const MapViewPage = () => {
  const { tripId } = useParams();
  const { error, loading, trip } = useGetTrip(tripId ?? "");

  const { notify } = useHotToast();

  const {
    error: accommodationError,
    loading: accommodationLoading,
    accommodationRows,
  } = useGetAccommodation(tripId ?? "");

  const {
    error: foodError,
    loading: foodLoading,
    foodItems,
  } = useGetFood(tripId ?? "");

  const {
    error: activitiesError,
    loading: activitiesLoading,
    activities: activitiesData,
  } = useGetActivities(tripId ?? "");

  const {
    error: itineraryError,
    itinerary,
    loading: itineraryLoading,
  } = useGetItinerary(tripId ?? "");

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

  // TODO: make more specific to type of error
  if (activitiesError || accommodationError || foodError) {
    notify("Something went wrong. Please try again.", "error");
  }

  if (!tripId || error || !trip) {
    return <ErrorPage />;
  }

  return (
    <div className="max-h-screen h-screen overflow-hidden">
      <MapView
        trip={trip}
        accommodationRows={accommodationRows}
        activitiesData={activitiesData}
        foodItems={foodItems}
        itinerary={itinerary}
        itineraryError={itineraryError}
      />
    </div>
  );
};

interface MapViewProps {
  trip: TripData;
  accommodationRows: AccommodationDetails[];
  foodItems: LocationDetails[];
  activitiesData: LocationDetails[];
  itinerary: ItineraryDetails[];
  itineraryError: string | null;
}

const MapView: React.FC<MapViewProps> = ({
  trip,
  accommodationRows,
  foodItems,
  activitiesData,
  itinerary,
  itineraryError,
}) => {
  const { settings } = useAuth();
  const { isSaving } = useSaving();
  const { notify } = useHotToast();

  const [selectedView, setSelectedView] =
    useState<MapViewSidebarSelectorOptions>("itinerary");

  const [selectedLocationSection, setSelectedLocationSection] = useState(
    LocationCategories.ACCOMMODATION
  );

  const accommodationLocalStorage = localStorage.getItem(
    getAccommodationLocalStorageKey(trip.id)
  );

  const foodLocalStorage = localStorage.getItem(
    getFoodLocalStorageKey(trip.id)
  );

  const activitiesLocalStorage = localStorage.getItem(
    getActivitiesLocalStorageKey(trip.id)
  );

  const [accommodation, setAccommodation] = useState<AccommodationDetails[]>(
    accommodationLocalStorage
      ? JSON.parse(accommodationLocalStorage).data
      : accommodationRows
  );

  const [food, setFood] = useState<LocationDetails[]>(
    foodLocalStorage ? JSON.parse(foodLocalStorage).data : foodItems
  );

  const [activities, setActivities] = useState<LocationDetails[]>(
    activitiesLocalStorage
      ? JSON.parse(activitiesLocalStorage).data
      : activitiesData
  );

  const [hideAccommodation, setHideAccommodation] = useState(false);
  const [hideFood, setHideFood] = useState(false);
  const [hideActivities, setHideActivities] = useState(false);

  const sidebarLocationSections: SidebarLocationDetails[] = [
    {
      locations: accommodation.filter((item) => !item._deleted),
      title: LocationCategories.ACCOMMODATION,
      isHidden: hideAccommodation,
      toggleVisibility: (show: boolean) => setHideAccommodation(show),
    },
    {
      locations: food.filter((item) => !item._deleted),
      title: LocationCategories.FOOD,
      isHidden: hideFood,
      toggleVisibility: (show: boolean) => setHideFood(show),
    },
    {
      locations: activities.filter((item) => !item._deleted),
      title: LocationCategories.ACTIVITIES,
      isHidden: hideActivities,
      toggleVisibility: (show: boolean) => setHideActivities(show),
    },
  ];

  const updateLocalStorageAccommodation = async (
    location: LocationSearchResult
  ) => {
    const localStorageKey = getAccommodationLocalStorageKey(trip.id);
    const currentData = accommodation;
    const newLocationDetails = {
      ...getLocationDetails(location, null),
      checked: false,
      pricePerNightPerPerson: 0,
      startTime: `${trip.startDate}T00:00`,
      endTime: `${trip.endDate}T00:00`,
    };
    const locationIds = currentData.map((d) => d.id) ?? [];
    if (locationIds.includes(location.id)) {
      notify("This location has already been added.", "info");
      return;
    }
    setAccommodation([...currentData, newLocationDetails]);

    const photoUrl = await getPhotoDownloadUrl(location);
    const dataToSave = [...currentData, { ...newLocationDetails, photoUrl }];
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        data: dataToSave,
      })
    );
  };

  const updateLocalStorageFood = async (location: LocationSearchResult) => {
    const localStorageKey = getFoodLocalStorageKey(trip.id);
    const currentData = food;
    const newLocationDetails = getLocationDetails(location, null);

    const locationIds = currentData.map((d) => d.id) ?? [];
    if (locationIds.includes(location.id)) {
      notify("This location has already been added.", "info");
      return;
    }
    setFood([...currentData, newLocationDetails]);

    const photoUrl = await getPhotoDownloadUrl(location);
    const dataToSave = [...currentData, { ...newLocationDetails, photoUrl }];
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        data: dataToSave,
      })
    );
  };

  const updateLocalStorageActivities = async (
    location: LocationSearchResult
  ) => {
    const localStorageKey = getActivitiesLocalStorageKey(trip.id);
    const currentData = activities;
    const newLocationDetails = getLocationDetails(location, null);

    const locationIds = currentData.map((d) => d.id) ?? [];
    if (locationIds.includes(location.id)) {
      notify("This location has already been added.", "info");
      return;
    }
    setActivities([...currentData, newLocationDetails]);

    const photoUrl = await getPhotoDownloadUrl(location);
    const dataToSave = [...currentData, { ...newLocationDetails, photoUrl }];
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        data: dataToSave,
      })
    );
  };

  const deleteLocalStorage = async (deleteId: string) => {
    switch (selectedLocationSection) {
      case LocationCategories.ACCOMMODATION: {
        const localStorageKey = getAccommodationLocalStorageKey(trip.id);
        const currentData = accommodation;
        const dataToSave = currentData.map((d) => {
          if (d.id === deleteId) {
            return { ...d, _deleted: true };
          }
          return d;
        });
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            data: dataToSave,
          })
        );

        setAccommodation(dataToSave);
        break;
      }
      case LocationCategories.FOOD: {
        const localStorageKey = getFoodLocalStorageKey(trip.id);
        const currentData = food;
        const dataToSave = currentData.map((d) => {
          if (d.id === deleteId) {
            return { ...d, _deleted: true };
          }
          return d;
        });
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            data: dataToSave,
          })
        );
        setFood(dataToSave);
        break;
      }
      case LocationCategories.ACTIVITIES: {
        const localStorageKey = getActivitiesLocalStorageKey(trip.id);
        const currentData = activities;
        const dataToSave = currentData.map((d) => {
          if (d.id === deleteId) {
            return { ...d, _deleted: true };
          }
          return d;
        });
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            data: dataToSave,
          })
        );
        setActivities(dataToSave);
        break;
      }
    }
    addTripToLocalStorage(trip.id);
  };

  return (
    <div
      className={twMerge(
        "flex relative animate-fade",
        settings?.font,
        isSaving && "opacity-50 pointer-events-none"
      )}
    >
      <div className="w-1/3 bg-primary absolute z-10 top-0 left-0 h-full overflow-y-scroll pb-4">
        <Header />
        <div className="px-6 space-y-5">
          <CondensedTripHeader trip={trip} />
          <MapViewSidebarSelector
            selectedView={selectedView}
            onSelectView={setSelectedView}
          />
          {selectedView === "itinerary" ? (
            <Itinerary
              tripId={trip.id}
              endDate={trip.endDate}
              startDate={trip.startDate}
              showHeader={false}
              itinerary={itinerary}
              error={itineraryError}
            />
          ) : (
            <div className="space-y-3">
              <LocationSearch
                inputBoxClassname="w-full"
                optionsBoxClassname="z-50 w-[430px]"
                onSelectLocation={(location) => {
                  switch (selectedLocationSection) {
                    case LocationCategories.ACCOMMODATION: {
                      updateLocalStorageAccommodation(location);
                      break;
                    }
                    case LocationCategories.FOOD: {
                      updateLocalStorageFood(location);
                      break;
                    }
                    case LocationCategories.ACTIVITIES: {
                      updateLocalStorageActivities(location);
                      break;
                    }
                  }
                  addTripToLocalStorage(trip.id);
                }}
              />
              <div className="space-y-5 px-1">
                {sidebarLocationSections.map((location) => {
                  return (
                    <SidebarLocationSection
                      key={location.title}
                      locations={location.locations}
                      title={location.title}
                      userCurrencySymbol={trip.currency?.otherInfo?.symbol}
                      selected={selectedLocationSection === location.title}
                      onSelect={() =>
                        setSelectedLocationSection(location.title)
                      }
                      onDelete={(locationId) => {
                        deleteLocalStorage(locationId);
                      }}
                      toggleVisibility={location.toggleVisibility}
                      isHidden={location.isHidden}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <CustomMap
        accommodation={
          hideAccommodation
            ? []
            : accommodation.filter((item) => !item._deleted)
        }
        food={hideFood ? [] : food.filter((item) => !item._deleted)}
        activities={
          hideActivities ? [] : activities.filter((item) => !item._deleted)
        }
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
