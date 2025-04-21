import axios from "axios";
import { useEffect, useState } from "react";
import { SelectOption } from "../../components/Select";
import { sortBy } from "lodash";
import { Country } from "./useGetCurrencies";

export const useGetCountries = () => {
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://restfulcountries.com/api/v1/countries", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            import.meta.env.VITE_RESTFUL_COUNTRIES_API_KEY
          }`,
        },
      })
      .then((response) => {
        const sortedCountries = sortBy(
          response.data.data.map((country: Country) => ({
            id: country.iso3,
            name: country.name,
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
