import React from "react";

import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  id?: string;
  name?: string;
  required?: boolean;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  defaultValue,
  id,
  name,
  required = false,
  error,
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full items-start gap-1">
        <Label
          htmlFor={inputId}
          className="text-foreground text-sm leading-[14px] font-medium"
        >
          {label}
        </Label>
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          name={name}
          required={required}
          className={`flex h-10 w-full items-center gap-1 rounded-md border px-3 py-2 ${
            error ? "border-red-500" : "border-border"
          } focus:ring-primary focus:border-primary bg-white text-sm focus:ring-2 focus:outline-none`}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
