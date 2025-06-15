import streetsV12 from "./map-pictures/streets-v12.png";
import darkV11 from "./map-pictures/dark-v11.png";
import satelliteV9 from "./map-pictures/satellite-v9.png";
import lightV11 from "./map-pictures/light-v11.png";
import navigationDayV1 from "./map-pictures/navigation-day-v1.png";
import navigationNightV1 from "./map-pictures/navigation-night-v1.png";
import outdoorsV12 from "./map-pictures/outdoors-v12.png";
import satelliteStreetsV12 from "./map-pictures/satellite-streets-v12.png";
import { MapViewStyles } from "../types";

type MapPicture = {
  id: MapViewStyles;
  src: string;
};

export const mapPicturesToId: MapPicture[] = [
  {
    id: MapViewStyles.STREETS,
    src: streetsV12,
  },
  {
    id: MapViewStyles.DARK,
    src: darkV11,
  },
  {
    id: MapViewStyles.SATELLITE,
    src: satelliteV9,
  },
  {
    id: MapViewStyles.LIGHT,
    src: lightV11,
  },
  {
    id: MapViewStyles.NAVIGATION_DAY,
    src: navigationDayV1,
  },
  {
    id: MapViewStyles.NAVIGATION_NIGHT,
    src: navigationNightV1,
  },
  {
    id: MapViewStyles.OUTDOORS,
    src: outdoorsV12,
  },
  {
    id: MapViewStyles.SATELLITE_STREETS,
    src: satelliteStreetsV12,
  },
];
