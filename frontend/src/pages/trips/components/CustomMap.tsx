import { useCallback, useEffect, useState } from "react";
import Map from "react-map-gl/mapbox";
import { DEFAULT_ICON_STYLES } from "../constants";
import { getMapMarkers } from "../helpers";
import { CustomSectionData } from "../hooks/getters/useGetAllCustomSections";
import { CustomSectionStyles } from "../hooks/getters/useGetCustomSectionStyles";
import { AccommodationDetails, LocationDetails, MapSettings } from "../types";

const API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface CustomMapProps {
  accommodation: AccommodationDetails[];
  food: LocationDetails[];
  activities: LocationDetails[];
  customSections: CustomSectionData;
  mapSettings: MapSettings;
  customSectionStyles: CustomSectionStyles;
}

export const CustomMap: React.FC<CustomMapProps> = ({
  accommodation,
  activities,
  food,
  customSections,
  mapSettings,
  customSectionStyles,
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
      mapStyle={`mapbox://styles/mapbox/${selectedMapStyle}`}
    >
      {activityMarkers}
      {foodMarkers}
      {accommodationMarkers}
      {customSectionMarkers}
    </Map>
  );
};
