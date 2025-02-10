import React, { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

export type MultiSelectOption = {
  id: string | number;
  name: string;
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  onChange: () => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, onChange }) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((opt) => {
          return opt.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox onChange={onChange} onClose={() => setQuery("")}>
      <ComboboxInput
        // displayValue={(option) => person?.name}
        onChange={(event) => setQuery(event.target.value)}
        className="border border-secondary rounded-xl px-2 py"
      />
      <ComboboxOptions
        anchor="bottom"
        className="bg-primary border border-secondary"
      >
        {filteredOptions.map((opt) => (
          <ComboboxOption key={opt.id} value={opt}>
            {opt.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};

export default MultiSelect;
