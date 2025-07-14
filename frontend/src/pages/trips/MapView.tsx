import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Loading } from "../../components/Loading";
import ErrorPage from "../../pages-2/ErrorPage";
import { useAuth } from "../../hooks/useAuth";
import { useHotToast } from "../../hooks/useHotToast";
import { useSaving } from "../../hooks/useSaving";
import CustomiseMap from "./components/CustomiseMap";
import { CustomMap } from "./components/CustomMap";
import LocationSearch, {
  LocationSearchResult,
} from "./components/LocationSearch";
import MapViewSidebarSelector from "./components/MapViewSidebarSelector";
import CondensedTripHeader from "./components/sections/CondensedTripHeader";
import Header from "./components/sections/Header";
import {
  addTripToLocalStorage,
  getAccommodationLocalStorageKey,
  getActivitiesLocalStorageKey,
  getCustomSectionLocalStorageKey,
  getFoodLocalStorageKey,
  getLocationDetails,
  getPhotoDownloadUrl,
} from "./components/sections/helpers";
import Itinerary, { ItineraryDetails } from "./components/sections/Itinerary";
import SidebarLocationSection, {
  SidebarLocationDetails,
} from "./components/SidebarLocationSection";
import { useGetAccommodation } from "./hooks/getters/useGetAccommodation";
import { useGetActivities } from "./hooks/getters/useGetActivities";
import {
  CustomSectionData,
  useGetAllCustomSections,
} from "./hooks/getters/useGetAllCustomSections";
import {
  CustomSectionStyles,
  useGetCustomSectionStyles,
} from "./hooks/getters/useGetCustomSectionStyles";
import { useGetFood } from "./hooks/getters/useGetFood";
import { useGetItinerary } from "./hooks/getters/useGetItinerary";
import { useGetLatLng } from "./hooks/getters/useGetLatLng";
import { useGetMapSettings } from "./hooks/getters/useGetMapSettings";
import useGetTrip from "./hooks/getters/useGetTrip";
import { TripData } from "./hooks/getters/useGetTrips";
import {
  AccommodationDetails,
  LocationCategories,
  LocationDetails,
  MapSettings,
  MapViewSidebarSelectorOptions,
} from "./types";

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

  const {
    data: customSections,
    error: customSectionsError,
    loading: customSectionsLoading,
  } = useGetAllCustomSections(tripId ?? "", trip?.customCollections ?? []);

  const {
    mapSettings,
    error: mapSettingsError,
    loading: mapSettingsLoading,
  } = useGetMapSettings(tripId ?? "");

  const filteredCustomSections: CustomSectionData = Object.fromEntries(
    Object.entries(customSections).map(([name, data]) => [
      name,
      data.filter((item) => Object.keys(item).length > 0),
    ])
  );

  const { getCustomSectionStyles } = useGetCustomSectionStyles();

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const isLoading =
      loading ||
      accommodationLoading ||
      foodLoading ||
      activitiesLoading ||
      itineraryLoading ||
      customSectionsLoading ||
      mapSettingsLoading;

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
    customSectionsLoading,
    mapSettingsLoading,
  ]);

  if (showLoading) {
    return <Loading />;
  }

  // TODO: make more specific to type of error
  if (
    activitiesError ||
    accommodationError ||
    foodError ||
    customSectionsError
  ) {
    notify("Something went wrong. Please try again.", "error");
  }

  if (!tripId || error || !trip || mapSettingsError) {
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
        savedCustomSections={filteredCustomSections}
        mapSettings={mapSettings}
        defaultCustomSectionStyles={getCustomSectionStyles(
          filteredCustomSections
        )}
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
  savedCustomSections: CustomSectionData;
  mapSettings: MapSettings;
  defaultCustomSectionStyles: CustomSectionStyles;
}

const MapView: React.FC<MapViewProps> = ({
  trip,
  accommodationRows,
  foodItems,
  activitiesData,
  itinerary,
  itineraryError,
  savedCustomSections,
  mapSettings,
  defaultCustomSectionStyles,
}) => {
  const { settings } = useAuth();
  const { isSaving } = useSaving();
  const { notify } = useHotToast();

  const { latLng, loading } = useGetLatLng(trip.countries[0].name);

  const [selectedView, setSelectedView] = useState(
    MapViewSidebarSelectorOptions.ITINERARY
  );

  const [selectedLocationSection, setSelectedLocationSection] = useState<
    LocationCategories | string
  >(LocationCategories.ACCOMMODATION);

  const accommodationLocalStorage = localStorage.getItem(
    getAccommodationLocalStorageKey(trip.id)
  );

  const foodLocalStorage = localStorage.getItem(
    getFoodLocalStorageKey(trip.id)
  );

  const activitiesLocalStorage = localStorage.getItem(
    getActivitiesLocalStorageKey(trip.id)
  );

  const [customSections, setCustomSections] =
    useState<CustomSectionData>(savedCustomSections);

  const [customSectionStyles, setCustomSectionStyles] = useState(
    defaultCustomSectionStyles
  );

  useEffect(() => {
    Object.keys(savedCustomSections).forEach((sectionName) => {
      const localStorageKey = getCustomSectionLocalStorageKey(
        trip.id,
        sectionName
      );
      const sectionData = localStorage.getItem(localStorageKey);
      if (sectionData) {
        setCustomSections((prev) => ({
          ...prev,
          [sectionName]: JSON.parse(sectionData).data,
        }));
      }
    });
  }, [savedCustomSections, trip.id]);

  useEffect(() => {
    Object.keys(defaultCustomSectionStyles).map((sectionName) => {
      const savedStyle = mapSettings.iconStyles[sectionName];
      if (savedStyle) {
        setCustomSectionStyles((prevStyles) => ({
          ...prevStyles,
          [sectionName]: {
            ...prevStyles[sectionName],
            ...savedStyle,
          },
        }));
      }
    });
  }, [defaultCustomSectionStyles, mapSettings]);

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
  const [hideCustomSections, setHideCustomSections] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const initialHideCustomSections: { [key: string]: boolean } = {};
    Object.keys(customSections).forEach((sectionName) => {
      initialHideCustomSections[sectionName] = false;
    });
    setHideCustomSections(initialHideCustomSections);
  }, [customSections]);

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
    ...Object.entries(customSections).map(([name, data]) => {
      return {
        locations: data.filter((item) => !item._deleted),
        title: name,
        isHidden: hideCustomSections[name],
        toggleVisibility: (show: boolean) => {
          setHideCustomSections((prev) => ({
            ...prev,
            [name]: show,
          }));
        },
      };
    }),
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

  const updateLocalStorageCustomSection = async (
    sectionName: string,
    location: LocationSearchResult
  ) => {
    const localStorageKey = getCustomSectionLocalStorageKey(
      trip.id,
      sectionName
    );
    const currentData = customSections[sectionName];
    const newLocationDetails = getLocationDetails(location, null);

    const locationIds = currentData.map((d) => d.id) ?? [];
    if (locationIds.includes(location.id)) {
      notify("This location has already been added.", "info");
      return;
    }
    setCustomSections({
      ...customSections,
      [sectionName]: [...currentData, newLocationDetails],
    });

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
      default: {
        const localStorageKey = getCustomSectionLocalStorageKey(
          trip.id,
          selectedLocationSection
        );
        const currentData = customSections[selectedLocationSection];
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
        setCustomSections({
          ...customSections,
          [selectedLocationSection]: dataToSave,
        });
        break;
      }
    }
    addTripToLocalStorage(trip.id);
  };

  const getSelectedViewDisplay = () => {
    if (selectedView === MapViewSidebarSelectorOptions.ITINERARY) {
      return (
        <Itinerary
          tripId={trip.id}
          endDate={trip.endDate}
          startDate={trip.startDate}
          showHeader={false}
          itinerary={itinerary}
          error={itineraryError}
        />
      );
    } else if (selectedView === MapViewSidebarSelectorOptions.LOCATIONS) {
      return (
        <div className="space-y-3">
          <LocationSearch
            inputBoxClassname="w-full"
            optionsBoxClassname="z-50 w-[430px]"
            latitude={latLng?.[0]}
            longitude={latLng?.[1]}
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
                default: {
                  updateLocalStorageCustomSection(
                    selectedLocationSection,
                    location
                  );
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
                  onSelect={() => setSelectedLocationSection(location.title)}
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
      );
    } else if (selectedView === MapViewSidebarSelectorOptions.CUSTOMISE_MAP) {
      return (
        <CustomiseMap
          tripId={trip.id}
          mapSettings={mapSettings}
          customSectionStyles={customSectionStyles}
        />
      );
    }
  };

  const customSectionsToShow = Object.fromEntries(
    Object.entries(customSections).filter(([name]) => !hideCustomSections[name])
  );

  if (loading) {
    return <Loading />;
  }

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
          {getSelectedViewDisplay()}
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
        customSections={customSectionsToShow}
        mapSettings={mapSettings}
        customSectionStyles={customSectionStyles}
        latitude={latLng?.[0]}
        longitude={latLng?.[1]}
      />
    </div>
  );
};

export default MapViewPage;
