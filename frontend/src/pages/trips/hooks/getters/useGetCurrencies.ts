import { useState, useEffect } from "react";
import axios from "axios";
import { sortBy } from "lodash";
import { currencyCodeToSymbol } from "../currencyCodeToSymbol";

export type Currency = {
  id: string;
  currencyCode: string;
  symbol: string;
  country: string;
};

export type Country = { iso3: string; name: string; currency: string };

export const useGetCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        console.log(response);

        const currencyData = sortBy(
          response.data.data
            .map((country: Country) => {
              if (!country.currency) return null;

              const currencyCode = country.currency.toUpperCase();
              const symbol = currencyCodeToSymbol(currencyCode);

              return {
                id: country.iso3,
                currencyCode,
                symbol,
                country: country.name,
              };
            })
            .filter(Boolean),
          "currencyCode"
        ) as Currency[];

        setCurrencies(currencyData);
      })
      .catch(() => {
        setError(new Error("Failed to fetch currencies."));
      })
      .finally(() => setLoading(false));
  }, []);

  return { currencies, loading, error };
};
