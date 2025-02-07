import React from "react";

interface InputProps {
  label: string;
  inputId: string;
}

export const InputText: React.FC<InputProps> = ({ label, inputId }) => {
  return (
    <div className="text-secondary text-xl tracking-wide font-brand italic lowercase">
      <label htmlFor={inputId}>{label}</label>
      <input
        type="text"
        id={inputId}
        className="w-full h-11 rounded-md border border-secondary pl-2 mt-2 focus:outline-blue-munsell"
      />
    </div>
  );
};
