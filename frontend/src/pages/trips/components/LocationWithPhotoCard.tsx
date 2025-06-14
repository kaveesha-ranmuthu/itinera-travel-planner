import { Field } from "formik";
import React, { useState } from "react";
import { PiTrashSimple } from "react-icons/pi";
import { MdPhoto } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { LocationDetails } from "../types";

interface LocationItemProps {
  location: LocationDetails;
  currencySymbol?: string;
  onDelete?: () => void;
  locationFieldName: string;
  priceFieldName: string;
}

export const LocationWithPhotoCard: React.FC<LocationItemProps> = ({
  location,
  currencySymbol,
  onDelete,
  locationFieldName,
  priceFieldName,
}) => {
  const { photoUrl, name, websiteUri } = location;

  return (
    <div className="border border-secondary w-50 rounded-2xl p-3 group">
      <div className="relative">
        <PhotoCard mainPhotoUrl={photoUrl ?? ""} altText={name} />
        <button
          type="button"
          onClick={onDelete}
          className="bg-primary absolute top-0 left-0 p-1 rounded-br cursor-pointer opacity-0 group-hover:opacity-100 transition ease-in-out duration-300"
        >
          <PiTrashSimple
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
  mainPhotoUrl: string;
  altText: string;
  className?: string;
  showPlaceholder?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  mainPhotoUrl,
  altText,
  className,
  showPlaceholder = true,
}) => {
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

export const LocationListItem: React.FC<LocationItemProps> = ({
  location,
  locationFieldName,
  currencySymbol,
  priceFieldName,
  onDelete,
}) => {
  const { name, websiteUri } = location;

  return (
    <div className="flex pb-4 border-b border-secondary/20 justify-between text-secondary">
      <a
        target="_blank"
        href={websiteUri}
        className={twMerge(
          "text-secondary truncate transition ease-in-out duration-300 peer",
          websiteUri && "hover:opacity-70"
        )}
      >
        {name}
      </a>
      <div className="flex items-center space-x-4 peer-hover:opacity-70 transition ease-in-out duration-300">
        <Field
          type="text"
          className="focus:outline-0"
          name={locationFieldName}
        />
        <div className="flex items-center justify-start">
          <span>{currencySymbol}</span>
          <Field
            type="number"
            className="focus:outline-0"
            name={priceFieldName}
          />
        </div>
        <button type="button" onClick={onDelete}>
          <PiTrashSimple
            className="mt-1 cursor-pointer hover:opacity-70 transition ease-in-out duration-300"
            stroke="var(--color-secondary)"
            size={17}
          />
        </button>
      </div>
    </div>
  );
};
