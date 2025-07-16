import { Marker } from "react-map-gl/mapbox";
import { twMerge } from "tailwind-merge";
import { PhotoCard } from "../../trip/LocationWithPhotoCard";
import SimpleTooltip from "../../../components/SimpleTooltip";
import { allIcons } from "./icon-map";
import { LocationDetails } from "../../../types/types";
import { IconInfo } from "../types/types";

export const getMapMarkers = (
  locations: LocationDetails[],
  iconStyles: IconInfo
) => {
  return locations.map((location) => (
    <div key={location.id}>
      {getMarker(
        location,
        iconStyles.backgroundColour,
        iconStyles.colour,
        allIcons[iconStyles.id]
      )}
    </div>
  ));
};

const getMarker = (
  location: LocationDetails,
  markerColour: string,
  iconColour: string,
  icon: React.ReactNode
) => {
  if (!location.location.latitude || !location.location.longitude) return;

  const popupContent = (
    <div className="max-w-50 rounded-3xl py-1">
      <PhotoCard
        className="rounded-lg mb-3"
        mainPhotoUrl={location.photoUrl ?? ""}
        altText={location.name}
        showPlaceholder={false}
      />
      <div className="px-1">
        <p className="text-sm leading-4 mb-0.5">{location.name}</p>
        <p className="opacity-70">{location.formattedAddress}</p>
      </div>
    </div>
  );

  return (
    <Marker
      longitude={location.location.longitude}
      latitude={location.location.latitude}
    >
      <SimpleTooltip content={popupContent}>
        <div
          className={twMerge(
            markerColour,
            iconColour,
            "p-2 rounded-full border-2 border-primary/70"
          )}
        >
          {icon}
        </div>
      </SimpleTooltip>
    </Marker>
  );
};
