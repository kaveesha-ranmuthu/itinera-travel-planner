export interface LocationDetails {
  id: string;
  googleId?: string;
  name: string;
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  startPrice?: number;
  endPrice?: number;
  price: number;
  mainPhotoName: string;
  websiteUri?: string;
  formattedAddress: string;
  createdAt: string;
  _deleted?: boolean;
}

export interface LogisticsDetails extends LocationDetails {
  startTime?: string;
  endTime?: string;
  checked: boolean;
}

export interface AccommodationDetails extends LogisticsDetails {
  pricePerNightPerPerson?: number;
}

export interface TransportationDetails
  extends Omit<
    LogisticsDetails,
    "location" | "formattedAddress" | "mainPhotoName"
  > {
  originCity: string;
  destinationCity: string;
}

export enum LocationCategories {
  ACCOMMODATION = "accommodation",
  FOOD = "food",
  ACTIVITIES = "activities",
}
