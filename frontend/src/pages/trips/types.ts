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
  photoUrl: string | null;
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
  extends Omit<LogisticsDetails, "location" | "formattedAddress" | "photoUrl"> {
  originCity: string;
  destinationCity: string;
}

export enum LocationCategories {
  ACCOMMODATION = "accommodation",
  FOOD = "food",
  ACTIVITIES = "activities",
}
