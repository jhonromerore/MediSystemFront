// Archivo: src/components/forms/PadecimientoActualForm.tsx

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { FormField, Alert } from '../ui';

// Tipos de Datos para este formulario
export interface PadecimientoActualData {
  motivoConsulta: string;
  inicioSintomas: string;
  evolucion: string;
  sintomasAsociados: string;
  tratamientoPrevio: string;
}

// Props que el componente recibirá
interface PadecimientoActualFormProps {
  data: PadecimientoActualData;
  onChange: (data: PadecimientoActualData) => void;
  readOnly: boolean;
}

// El Componente del Formulario
const PadecimientoActualForm: React.FC<PadecimientoActualFormProps> = ({ data, onChange, readOnly }) => {

  const updateField = (field: keyof PadecimientoActualData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="p-6 md:p-8">
      <fieldset disabled={readOnly} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          Padecimiento Actual
        </h3>

        {readOnly && (
          <Alert type="info">
            Primero debe guardar los datos de un paciente para poder registrar su padecimiento actual.
          </Alert>
        )}

        <div className="space-y-6">
          <FormField
            label="Motivo de Consulta"
            value={data.motivoConsulta}
            onChange={(value) => updateField('motivoConsulta', value)}
            multiline
            rows={3}
            placeholder="¿Por qué acude el paciente a la consulta? (Ej: Dolor abdominal agudo, seguimiento de hipertensión, etc.)"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              label="Inicio y Evolución de los Síntomas"
              value={data.inicioSintomas}
              onChange={(value) => updateField('inicioSintomas', value)}
              multiline
              rows={4}
              placeholder="¿Cuándo comenzaron los síntomas y cómo han evolucionado?"
            />
            
            <FormField
              label="Síntomas Asociados"
              value={data.sintomasAsociados}
              onChange={(value) => updateField('sintomasAsociados', value)}
              multiline
              rows={4}
              placeholder="Otros síntomas que acompañan al problema principal (fiebre, náuseas, mareos, etc.)..."
            />
          </div>
          
          <FormField
            label="Tratamiento Previo Recibido"
            value={data.tratamientoPrevio}
            onChange={(value) => updateField('tratamientoPrevio', value)}
            multiline
            rows={4}
            placeholder="¿Qué tratamientos ha recibido para este padecimiento? ¿Fueron efectivos?"
          />
        </div>
      </fieldset>
    </div>
  );
};

export default PadecimientoActualForm;