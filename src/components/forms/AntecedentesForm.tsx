// Archivo: src/components/forms/AntecedentesForm.tsx

import React from 'react';
import { ClipboardList } from 'lucide-react';
import { FormField, Alert } from '../ui'; // Añadimos Alert

// --- Interfaz de Datos (sin cambios) ---
export interface AntecedentesData {
  personalesPatologicos: string;
  personalesNoPatologicos: string;
  familiares: string;
  ginecobstetricos: string;
  quirurgicos: string;
  alergias: string;
  medicamentos: string;
}

// --- Props (añadimos readOnly) ---
interface AntecedentesFormProps {
  data: AntecedentesData;
  onChange: (data: AntecedentesData) => void;
  readOnly: boolean; // <-- PROPIEDAD AÑADIDA
}

// --- Componente Refactorizado ---
const AntecedentesForm: React.FC<AntecedentesFormProps> = ({ data, onChange, readOnly }) => {

  const updateField = (field: keyof AntecedentesData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Usamos un fieldset para deshabilitar todo a la vez */}
      <fieldset disabled={readOnly} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Antecedentes Médicos
        </h3>

        {/* Mensaje que aparece si el formulario está deshabilitado */}
        {readOnly && (
            <Alert type="info">
                Primero debe guardar los datos de un paciente para poder registrar sus antecedentes.
            </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            label="Antecedentes Personales Patológicos"
            value={data.personalesPatologicos}
            onChange={(value) => updateField('personalesPatologicos', value)}
            multiline rows={5}
          />
          <FormField
            label="Antecedentes Personales No Patológicos"
            value={data.personalesNoPatologicos}
            onChange={(value) => updateField('personalesNoPatologicos', value)}
            multiline rows={5}
          />
          <FormField
            label="Antecedentes Familiares"
            value={data.familiares}
            onChange={(value) => updateField('familiares', value)}
            multiline rows={5}
          />
          <FormField
            label="Antecedentes Gineco-obstétricos"
            value={data.ginecobstetricos}
            onChange={(value) => updateField('ginecobstetricos', value)}
            multiline rows={5}
          />
          <FormField
            label="Antecedentes Quirúrgicos"
            value={data.quirurgicos}
            onChange={(value) => updateField('quirurgicos', value)}
            multiline rows={5}
          />
          <FormField
            label="Alergias y Reacciones Adversas"
            value={data.alergias}
            onChange={(value) => updateField('alergias', value)}
            multiline rows={5}
          />
          <div className="lg:col-span-2">
            <FormField
              label="Medicamentos Actuales"
              value={data.medicamentos}
              onChange={(value) => updateField('medicamentos', value)}
              multiline rows={4}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default AntecedentesForm;