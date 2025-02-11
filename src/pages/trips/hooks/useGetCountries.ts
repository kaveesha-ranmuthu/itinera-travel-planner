import axios from "axios";
import { useEffect, useState } from "react";
import { SelectOption } from "../components/Select";
import { sortBy } from "lodash";

export const useGetCountries = () => {
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const sortedCountries = sortBy(
          response.data.map((country: { name: { common: string } }) => ({
            id: country.name.common,
            name: country.name.common,
          })),
          "name"
        );
        setCountries(sortedCountries);
      })
      .catch(() => {
        setError("Failed to fetch countries.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
};
