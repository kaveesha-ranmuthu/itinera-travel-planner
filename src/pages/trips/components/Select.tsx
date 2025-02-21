import React, { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCheckmarkCircle,
} from "react-icons/io";
import { useAuth } from "../../../hooks/useAuth";
import { FontFamily } from "../../../types";

export type SelectOption = {
  id: string | number;
  name: string;
  otherInfo?: { [x in string]: string };
};

interface SelectProps {
  options: SelectOption[];
}

interface MultiSelectProps extends SelectProps {
  currentlySelectedOptions: SelectOption[];
  onChange: (item: SelectOption[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  currentlySelectedOptions,
}) => {
  const [query, setQuery] = useState("");
  const { settings } = useAuth();

  const filteredOptions =
    query === ""
      ? options.filter(
          (opt) =>
            !currentlySelectedOptions.some((current) => current.id === opt.id)
        )
      : options.filter((opt) => {
          return (
            opt.name.toLowerCase().includes(query.toLowerCase()) &&
            !currentlySelectedOptions.some((current) => current.id === opt.id)
          );
        });

  return (
    <Combobox
      onChange={(items: SelectOption[]) => onChange(items)}
      onClose={() => setQuery("")}
      defaultValue={currentlySelectedOptions}
      immediate
      multiple
    >
      <ComboboxInput
        placeholder={currentlySelectedOptions.map((opt) => opt.name).join(", ")}
        onChange={(event) => setQuery(event.target.value)}
        className="border border-secondary rounded-xl px-2 py-1 w-full placeholder:text-secondary focus:placeholder:text-secondary/50"
      />
      {(!!filteredOptions.length || !!currentlySelectedOptions.length) && (
        <ComboboxOptions
          anchor="bottom start"
          className="bg-primary border border-secondary w-3xs rounded-lg mt-1"
        >
          {currentlySelectedOptions.map((opt) => {
            return (
              <ComboboxOption
                key={opt.id}
                value={opt}
                className="space-x-2 flex items-center cursor-pointer px-2 py-3 hover:bg-secondary/5 hover:transition hover:ease-in-out hover:duration-400"
              >
                <IoIosCheckmarkCircle size={17} />
                <p
                  className={
                    settings?.font === FontFamily.HANDWRITTEN ? "mb-1" : ""
                  }
                >
                  {opt.name}
                </p>
              </ComboboxOption>
            );
          })}
          {filteredOptions.slice(0, 5).map((opt) => (
            <ComboboxOption
              key={opt.id}
              value={opt}
              className="space-x-2 flex items-center cursor-pointer px-2 py-3 hover:bg-secondary/5 hover:transition hover:ease-in-out hover:duration-400"
            >
              <IoIosCheckmarkCircleOutline size={17} />
              <p
                className={
                  settings?.font === FontFamily.HANDWRITTEN ? "mb-1" : ""
                }
              >
                {opt.name}
              </p>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      )}
    </Combobox>
  );
};

interface SingleSelectProps extends SelectProps {
  currentlySelectedOption: SelectOption | null;
  onChange: (item: SelectOption) => void;
}

export const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  onChange,
  currentlySelectedOption,
}) => {
  const [query, setQuery] = useState("");
  const { settings } = useAuth();

  const filteredOptions =
    query === ""
      ? options.filter((opt) => opt.id !== currentlySelectedOption?.id)
      : options.filter((opt) => {
          return (
            opt.name.toLowerCase().includes(query.toLowerCase()) &&
            opt.id !== currentlySelectedOption?.id
          );
        });

  return (
    <Combobox
      onChange={(item: SelectOption) => onChange(item)}
      onClose={() => setQuery("")}
      immediate
    >
      <ComboboxInput
        placeholder={currentlySelectedOption?.name}
        onChange={(event) => setQuery(event.target.value)}
        className="border border-secondary rounded-xl px-2 py-1 w-full placeholder:text-secondary focus:placeholder:text-secondary/50"
      />
      {(!!filteredOptions.length || !!currentlySelectedOption) && (
        <ComboboxOptions
          anchor="bottom start"
          className="bg-primary border border-secondary w-3xs rounded-lg mt-1"
        >
          {!!currentlySelectedOption && (
            <ComboboxOption
              value={currentlySelectedOption}
              className="space-x-2 flex items-center cursor-pointer px-2 py-3 hover:bg-secondary/5 hover:transition hover:ease-in-out hover:duration-400"
            >
              <IoIosCheckmarkCircle size={17} />
              <p
                className={
                  settings?.font === FontFamily.HANDWRITTEN ? "mb-1" : ""
                }
              >
                {currentlySelectedOption.name}
              </p>
            </ComboboxOption>
          )}
          {filteredOptions.slice(0, 5).map((opt) => (
            <ComboboxOption
              key={opt.id}
              value={opt}
              className="space-x-2 flex items-center cursor-pointer px-2 py-3 hover:bg-secondary/5 hover:transition hover:ease-in-out hover:duration-400"
            >
              <IoIosCheckmarkCircleOutline size={17} />
              <p
                className={
                  settings?.font === FontFamily.HANDWRITTEN ? "mb-1" : ""
                }
              >
                {opt.name}
              </p>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      )}
    </Combobox>
  );
};

export default MultiSelect;
