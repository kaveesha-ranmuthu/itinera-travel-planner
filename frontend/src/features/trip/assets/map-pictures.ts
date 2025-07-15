import { MapViewStyles } from "../../map-view/types/types";

type MapPicture = {
  id: MapViewStyles;
  src: string;
};

export const mapPicturesToId: MapPicture[] = [
  {
    id: MapViewStyles.STREETS,
    src: "/images/maps/streets-v12.png",
  },
  {
    id: MapViewStyles.DARK,
    src: "/images/maps/dark-v11.png",
  },
  {
    id: MapViewStyles.SATELLITE,
    src: "/images/maps/satellite-v9.png",
  },
  {
    id: MapViewStyles.LIGHT,
    src: "/images/maps/light-v10.png",
  },
  {
    id: MapViewStyles.NAVIGATION_DAY,
    src: "/images/maps/navigation-day-v1.png",
  },
  {
    id: MapViewStyles.NAVIGATION_NIGHT,
    src: "/images/maps/navigation-night-v1.png",
  },
  {
    id: MapViewStyles.OUTDOORS,
    src: "/images/maps/outdoors-v11.png",
  },
  {
    id: MapViewStyles.SATELLITE_STREETS,
    src: "/images/maps/satellite-streets-v12.png",
  },
];
