import React from "react";
import { useHotToast } from "../../../hooks/useHotToast";
import { SelectOption, SingleSelect } from "./Select";
import TripsInput from "./TripsInput";
import { useAuth } from "../../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import { round } from "lodash";
import { convertCurrency } from "./sections/helpers";

interface CurrencyConverterProps {
  userCurrency?: string;
  error: Error | null;
  baseAmount: number;
  otherAmount: number;
  selectedCurrencyCode: SelectOption;
  onBaseAmountChange: (amount: number) => void;
  onOtherAmountChange: (amount: number) => void;
  onCurrencyCodeChange: (currency: SelectOption) => void;
  currencyOptions: SelectOption[];
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  userCurrency,
  error,
  baseAmount,
  onBaseAmountChange,
  otherAmount,
  onOtherAmountChange,
  selectedCurrencyCode,
  onCurrencyCodeChange,
  currencyOptions,
}) => {
  const { notify } = useHotToast();
  const { settings } = useAuth();

  if (!userCurrency || error) {
    notify("Something went wrong. Please try again later.", "error");
    return;
  }

  const handleCurrencyCodeChange = (currency: SelectOption) => {
    onCurrencyCodeChange(currency);
    handleBaseAmountChange(baseAmount, currency.name);
  };

  const handleBaseAmountChange = async (
    amount: number,
    currencyCode?: string
  ) => {
    try {
      const convertedAmount = await convertCurrency(
        userCurrency,
        currencyCode ?? selectedCurrencyCode.name,
        amount
      );

      onOtherAmountChange(round(convertedAmount, 2));
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  const handleOtherAmountChange = async (amount: number) => {
    try {
      const convertedAmount = await convertCurrency(
        selectedCurrencyCode.name,
        userCurrency,
        amount
      );

      onBaseAmountChange(round(convertedAmount, 2));
    } catch {
      notify("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className={twMerge("space-y-3 text-secondary", settings?.font)}>
      <h1 className="text-lg">Currency converter</h1>
      <div className="text-sm flex space-x-2">
        <CurrencyInput
          selectedCurrency={{
            id: userCurrency,
            name: userCurrency,
          }}
          disabled={true}
          defaultValue={baseAmount}
          onInputChange={(amount) => {
            handleBaseAmountChange(amount);
            onBaseAmountChange(amount);
          }}
        />
        <span>=</span>
        <CurrencyInput
          currencyOptions={currencyOptions}
          selectedCurrency={selectedCurrencyCode}
          onSelectChange={handleCurrencyCodeChange}
          defaultValue={otherAmount}
          onInputChange={(amount) => {
            handleOtherAmountChange(amount);
            onOtherAmountChange(amount);
          }}
        />
      </div>
      <p className="text-xs">
        * currency has been rounded to two decimal places
      </p>
    </div>
  );
};

interface CurrencyInputProps {
  selectedCurrency: SelectOption;
  onSelectChange?: (currency: SelectOption) => void;
  onInputChange: (amount: number) => void;
  disabled?: boolean;
  currencyOptions?: SelectOption[];
  defaultValue?: number;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  currencyOptions = [],
  selectedCurrency,
  onSelectChange,
  onInputChange,
  disabled,
  defaultValue,
}) => {
  return (
    <div>
      <TripsInput
        type="number"
        id="currency"
        className="rounded-r-none"
        onChange={(e) => onInputChange(parseFloat(e.target.value))}
        value={defaultValue}
      />
      <SingleSelect
        currentlySelectedOption={selectedCurrency}
        onChange={onSelectChange}
        options={currencyOptions}
        inputBoxClassname="border-l-0 rounded-l-none w-12 cursor-pointer disabled:cursor-default"
        optionsBoxClassname="text-xs w-20"
        disabled={disabled}
      />
    </div>
  );
};

export default CurrencyConverter;
