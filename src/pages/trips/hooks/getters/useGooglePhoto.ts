import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const useGooglePhoto = (photoName: string) => {
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`,
          {
            params: {
              skipHttpRedirect: true,
            },
          }
        );

        setPhotoUrl(response.data.photoUri);
      } catch (error) {
        console.error("Error fetching image with Axios:", error);
        setError(true);
      }
    };

    if (photoName) fetchImage();

    // Cleanup URL to avoid memory leaks
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoName, photoUrl]);

  return { photoUrl, error };
};

export default useGooglePhoto;
