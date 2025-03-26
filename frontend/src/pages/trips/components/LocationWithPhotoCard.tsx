import { Field } from "formik";
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
  averagePrice?: number;
  mainPhotoName: string;
  createdAt: string;
  websiteUri?: string;
  formattedAddress: string;
}

interface LocationWithPhotoCardProps {
  location: LocationCardDetails;
  currencySymbol?: string;
  onDelete?: () => void;
  locationFieldName: string;
  priceFieldName: string;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationWithPhotoCard: React.FC<LocationWithPhotoCardProps> = ({
  location,
  currencySymbol,
  onDelete,
  locationFieldName,
  priceFieldName,
}) => {
  const { mainPhotoName, name, websiteUri } = location;

  return (
    <div className="border border-secondary w-50 rounded-2xl p-3 group">
      <div className="relative">
        <PhotoCard photoName={mainPhotoName} altText={name} />
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
        <div className="w-1/2 flex items-center justify-start">
          <span>{currencySymbol}</span>
          <Field
            type="number"
            className="focus:outline-0 w-full"
            name={priceFieldName}
          />
        </div>
        <Field
          type="text"
          className="focus:outline-0 w-1/2 text-right"
          name={locationFieldName}
        />
      </div>
    </div>
  );
};

interface PhotoCardProps {
  photoName: string;
  altText: string;
  className?: string;
  showPlaceholder?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photoName,
  altText,
  className,
  showPlaceholder = true,
}) => {
  const mainPhotoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`;
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {mainPhotoUrl && !hasError ? (
        <img
          className={twMerge("rounded-2xl w-full h-32 object-cover", className)}
          src={mainPhotoUrl}
          alt={altText}
          onError={() => {
            setHasError(true);
          }}
        />
      ) : showPlaceholder ? (
        <div className="w-full h-32 bg-secondary rounded-2xl flex items-center justify-center">
          <MdPhoto size={80} className="text-primary" />
        </div>
      ) : null}
    </>
  );
};

export default LocationWithPhotoCard;
