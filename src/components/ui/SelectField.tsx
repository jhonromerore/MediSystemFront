import React from "react";
import { useFormContext } from "react-hook-form";

function get(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  containerClassName?: string;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  icon: Icon,
  containerClassName,
  className,
  children,
  placeholder,
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();
  const fieldErr = get(errors, name) as { message?: string } | undefined;
  const hasError = !!fieldErr?.message;

  return (
    <div className={containerClassName ?? "mb-4"}>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
        <select
          id={name}
          aria-invalid={hasError || undefined}
          {...register(name)}
          {...props}
          className={[
            "w-full appearance-none pr-10 py-3 border-2 rounded-lg focus:ring-1 transition-all outline-none bg-slate-50 text-slate-800",
            Icon ? "pl-10" : "pl-4",
            hasError ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-200",
            className ?? ""
          ].join(" ")}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      {hasError && <p className="text-sm text-red-600 mt-1 px-1">{fieldErr?.message}</p>}
    </div>
  );
};

export default SelectField;
