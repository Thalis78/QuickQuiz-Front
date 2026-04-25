import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="w-full">
    <label className="block text-white font-semibold mb-3 text-lg">
      {label}
    </label>
    {children}
  </div>
);


export const FormInput = ({ label, ...props }: InputProps) => (
  <FormField label={label}>
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${props.className}`}
    />
  </FormField>
);

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  activeColor?: string;
}

export const FormToggle = ({
  label,
  checked,
  onChange,
  activeColor = "bg-purple-500",
}: ToggleProps) => (
  <div className="flex items-center gap-3">
    <span className="text-white font-medium">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
        checked ? activeColor : "bg-gray-400"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
          checked ? "translate-x-7" : ""
        }`}
      />
    </button>
  </div>
);
