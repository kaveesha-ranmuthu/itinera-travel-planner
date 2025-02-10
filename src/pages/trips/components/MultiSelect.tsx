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

export type MultiSelectOption = {
  id: string | number;
  name: string;
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  currentlySelectedOptions: MultiSelectOption[];
  onChange: (item: MultiSelectOption[]) => void;
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
      onChange={(item: MultiSelectOption[]) => onChange(item)}
      onClose={() => setQuery("")}
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

export default MultiSelect;
