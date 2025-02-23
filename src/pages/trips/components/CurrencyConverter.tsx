import React, { useState } from "react";
import { useHotToast } from "../../../hooks/useHotToast";
import { Currency } from "../hooks/getters/useGetCurrencies";
import { SelectOption, SingleSelect } from "./Select";
import TripsInput from "./TripsInput";

interface CurrencyConverterProps {
  countriesVisiting: string[];
  userCurrency?: string;
  currencies: Currency[];
  error: Error | null;
  loading: boolean;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  countriesVisiting,
  userCurrency,
  currencies,
  error,
  loading,
}) => {
  const { notify } = useHotToast();

  // FIXME: Handle loading state
  if (loading) {
    return <>Loading...</>;
  }

  if (!userCurrency || error) {
    notify("Something went wrong. Please try again later.", "error");
    return;
  }

  const currencyOptions: SelectOption[] = countriesVisiting
    .map((country) => currencies.find((curr) => curr.country === country))
    .filter(Boolean)
    .map((currency) => ({
      id: currency!.currencyCode,
      name: currency!.currencyCode,
    }))
    .filter((curr) => curr.name !== userCurrency);

  currencyOptions.unshift({ id: userCurrency, name: userCurrency });

  return (
    <div className="space-y-2">
      <h1 className="text-md">Currency converter</h1>
      <div className="text-sm flex space-x-2">
        <CurrencyInput currencyOptions={currencyOptions} />
        <span>=</span>
        <CurrencyInput currencyOptions={currencyOptions} />
      </div>
    </div>
  );
};

interface CurrencyInputProps {
  currencyOptions: SelectOption[];
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ currencyOptions }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<SelectOption>(
    currencyOptions[0]
  );

  const handleCurrencyChange = (option: SelectOption) => {
    setSelectedCurrency(option);
  };

  return (
    <div>
      <TripsInput
        type="number"
        id="currency"
        className="rounded-r-none"
        onChange={() => null}
      />
      <SingleSelect
        currentlySelectedOption={selectedCurrency}
        onChange={handleCurrencyChange}
        options={currencyOptions}
        inputBoxClassname="border-l-0 rounded-l-none w-12"
        optionsBoxClassname="text-xs w-20"
      />
    </div>
  );
};

export default CurrencyConverter;
