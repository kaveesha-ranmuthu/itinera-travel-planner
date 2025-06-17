import { Marker } from "react-map-gl/mapbox";
import { twMerge } from "tailwind-merge";
import { PhotoCard } from "./components/LocationWithPhotoCard";
import SimpleTooltip from "./components/SimpleTooltip";
import { LocationDetails } from "./types";

export const compressAndConvertToBase64 = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) return reject("Failed to load image");
      img.src = event.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // ✅ Resize while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context failed");

      ctx.drawImage(img, 0, 0, width, height);

      // ✅ Convert to Base64 (JPEG with 70% quality)
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = (error) => reject(error);
  });
};

export const getMapMarker = (
  location: LocationDetails,
  markerColour: string,
  iconColour: string,
  icon: React.ReactNode
) => {
  if (!location.location.latitude || !location.location.longitude) return;

  const popupContent = (
    <div className="max-w-50 rounded-3xl py-1">
      <PhotoCard
        className="rounded-lg mb-3"
        mainPhotoUrl={location.photoUrl ?? ""}
        altText={location.name}
        showPlaceholder={false}
      />
      <div className="px-1">
        <p className="text-sm leading-4 mb-0.5">{location.name}</p>
        <p className="opacity-70">{location.formattedAddress}</p>
      </div>
    </div>
  );

  return (
    <Marker
      longitude={location.location.longitude}
      latitude={location.location.latitude}
    >
      <SimpleTooltip content={popupContent}>
        <div
          className={twMerge(
            markerColour,
            iconColour,
            "p-2 rounded-full border border-secondary/30"
          )}
        >
          {icon}
        </div>
      </SimpleTooltip>
    </Marker>
  );
};
