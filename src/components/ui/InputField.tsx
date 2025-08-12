import React from "react";
import { useFormContext } from "react-hook-form";

function get(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string; // ruta dot: "nombres", "exploracionGeneral.aspectoGeneral"
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  helpText?: string;
  containerClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  icon: Icon,
  iconClassName = "",
  helpText,
  containerClassName,
  className,
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();
  const fieldErr = get(errors, name) as { message?: string } | undefined;
  const hasError = !!fieldErr?.message;
  const describedBy = hasError ? `${name}-error` : helpText ? `${name}-hint` : undefined;

  return (
    <div className={containerClassName ?? "mb-4"}>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconClassName || "text-slate-400"}`} />
        )}
        <input
          id={name}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          {...register(name)}
          {...props}
          className={[
            "w-full pr-4 py-3 border-2 rounded-lg focus:ring-1 transition-all outline-none bg-slate-50 text-slate-800 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed",
            Icon ? "pl-10" : "pl-4",
            hasError ? "border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-200",
            className ?? ""
          ].join(" ")}
        />
      </div>
      {!hasError && helpText && (
        <p id={`${name}-hint`} className="text-xs text-slate-500 mt-1 px-1">{helpText}</p>
      )}
      {hasError && (
        <p id={`${name}-error`} className="text-sm text-red-600 mt-1 px-1">{fieldErr?.message}</p>
      )}
    </div>
  );
};

export default InputField;
