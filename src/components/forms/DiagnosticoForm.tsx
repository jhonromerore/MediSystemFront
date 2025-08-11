import React, { useState } from 'react';
import { Brain, Search, Tag } from 'lucide-react';
import { FormField, InputField, Alert } from '../ui';

// --- Tipos de Datos ---
export interface DiagnosticoData {
  principal: string;
  secundarios: string;
  diferencial: string;
  cie10: string;
}

interface DiagnosticoFormProps {
  data: DiagnosticoData;
  onChange: (data: DiagnosticoData) => void;
  readOnly: boolean;
}

// --- El Componente del Formulario ---
const DiagnosticoForm: React.FC<DiagnosticoFormProps> = ({ data, onChange, readOnly }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const updateField = (field: keyof DiagnosticoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Datos de ejemplo para el buscador CIE-10
  const commonCIE10 = [
    { code: 'I10', description: 'Hipertensión esencial (primaria)' },
    { code: 'E11.9', description: 'Diabetes mellitus tipo 2, sin complicaciones' },
    { code: 'J06.9', description: 'Infección aguda de las vías respiratorias superiores, no especificada' },
    { code: 'R51', description: 'Cefalea' },
    { code: 'K30', description: 'Dispepsia' },
    { code: 'Z00.0', description: 'Examen médico general' },
  ];

  const filteredCIE10 = searchTerm 
    ? commonCIE10.filter(item => 
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const selectCIE10 = (code: string, description: string) => {
    updateField('cie10', `${code} - ${description}`);
    setSearchTerm('');
  };

  return (
    <div className="p-6 md:p-8">
      <fieldset disabled={readOnly} className="space-y-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-600" />
          Diagnóstico Médico
        </h3>

        {readOnly && (
          <Alert type="info">
            Primero debe guardar los datos de un paciente para poder registrar el diagnóstico.
          </Alert>
        )}

        {/* Sección de Diagnósticos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            label="Diagnóstico Principal"
            value={data.principal}
            onChange={(value) => updateField('principal', value)}
            multiline
            rows={5}
            placeholder="El diagnóstico más probable basado en la evidencia clínica..."
          />
          <FormField
            label="Diagnósticos Secundarios"
            value={data.secundarios}
            onChange={(value) => updateField('secundarios', value)}
            multiline
            rows={5}
            placeholder="Comorbilidades y condiciones adicionales presentes (ej: Obesidad, Dislipidemia...)"
          />
          <div className="lg:col-span-2">
            <FormField
              label="Diagnóstico Diferencial"
              value={data.diferencial}
              onChange={(value) => updateField('diferencial', value)}
              multiline
              rows={4}
              placeholder="Otras posibilidades diagnósticas a considerar o descartar..."
            />
          </div>
        </div>

        {/* Sección CIE-10 */}
        <section>
            <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b flex items-center gap-3">
                <Tag className="w-5 h-5 text-blue-600" />
                Clasificación CIE-10
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField
                    label="Código CIE-10 Principal"
                    name="cie10"
                    value={data.cie10}
                    onChange={(e) => updateField('cie10', e.target.value)}
                    placeholder="Seleccione de la lista o ingrese manualmente"
                />
                <InputField
                    label="Buscar Código"
                    name="searchCIE10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por código o descripción (ej: 'I10' o 'Hipertensión')"
                    icon={Search}
                />
            </div>
            {searchTerm && (
              <div className="mt-4 border rounded-lg max-h-48 overflow-y-auto">
                {filteredCIE10.length > 0 ? filteredCIE10.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => selectCIE10(item.code, item.description)}
                    className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-b-0"
                  >
                    <div className="font-mono text-sm font-semibold text-blue-600">{item.code}</div>
                    <div className="text-sm text-slate-700">{item.description}</div>
                  </button>
                )) : (
                  <div className="p-3 text-sm text-slate-500">No se encontraron resultados.</div>
                )}
              </div>
            )}
        </section>
      </fieldset>
    </div>
  );
};

export default DiagnosticoForm;