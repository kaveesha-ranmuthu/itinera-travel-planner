import { useState, useEffect } from "react";
import axios from "axios";
import uniqBy from "lodash/uniqBy";
import { sortBy } from "lodash";

export type Currency = {
  id: string;
  currencyCode: string;
  symbol: string;
  country: string;
};

export const useGetCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const currencyData = sortBy(
          response.data
            .map(
              (country: {
                currencies: {
                  [key: string]: { symbol: string };
                };
                name: { common: string };
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
                  currencyCode,
                  symbol,
                  country: country.name.common,
                };
              }
            )
            .filter(Boolean),
          "currencyCode"
        ) as Currency[];

        const uniqueCurrencies = uniqBy(currencyData, "id");
        setCurrencies(uniqueCurrencies);
      })
      .catch(() => {
        setError(new Error("Failed to fetch currencies."));
      })
      .finally(() => setLoading(false));
  }, []);

  return { currencies, loading, error };
};
