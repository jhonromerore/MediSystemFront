// Archivo: src/components/forms/TratamientoForm.tsx

import React from 'react';
import { Pill } from 'lucide-react';
import { FormField, Alert } from '../ui';

// --- Tipos de Datos ---
export interface TratamientoData {
  medicamentos: string;
  indicaciones: string;
  recomendaciones: string;
  proximaCita: string;
}

// --- Props del Componente ---
interface TratamientoFormProps {
  data: TratamientoData;
  onChange: (data: TratamientoData) => void;
  readOnly: boolean;
}

// --- El Componente del Formulario ---
const TratamientoForm: React.FC<TratamientoFormProps> = ({ data, onChange, readOnly }) => {

  const updateField = (field: keyof TratamientoData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="p-6 md:p-8">
      <fieldset disabled={readOnly} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Pill className="w-6 h-6 text-green-600" />
          Plan de Tratamiento
        </h3>

        {readOnly && (
          <Alert type="info">
            Primero debe guardar los datos de un paciente para poder registrar el plan de tratamiento.
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FormField
            label="Tratamiento Farmacológico (Prescripción)"
            value={data.medicamentos}
            onChange={(value) => updateField('medicamentos', value)}
            multiline
            rows={6}
            placeholder="Ej: Losartán 50mg VO c/24h #30 tabletas..."
          />
          <FormField
            label="Indicaciones Médicas"
            value={data.indicaciones}
            onChange={(value) => updateField('indicaciones', value)}
            multiline
            rows={6}
            placeholder="Ej: Reposo relativo, dieta blanda, aplicar calor local..."
          />
          <FormField
            label="Recomendaciones y Educación"
            value={data.recomendaciones}
            onChange={(value) => updateField('recomendaciones', value)}
            multiline
            rows={6}
            placeholder="Ej: Mantener hidratación, evitar automedicación, signos de alarma..."
          />
          <FormField
            label="Plan de Seguimiento y Próxima Cita"
            value={data.proximaCita}
            onChange={(value) => updateField('proximaCita', value)}
            multiline
            rows={6}
            placeholder="Ej: Control en 7 días para reevaluación, laboratorios de control en 2 semanas..."
          />
        </div>
      </fieldset>
    </div>
  );
};

export default TratamientoForm;