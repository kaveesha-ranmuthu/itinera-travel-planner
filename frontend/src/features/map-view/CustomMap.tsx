import { useCallback, useEffect, useState } from "react";
import Map from "react-map-gl/mapbox";
import { DEFAULT_ICON_STYLES } from "./utils/constants";
import { getMapMarkers } from "./utils/helpers";
import { CustomSectionData } from "./hooks/useGetAllCustomSections";
import { CustomSectionStyles } from "./hooks/useGetCustomSectionStyles";
import {
  AccommodationDetails,
  LocationDetails,
  MapSettings,
} from "../../pages/trips/types";

const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface CustomMapProps {
  accommodation: AccommodationDetails[];
  food: LocationDetails[];
  activities: LocationDetails[];
  customSections: CustomSectionData;
  mapSettings: MapSettings;
  customSectionStyles: CustomSectionStyles;
  longitude?: number;
  latitude?: number;
}

export const CustomMap: React.FC<CustomMapProps> = ({
  accommodation,
  activities,
  food,
  customSections,
  mapSettings,
  customSectionStyles,
  longitude = -122.4,
  latitude = 37.8,
}) => {
  const getCustomSectionMarkers = useCallback(
    () =>
      Object.entries(customSections).flatMap(([sectionName, locations]) => {
        return getMapMarkers(locations, customSectionStyles[sectionName]);
      }),
    [customSections, customSectionStyles]
  );

  const [customSectionMarkers, setCustomSectionMarkers] = useState(
    getCustomSectionMarkers()
  );

  useEffect(() => {
    setCustomSectionMarkers(getCustomSectionMarkers());
  }, [getCustomSectionMarkers, customSectionStyles]);

  const selectedMapStyle = mapSettings.mapStyle;
  const {
    accommodation: accommodationIcon,
    activity: activityIcon,
    food: foodIcon,
  } = {
    accommodation: {
      ...DEFAULT_ICON_STYLES.accommodation,
      ...mapSettings.iconStyles.accommodation,
    },
    activity: {
      ...DEFAULT_ICON_STYLES.activity,
      ...mapSettings.iconStyles.activity,
    },
    food: {
      ...DEFAULT_ICON_STYLES.food,
      ...mapSettings.iconStyles.food,
    },
  };

  const activityMarkers = getMapMarkers(activities, activityIcon);
  const foodMarkers = getMapMarkers(food, foodIcon);
  const accommodationMarkers = getMapMarkers(accommodation, accommodationIcon);

  const [activityLong, activityLang] = [
    activities[0]?.location.longitude,
    activities[0]?.location.latitude,
  ];
  const [foodLong, foodLang] = [
    food[0]?.location.longitude,
    food[0]?.location.latitude,
  ];
  const [accommodationLong, accommodationLang] = [
    accommodation[0]?.location.longitude,
    accommodation[0]?.location.latitude,
  ];

  const zoom = !activityLong && !foodLong && !accommodationLong ? 5 : 14;

  return (
    <Map
      mapboxAccessToken={API_KEY}
      initialViewState={{
        longitude: activityLong || foodLong || accommodationLong || longitude,
        latitude: activityLang || foodLang || accommodationLang || latitude,
        zoom,
        padding: { left: 300 },
      }}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={`mapbox://styles/mapbox/${selectedMapStyle}`}
    >
      {activityMarkers}
      {foodMarkers}
      {accommodationMarkers}
      {customSectionMarkers}
    </Map>
  );
};
