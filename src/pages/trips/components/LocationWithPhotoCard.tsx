import { Field } from "formik";
import { round } from "lodash";
import React, { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdPhoto } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export interface LocationCardDetails {
  id: string;
  name: string;
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  startPrice?: number;
  endPrice?: number;
  mainPhotoName: string;
  createdAt: string;
  websiteUri?: string;
}

interface LocationWithPhotoCardProps {
  location: LocationCardDetails;
  currencySymbol?: string;
  onDelete?: () => void;
  locationFieldName: string;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getFormattedPrice = (
  startPrice?: number,
  endPrice?: number,
  currencySymbol?: string
) => {
  const symbol = currencySymbol || "";
  if (startPrice && endPrice) {
    return `${symbol}${round(startPrice)}-${round(endPrice)}`;
  } else if (startPrice) {
    return `${symbol}${round(startPrice)}`;
  } else if (endPrice) {
    return `${symbol}${round(endPrice)}`;
  }
};

const LocationWithPhotoCard: React.FC<LocationWithPhotoCardProps> = ({
  location,
  currencySymbol,
  onDelete,
  locationFieldName,
}) => {
  const { mainPhotoName, name, startPrice, endPrice, websiteUri } = location;
  const mainPhotoUrl = `https://places.googleapis.com/v1/${mainPhotoName}/media?maxWidthPx=400&key=${API_KEY}`;
  const [hasError, setHasError] = useState(false);

  return (
    <div className="border border-secondary w-50 rounded-2xl p-3 group">
      <div className="relative">
        {mainPhotoUrl && !hasError ? (
          <img
            className="rounded-2xl w-full h-32 object-cover"
            src={mainPhotoUrl}
            alt={name}
            onError={() => {
              setHasError(true);
            }}
          />
        ) : (
          <div className="w-full h-32 bg-secondary rounded-2xl flex items-center justify-center">
            <MdPhoto size={80} className="text-primary" />
          </div>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="bg-primary absolute top-0 left-0 p-1 rounded-br cursor-pointer opacity-0 group-hover:opacity-100 transition ease-in-out duration-300"
        >
          <IoTrashBinOutline
            className=" hover:opacity-70 transition ease-in-out duration-300"
            stroke="var(--color-secondary)"
            size={17}
          />
        </button>
      </div>
      <a
        target="_blank"
        href={websiteUri}
        className={twMerge(
          "mt-3 text-base text-secondary leading-5 h-11 line-clamp-2 transition ease-in-out duration-300",
          websiteUri && "hover:opacity-70"
        )}
      >
        {name}
      </a>
      <div className="text-sm mt-5 text-secondary/70 flex items-center justify-between">
        <Field
          type="text"
          className="focus:outline-0 w-1/2"
          name={locationFieldName}
        />
        <div>
          <span className="truncate">
            {getFormattedPrice(startPrice, endPrice, currencySymbol)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationWithPhotoCard;
