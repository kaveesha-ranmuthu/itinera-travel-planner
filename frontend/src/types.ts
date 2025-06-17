import { ViewDisplayOptions } from "./pages/trips/components/ViewSelector";
import { IconId } from "./pages/trips/icon-map";
import { MapViewStyles } from "./pages/trips/types";

export enum FontFamily {
  HANDWRITTEN = "font-family-handwritten",
  SANS_SERIF = "font-family-sans",
  MONOSPACE = "font-family-monospace",
  SERIF = "font-family-serif",
}

export type IconStyle = {
  accommodation: IconId;
  activity: IconId;
  food: IconId;
  [key: string]: IconId;
};

export type UserSettings = {
  font: FontFamily;
  preferredDisplay: ViewDisplayOptions | null;
  packingList: string | null;
  mapStyle: MapViewStyles | null;
  iconStyle: IconStyle | null;
};

export type UserType = {
  userId: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
};
