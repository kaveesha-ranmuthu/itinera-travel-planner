import axios from "axios";
import { useEffect, useState } from "react";

export const useGetLatLng = (destinationCountry: string) => {
  const [latLng, setLatLng] = useState<number[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(
        `https://restcountries.com/v3.1/name/${destinationCountry}?fields=latlng`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data[0].latlng;
        setLatLng(data);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch lat and long.");
        setLatLng(undefined);
      })
      .finally(() => setLoading(false));
  }, [destinationCountry]);

  return { latLng, loading, error };
};
