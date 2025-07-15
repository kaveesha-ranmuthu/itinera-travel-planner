export type ViewDisplayOptions = "gallery" | "list";

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

export type SelectOption = {
  id: string;
  name: string;
  otherInfo?: { [x in string]: string };
};

export interface Trip {
  tripName: string;
  startDate: string;
  endDate: string;
  countries: SelectOption[];
  numberOfPeople: number;
  currency: SelectOption | null;
  budget: number;
  imageData: string;
}

export interface TripData extends Trip {
  id: string;
  updatedAt: Date;
  subCollections: string[];
  customCollections: string[];
  currentSavings: number;
  taskList: string;
  packingList?: string;
}
