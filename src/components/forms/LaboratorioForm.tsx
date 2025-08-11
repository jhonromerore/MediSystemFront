// Archivo: src/components/forms/LaboratorioForm.tsx

import React from 'react';
import { Upload, Plus, FileText, Save } from 'lucide-react';
import { Button, Alert } from '../ui';

// --- Props del Componente ---
interface LaboratorioFormProps {
  uploadedFiles: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  isLoading: boolean;
  readOnly: boolean;
}

// --- El Componente del Formulario ---
const LaboratorioForm: React.FC<LaboratorioFormProps> = ({
  uploadedFiles,
  onFileSelect,
  onUpload,
  isLoading,
  readOnly,
}) => {
  return (
    <div className="p-6 md:p-8">
      <fieldset disabled={readOnly || isLoading} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Upload className="w-6 h-6 text-cyan-600" />
          Laboratorio y Estudios
        </h3>

        {readOnly && (
          <Alert type="info">
            Primero debe guardar los datos de un paciente para poder subir archivos de laboratorio.
          </Alert>
        )}

        <div className="max-w-xl mx-auto border-2 border-dashed border-slate-300 rounded-xl p-12 text-center transition-colors hover:border-blue-500 hover:bg-slate-50">
          <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-700">Subir Archivos</h4>
          <p className="text-slate-500 mb-6 mt-1">Arrastra o selecciona los resultados de laboratorio, imágenes, etc.</p>
          
          {/* El botón ahora activa un input oculto */}
          <Button icon={Plus} onClick={() => document.getElementById('file-upload-input')?.click()}>
            Seleccionar Archivos
          </Button>
          <input 
            id="file-upload-input" 
            type="file" 
            multiple 
            className="hidden" 
            onChange={onFileSelect} 
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="max-w-xl mx-auto mt-8">
            <h4 className="font-semibold text-slate-800 mb-3">Archivos listos para subir:</h4>
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-slate-700 truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto flex-shrink-0">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </li>
              ))}
            </ul>

            {!readOnly && (
              <div className="flex justify-end pt-6 mt-4 border-t">
                <Button 
                  onClick={onUpload} 
                  loading={isLoading} 
                  icon={Save}
                  className="px-8 py-3"
                >
                  Subir {uploadedFiles.length} Archivo(s)
                </Button>
              </div>
            )}
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default LaboratorioForm;