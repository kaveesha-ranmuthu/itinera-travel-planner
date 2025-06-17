import { ViewDisplayOptions } from "./pages/trips/components/ViewSelector";
import { IconId } from "./pages/trips/icon-map";
import { MapViewStyles } from "./pages/trips/types";

export enum FontFamily {
  HANDWRITTEN = "font-family-handwritten",
  SANS_SERIF = "font-family-sans",
  MONOSPACE = "font-family-monospace",
  SERIF = "font-family-serif",
}

type IconInfo = { id: IconId; backgroundColour: string; colour: string };

export type IconStyles = {
  accommodation: IconInfo;
  activity: IconInfo;
  food: IconInfo;
  [key: string]: IconInfo;
};

export type UserSettings = {
  font: FontFamily;
  preferredDisplay: ViewDisplayOptions | null;
  packingList: string | null;
  mapStyle: MapViewStyles | null;
  iconStyle: IconStyles | null;
};

export type UserType = {
  userId: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
};
