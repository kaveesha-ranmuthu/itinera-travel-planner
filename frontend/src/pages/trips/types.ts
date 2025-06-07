export interface LocationDetails {
  id: string;
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
