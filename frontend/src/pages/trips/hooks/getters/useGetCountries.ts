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
      .get("https://restcountries.com/v3.1/all?fields=name,currencies,cca3", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const sortedCountries = sortBy(
          response.data.map((country: Country) => ({
            id: country.cca3,
            name: country.name.common,
          })),
          "name"
        );
        setCountries(sortedCountries);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch countries.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
};
