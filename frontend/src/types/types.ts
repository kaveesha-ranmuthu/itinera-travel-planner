import { ViewDisplayOptions } from "./pages/trips/components/ViewSelector";

export enum FontFamily {
  HANDWRITTEN = "font-family-handwritten",
  SANS_SERIF = "font-family-sans",
  MONOSPACE = "font-family-monospace",
  SERIF = "font-family-serif",
}

export type UserSettings = {
  font: FontFamily;
  preferredDisplay: ViewDisplayOptions | null;
  packingList: string | null;
};

export type UserType = {
  userId: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
};
