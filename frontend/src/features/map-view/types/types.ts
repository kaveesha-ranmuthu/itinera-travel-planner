import { IconId } from "../utils/icon-map";

export enum LocationCategories {
  ACCOMMODATION = "accommodation",
  FOOD = "food",
  ACTIVITIES = "activities",
}

export enum MapViewSidebarSelectorOptions {
  ITINERARY = "itinerary",
  LOCATIONS = "locations",
  CUSTOMISE_MAP = "customise",
}

export enum MapViewStyles {
  STREETS = "streets-v12",
  DARK = "dark-v11",
  SATELLITE = "satellite-v9",
  LIGHT = "light-v11",
  NAVIGATION_DAY = "navigation-day-v1",
  NAVIGATION_NIGHT = "navigation-night-v1",
  OUTDOORS = "outdoors-v12",
  SATELLITE_STREETS = "satellite-streets-v12",
}

export type IconInfo = { id: IconId; backgroundColour: string; colour: string };

export type IconStyles = {
  accommodation: IconInfo;
  activity: IconInfo;
  food: IconInfo;
  [key: string]: IconInfo;
};

export type MapSettings = {
  iconStyles: IconStyles;
  mapStyle: MapViewStyles;
};
