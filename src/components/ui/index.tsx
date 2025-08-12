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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
    <div className="w-full min-w-[1200px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="py-6 sm:py-8 lg:py-10">
        {children}
      </div>
    </div>
  </div>
);

export const MotionCard: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = "" }) => (
    <motion.div 
        className={`bg-white rounded-xl shadow-lg border border-slate-200 w-full min-w-[1200px] ${className}`}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    >{children}</motion.div>
);

export const CardHeader: React.FC<{title: string; icon: React.ComponentType<{ className?: string }>}> = ({ title, icon: Icon }) => (
    <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow flex-shrink-0">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{title}</h1>
    </div>
);

export const TabNavigation: React.FC<{tabs: Tab[]; activeTab: string; onTabChange: (tab: string) => void;}> = ({ tabs, activeTab, onTabChange }) => (
    <div className="p-4 border-b border-slate-200">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
                <button key={tab.id} onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        activeTab === tab.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200"
                    }`}
                ><tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />{tab.label}</button>
            ))}
        </div>
    </div>
);

export const FormField: React.FC<{
  label: string; value: string; onChange: (value: string) => void;
  multiline?: boolean; rows?: number; placeholder?: string;
}> = ({ label, value, onChange, multiline = false, rows = 3, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        {multiline ? (
            <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none bg-slate-50 text-sm sm:text-base"/>
        ) : (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all outline-none bg-slate-50 text-sm sm:text-base"/>
        )}
    </div>
);

// --- COMPONENTES DE FORMULARIO MEJORADOS ---




export const Button: React.FC<{
  children: React.ReactNode; onClick?: () => void; loading?: boolean; type?: "button" | "submit" | "reset";
  className?: string; disabled?: boolean; icon?: React.ComponentType<{ className?: string }>;
}> = ({ children, onClick, loading = false, type = "button", className = "", disabled = false, icon: Icon }) => (
  <button type={type} onClick={onClick} disabled={disabled || loading}
    className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base ${className}`}
  >
    {loading ? <Save className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : (Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />)}
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
    <div className={`p-3 sm:p-4 mb-4 rounded-lg border text-sm flex items-start gap-2 sm:gap-3 ${styles[type]} ${className}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm sm:text-base">{children}</div>
    </div>
  );
};