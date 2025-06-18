import { useState, useEffect } from "react";
import axios from "axios";
import { sortBy } from "lodash";

export type Currency = {
  id: string;
  currencyCode: string;
  symbol: string;
  country: string;
};

export type Country = {
  cca3: string;
  name: {
    common: string;
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
};

export const useGetCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,currencies,cca3", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const currencyData = sortBy(
          response.data
            .map((country: Country) => {
              if (
                !country.currencies ||
                !Object.keys(country.currencies).length
              )
                return null;

              const firstKey = Object.keys(country.currencies)[0];
              const currencyCode =
                country.currencies[firstKey].name.toUpperCase();
              const symbol = country.currencies[firstKey].symbol;

              return {
                id: country.cca3,
                currencyCode,
                symbol,
                country: country.name.common,
              };
            })
            .filter(Boolean),
          "currencyCode"
        ) as Currency[];

        setCurrencies(currencyData);
      })
      .catch((error) => {
        console.error(error);
        setError(new Error("Failed to fetch currencies."));
      })
      .finally(() => setLoading(false));
  }, []);

  return { currencies, loading, error };
};
