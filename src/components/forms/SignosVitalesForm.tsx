// Archivo: src/components/forms/SignosVitalesForm.tsx

import React, { useEffect } from 'react';
import { Activity, Save, Thermometer, Heart, Droplets, Gauge, Weight, Ruler, Calculator } from 'lucide-react';
import { InputField, Button, Alert } from '../ui';

// --- Tipos de Datos ---
export interface SignosVitalesData {
  temperatura: string; presionSistolica: string; presionDiastolica: string;
  frecuenciaCardiaca: string; frecuenciaRespiratoria: string; saturacionOxigeno: string;
  peso: string; talla: string; imc: string;
}

interface SignosVitalesFormProps {
  data: SignosVitalesData;
  onChange: (field: keyof SignosVitalesData, value: string) => void;
  onSave: () => void;
  isLoading: boolean;
  readOnly: boolean;
}

// --- Configuración de los campos con sus iconos Y COLORES ---
const vitalSignsConfig = [
  { key: 'temperatura' as const, label: 'Temperatura', unit: '°C', icon: Thermometer, placeholder: '36.5', color: 'text-orange-500' },
  { key: 'frecuenciaCardiaca' as const, label: 'Frec. Cardíaca', unit: 'lpm', icon: Heart, placeholder: '75', color: 'text-red-500' },
  { key: 'frecuenciaRespiratoria' as const, label: 'Frec. Respiratoria', unit: 'rpm', icon: Droplets, placeholder: '16', color: 'text-cyan-500' },
  { key: 'presionSistolica' as const, label: 'P. Sistólica', unit: 'mmHg', icon: Activity, placeholder: '120', color: 'text-blue-500' },
  { key: 'presionDiastolica' as const, label: 'P. Diastólica', unit: 'mmHg', icon: Activity, placeholder: '80', color: 'text-blue-600' },
  { key: 'saturacionOxigeno' as const, label: 'Sat. Oxígeno', unit: '%', icon: Gauge, placeholder: '98', color: 'text-green-500' },
  { key: 'peso' as const, label: 'Peso', unit: 'kg', icon: Weight, placeholder: '70.5', color: 'text-purple-500' },
  { key: 'talla' as const, label: 'Talla', unit: 'cm', icon: Ruler, placeholder: '175', color: 'text-indigo-500' },
];

// --- Componente ---
const SignosVitalesForm: React.FC<SignosVitalesFormProps> = ({ data, onChange, onSave, isLoading, readOnly }) => {
  
  useEffect(() => {
    const pesoNum = parseFloat(data.peso);
    const tallaNum = parseFloat(data.talla);
    if (!isNaN(pesoNum) && !isNaN(tallaNum) && tallaNum > 0) {
      const tallaMts = tallaNum / 100;
      const imcCalculado = (pesoNum / (tallaMts * tallaMts)).toFixed(1);
      if (imcCalculado !== data.imc) onChange('imc', imcCalculado);
    } else if (data.imc !== '') {
      onChange('imc', '');
    }
  }, [data.peso, data.talla, data.imc, onChange]);

  return (
    <div className="p-6">
      <fieldset disabled={readOnly || isLoading} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          Signos Vitales y Antropometría
        </h3>
        
        {readOnly && (<Alert type="info">Primero debe guardar los datos de un paciente para poder registrar sus signos vitales.</Alert>)}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vitalSignsConfig.map(config => (
            <InputField
              key={config.key}
              label={`${config.label} (${config.unit})`}
              name={config.key}
              value={data[config.key]}
              onChange={(e) => onChange(config.key, e.target.value)}
              placeholder={config.placeholder}
              icon={config.icon}
              iconClassName={config.color} // <-- AQUÍ PASAMOS EL COLOR
              type="number"
            />
          ))}
          
          <InputField
            label="IMC (kg/m²)"
            name="imc"
            value={data.imc}
            onChange={() => {}}
            readOnly
            placeholder="Calculado"
            icon={Calculator}
            iconClassName="text-blue-700" // <-- Color personalizado también
            className="bg-slate-200 cursor-not-allowed border-slate-300"
          />
        </div>

        {!readOnly && (
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button onClick={onSave} loading={isLoading} icon={Save} className="px-8 py-3">
              Guardar Signos Vitales
            </Button>
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default SignosVitalesForm;