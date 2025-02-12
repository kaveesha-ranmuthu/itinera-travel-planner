import { useState, useEffect } from "react";
import axios from "axios";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { SelectOption } from "../../components/Select";

export const useGetCurrencies = () => {
  const [currencies, setCurrencies] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const currencyData = sortBy(
          response.data
            .map(
              (country: {
                currencies: { [key: string]: { symbol: string } };
              }) => {
                if (
                  !country.currencies ||
                  Object.keys(country.currencies).length === 0
                )
                  return null;

                const currencyCode = Object.keys(country.currencies)[0];
                const symbol = country.currencies[currencyCode]?.symbol || "";

                return {
                  id: currencyCode,
                  name: currencyCode,
                  otherInfo: { symbol },
                };
              }
            )
            .filter(Boolean), // Remove null values
          "name"
        );

        setCurrencies(uniqBy(currencyData, "id"));
      })
      .catch(() => {
        setError("Failed to fetch currencies.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { currencies, loading, error };
};
