import { useCallback, useEffect, useState } from "react";
import Map from "react-map-gl/mapbox";
import { AccommodationDetails, LocationDetails } from "../../types/types";
import { CustomSectionData } from "./hooks/useGetAllCustomSections";
import { CustomSectionStyles } from "./hooks/useGetCustomSectionStyles";
import { MapSettings } from "./types/types";
import { DEFAULT_ICON_STYLES } from "./utils/constants";
import { getMapMarkers } from "./utils/helpers";

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
  hoveredLocation: string | null;
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
  hoveredLocation,
}) => {
  const getCustomSectionMarkers = useCallback(
    () =>
      Object.entries(customSections).flatMap(([sectionName, locations]) => {
        return getMapMarkers(
          locations,
          customSectionStyles[sectionName],
          hoveredLocation
        );
      }),
    [customSections, hoveredLocation, customSectionStyles]
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

  const activityMarkers = getMapMarkers(
    activities,
    activityIcon,
    hoveredLocation
  );
  const foodMarkers = getMapMarkers(food, foodIcon, hoveredLocation);
  const accommodationMarkers = getMapMarkers(
    accommodation,
    accommodationIcon,
    hoveredLocation
  );

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
