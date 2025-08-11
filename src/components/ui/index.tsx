import React from 'react';
import { motion } from 'framer-motion';
import { 
  Save, AlertCircle, CheckCircle, AlertTriangle as AlertTriangleIcon, Info, User, 
  ClipboardList, AlertTriangle, Activity, Heart, Weight, Thermometer, BarChart, 
  Stethoscope, Brain, Pill, TestTube 
} from 'lucide-react';

// --- Interfaces y Tipos ---
export interface Tab { id: string; label: string; icon: React.ComponentType<{ className?: string }>; }
export interface SignosVitales { /* ... */ }

// --- Componentes de UI Exportados ---

export const PageContainer: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">{children}</div>
);

export const MotionCard: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = "" }) => (
    <motion.div 
        className={`bg-white rounded-xl shadow-lg border border-slate-200 ${className}`}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    >{children}</motion.div>
);

export const CardHeader: React.FC<{title: string; icon: React.ComponentType<{ className?: string }>}> = ({ title, icon: Icon }) => (
    <div className="p-6 border-b border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow"><Icon className="w-6 h-6 text-white" /></div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
    </div>
);

export const TabNavigation: React.FC<{tabs: Tab[]; activeTab: string; onTabChange: (tab: string) => void;}> = ({ tabs, activeTab, onTabChange }) => (
    <div className="p-4 border-b border-slate-200">
        <div className="flex flex-wrap gap-2">{tabs.map((tab) => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200"
                }`}
            ><tab.icon className="w-4 h-4" />{tab.label}</button>
        ))}</div>
    </div>
);

export const FormField: React.FC<{
  label: string; value: string; onChange: (value: string) => void;
  multiline?: boolean; rows?: number; placeholder?: string;
}> = ({ label, value, onChange, multiline = false, rows = 3, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        {multiline ? (
            <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none bg-slate-50"/>
        ) : (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none bg-slate-50"/>
        )}
    </div>
);

// --- COMPONENTES DE FORMULARIO MEJORADOS ---

interface InputFieldProps {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean; readOnly?: boolean; className?: string;
  icon?: React.ComponentType<{ className?: string }>; iconClassName?: string;
  helpText?: string; // <-- Prop para la sugerencia
}
export const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = "text", placeholder = "", required = false, readOnly = false, className = "", icon: Icon, iconClassName = "", helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      {Icon && <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconClassName || 'text-slate-400'}`} />}
      <input
        id={name} type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} readOnly={readOnly}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none bg-slate-50 text-slate-800 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
    </div>
    {helpText && <p className="text-xs text-slate-500 mt-1 px-1">{helpText}</p>}
  </div>
);

interface SelectFieldProps {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string; required?: boolean; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode;
}
export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, placeholder = "", required = false, icon: Icon, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <select id={name} name={name} value={value} onChange={onChange} required={required}
        className={`w-full appearance-none ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none bg-slate-50 text-slate-800`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

interface CheckboxFieldProps {
  name: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string; // <-- Prop para la descripción
}
export const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label, checked, onChange, description }) => (
  <div className="flex items-start gap-3">
    <input id={name} type="checkbox" name={name} checked={checked} onChange={onChange}
      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
    />
    <div>
      <label htmlFor={name} className="font-medium text-slate-700 cursor-pointer">{label}</label>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode; onClick?: () => void; loading?: boolean; type?: "button" | "submit" | "reset";
  className?: string; disabled?: boolean; icon?: React.ComponentType<{ className?: string }>;
}> = ({ children, onClick, loading = false, type = "button", className = "", disabled = false, icon: Icon }) => (
  <button type={type} onClick={onClick} disabled={disabled || loading}
    className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <Save className="w-5 h-5 animate-spin" /> : (Icon && <Icon className="w-5 h-5" />)}
    {loading ? "Procesando..." : children}
  </button>
);

export const Alert: React.FC<{
  type: 'error' | 'success' | 'warning' | 'info'; children: React.ReactNode; className?: string;
}> = ({ type, children, className = "" }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const Icon = { error: AlertCircle, success: CheckCircle, warning: AlertTriangleIcon, info: Info }[type];
  
  return (
    <div className={`p-4 mb-4 rounded-lg border text-sm flex items-start gap-3 ${styles[type]} ${className}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
};