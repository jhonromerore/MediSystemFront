import React from 'react';
import { Stethoscope, Save } from 'lucide-react';
// 1. Añadimos Alert a las importaciones
import { FormField, Button, Alert } from '../ui';

// --- Tipos de Datos (sin cambios) ---
export interface ExploracionGeneralData {
  aspectoGeneral: string; estadoConciencia: string; orientacion: string;
  hidratacion: string; coloracion: string; constitucion: string;
  actitud: string; facies: string; marcha: string;
}
export interface ExploracionSistemasData {
  cabezaCuello: string; cardiopulmonar: string; abdomen: string;
  extremidades: string; neurologico: string; piel: string;
  ganglios: string; genitourinario: string;
}
export interface HallazgosEspecificosData {
  hallazgosNormales: string[];
  hallazgosAnormales: string[];
  impresionClinica: string;
}
export interface ExploracionFisicaData {
  exploracionGeneral: ExploracionGeneralData;
  exploracionSistemas: ExploracionSistemasData;
  hallazgosEspecificos: HallazgosEspecificosData;
  observacionesGenerales: string;
  fechaExploracion: string;
  exploradoPor: string;
}

// --- Props (con 'readOnly' añadido) ---
interface ExploracionFisicaFormProps {
  data: ExploracionFisicaData;
  onChange: (newData: ExploracionFisicaData) => void;
  onSave: () => void;
  isLoading: boolean;
  readOnly: boolean; // <-- 2. AÑADIMOS LA PROP
}

// --- El Componente del Formulario ---
const ExploracionFisicaForm: React.FC<ExploracionFisicaFormProps> = ({ data, onChange, onSave, isLoading, readOnly }) => {

  const handleNestedChange = <
    T extends keyof Pick<ExploracionFisicaData, 'exploracionGeneral' | 'exploracionSistemas' | 'hallazgosEspecificos'>,
    K extends keyof ExploracionFisicaData[T]
  >(
    section: T, field: K, value: ExploracionFisicaData[T][K]
  ) => {
    onChange({ ...data, [section]: { ...data[section], [field]: value } });
  };
  
  const handleTopLevelChange = (field: 'observacionesGenerales' | 'fechaExploracion' | 'exploradoPor', value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="p-8">
      {/* 3. Usamos 'readOnly' para deshabilitar el formulario completo */}
      <fieldset disabled={readOnly || isLoading} className="space-y-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          Exploración Física
        </h2>

        {/* 4. Mostramos una alerta si está en modo solo lectura */}
        {readOnly && (
          <Alert type="info">
            Primero debe guardar los datos de un paciente para poder registrar la exploración física.
          </Alert>
        )}
        
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Exploración General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField label="Aspecto General" value={data.exploracionGeneral.aspectoGeneral} onChange={(value) => handleNestedChange('exploracionGeneral', 'aspectoGeneral', value as string)} multiline rows={3} placeholder="Paciente agudo, crónico..." />
            <FormField label="Estado de Conciencia" value={data.exploracionGeneral.estadoConciencia} onChange={(value) => handleNestedChange('exploracionGeneral', 'estadoConciencia', value as string)} multiline rows={3} placeholder="Alerta, somnoliento, comatoso..." />
            <FormField label="Orientación" value={data.exploracionGeneral.orientacion} onChange={(value) => handleNestedChange('exploracionGeneral', 'orientacion', value as string)} multiline rows={3} placeholder="Tiempo, espacio y persona..." />
            <FormField label="Hidratación y Coloración" value={data.exploracionGeneral.hidratacion} onChange={(value) => handleNestedChange('exploracionGeneral', 'hidratacion', value as string)} multiline rows={3} placeholder="Piel y mucosas, ictericia, cianosis..." />
            <FormField label="Constitución y Actitud" value={data.exploracionGeneral.constitucion} onChange={(value) => handleNestedChange('exploracionGeneral', 'constitucion', value as string)} multiline rows={3} placeholder="Endomorfo, ectomorfo, activo, pasivo..." />
            <FormField label="Facies y Marcha" value={data.exploracionGeneral.facies} onChange={(value) => handleNestedChange('exploracionGeneral', 'facies', value as string)} multiline rows={3} placeholder="Facies dolorosa, marcha atáxica..." />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Exploración por Aparatos y Sistemas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField label="Cabeza y Cuello" value={data.exploracionSistemas.cabezaCuello} onChange={(value) => handleNestedChange('exploracionSistemas', 'cabezaCuello', value as string)} multiline rows={4} placeholder="Cráneo, ojos, oídos, nariz, boca, cuello..." />
            <FormField label="Cardiopulmonar" value={data.exploracionSistemas.cardiopulmonar} onChange={(value) => handleNestedChange('exploracionSistemas', 'cardiopulmonar', value as string)} multiline rows={4} placeholder="Ruidos cardíacos, campos pulmonares..." />
            <FormField label="Abdomen" value={data.exploracionSistemas.abdomen} onChange={(value) => handleNestedChange('exploracionSistemas', 'abdomen', value as string)} multiline rows={4} placeholder="Inspección, auscultación, palpación..." />
            <FormField label="Extremidades" value={data.exploracionSistemas.extremidades} onChange={(value) => handleNestedChange('exploracionSistemas', 'extremidades', value as string)} multiline rows={4} placeholder="Simetría, pulsos, edema, movilidad..." />
            <FormField label="Neurológico" value={data.exploracionSistemas.neurologico} onChange={(value) => handleNestedChange('exploracionSistemas', 'neurologico', value as string)} multiline rows={4} placeholder="Pares craneales, reflejos..." />
            <FormField label="Piel y Ganglios" value={data.exploracionSistemas.piel} onChange={(value) => handleNestedChange('exploracionSistemas', 'piel', value as string)} multiline rows={4} placeholder="Lesiones, temperatura, adenopatías..." />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Hallazgos y Observaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
              label="Impresión Clínica"
              value={data.hallazgosEspecificos.impresionClinica}
              onChange={(value) => handleNestedChange('hallazgosEspecificos', 'impresionClinica', value as string)}
              multiline rows={5}
              placeholder="Resumen de la impresión clínica basada en la exploración."
            />
            <FormField
              label="Observaciones Generales Adicionales"
              value={data.observacionesGenerales}
              onChange={(value) => handleTopLevelChange('observacionesGenerales', value)}
              multiline rows={5}
              placeholder="Cualquier otra nota u observación relevante."
            />
          </div>
        </section>

        {/* 5. El botón de guardado ahora solo aparece si NO está en modo solo lectura */}
        {!readOnly && (
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button onClick={onSave} loading={isLoading} icon={Save} className="px-8 py-3">
              Guardar Exploración Física
            </Button>
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default ExploracionFisicaForm;