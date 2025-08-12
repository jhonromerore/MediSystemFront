import React from "react";
import { useFormContext } from "react-hook-form";

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label, description, className, ...props }) => {
  const { register } = useFormContext();

  return (
    <div className="flex items-start gap-3">
      <input
        id={name}
        type="checkbox"
        {...register(name)}
        {...props}
        className={[
          "w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-1 flex-shrink-0",
          className ?? ""
        ].join(" ")}
      />
      <div>
        <label htmlFor={name} className="font-medium text-slate-700 cursor-pointer">{label}</label>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
    </div>
  );
};

export default CheckboxField;
