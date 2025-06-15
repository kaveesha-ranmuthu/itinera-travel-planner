import streetsV12 from "./map-pictures/streets-v12.png";
import darkV11 from "./map-pictures/dark-v11.png";
import satelliteV9 from "./map-pictures/satellite-v9.png";
import lightV11 from "./map-pictures/light-v11.png";
import navigationDayV1 from "./map-pictures/navigation-day-v1.png";
import navigationNightV1 from "./map-pictures/navigation-night-v1.png";
import outdoorsV12 from "./map-pictures/outdoors-v12.png";
import satelliteStreetsV12 from "./map-pictures/satellite-streets-v12.png";

type MapPicture = {
  id: string;
  src: string;
};

export const mapPicturesToId: MapPicture[] = [
  {
    id: "streets-v12",
    src: streetsV12,
  },
  {
    id: "dark-v11",
    src: darkV11,
  },
  {
    id: "satellite-v9",
    src: satelliteV9,
  },
  {
    id: "light-v11",
    src: lightV11,
  },
  {
    id: "navigation-day-v1",
    src: navigationDayV1,
  },
  {
    id: "navigation-night-v1",
    src: navigationNightV1,
  },
  {
    id: "outdoors-v12",
    src: outdoorsV12,
  },
  {
    id: "satellite-streets-v12",
    src: satelliteStreetsV12,
  },
];
