import { cn } from "@/lib/utils";

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  htmlFor?: string;
  label: string;
  required?: boolean;
};

export function FormField({
  children,
  error,
  hint,
  htmlFor,
  label,
  required
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-medium text-dentova-navy-700"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-dentova-navy-500">{hint}</p>
      ) : null}
    </div>
  );
}

export const formInputClassName = (className?: string) =>
  cn(
    "dentova-focus w-full rounded-lg border border-dentova-navy-200 bg-white px-3.5 py-2.5 text-sm text-dentova-navy-900 outline-none transition-colors placeholder:text-dentova-navy-400 focus:border-dentova-teal-500 focus:ring-1 focus:ring-dentova-teal-500",
    className
  );
