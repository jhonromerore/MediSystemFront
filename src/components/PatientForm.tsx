
import React, { useEffect } from 'react';
import { User, Calendar, Mail, Phone, CreditCard, MapPin, Camera, FileText, QrCode, Briefcase, Heart, Shield } from 'lucide-react';
import { InputField, SelectField, CheckboxField } from './ui';
import QRCodeGenerator from './QRCodeGenerator';

// Interfaz de datos completa (sin cambios)
export interface PatientData {
  nombres: string; apellidos: string; fechaNacimiento: string; sexo: string; email: string;
  celular: string; sinCelular: boolean; tipoIdentificacion: string; numeroIdentificacion: string;
  telefono: string; aceptaWhatsapp: boolean; enviarCorreo: boolean; direccion: string; pais: string;
  estado: string; ciudad: string; codigoPostal: string; numeroExterior: string; numeroInterior: string;
  notas: string; foto: string; edad: string; ocupacion: string; estadoCivil: string; contactoEmergencia: string;
}

interface PatientFormProps {
  patient: PatientData;
  onPatientChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  qrData: string | null;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onPatientChange, onFileChange, qrData }) => {

  // Lógica para calcular la edad (se mantiene)
  useEffect(() => {
    if (patient.fechaNacimiento) {
      const today = new Date();
      const birth = new Date(patient.fechaNacimiento);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age >= 0 && age.toString() !== patient.edad) {
        const syntheticEvent = {
          target: { name: 'edad', value: age.toString(), type: 'text' }
        } as React.ChangeEvent<HTMLInputElement>;
        onPatientChange(syntheticEvent);
      }
    }
  }, [patient.fechaNacimiento, patient.edad, onPatientChange]);

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Información del Paciente</h2>
        <p className="text-slate-500 mt-1">Complete los datos para crear o actualizar el perfil médico.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* --- Columna Izquierda (Sidebar con acentos de color) --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <h3 className="font-semibold text-blue-800 bg-blue-50 px-4 py-3 flex items-center gap-2 border-b border-blue-200"><Camera className="w-5 h-5 text-blue-600" />Fotografía</h3>
            <div className="p-4 flex flex-col items-center space-y-4">
              {patient.foto ? (
                <img src={patient.foto} alt="Foto Paciente" className="w-28 h-28 rounded-full object-cover shadow-md" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center"><User className="w-14 h-14 text-slate-400" /></div>
              )}
              <label className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors">
                Subir / Cambiar Foto
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            </div>
          </div>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <h3 className="font-semibold text-amber-800 bg-amber-50 px-4 py-3 flex items-center gap-2 border-b border-amber-200"><FileText className="w-5 h-5 text-amber-600" />Notas Internas</h3>
            <div className="p-4">
              <textarea
                name="notas" value={patient.notas} onChange={onPatientChange}
                placeholder="Anotaciones especiales..." rows={5}
                className="w-full text-sm p-2 border-2 border-slate-200 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-200 transition bg-slate-50"
              />
            </div>
          </div>
          {qrData && (
            <div className="border rounded-xl bg-white text-center shadow-sm overflow-hidden">
              <h3 className="font-semibold text-emerald-800 bg-emerald-50 px-4 py-3 flex items-center justify-center gap-2 border-b border-emerald-200"><QrCode className="w-5 h-5 text-emerald-600" />Código QR</h3>
              <div className="p-4 flex justify-center"><QRCodeGenerator value={qrData} /></div>
            </div>
          )}
        </div>

        {/* --- Columna Derecha (Formularios con colores temáticos) --- */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border shadow-sm space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-blue-800 bg-blue-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-blue-200"><User className="w-5 h-5 text-blue-600" />Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
              <InputField label="Nombre(s)" name="nombres" value={patient.nombres} onChange={onPatientChange} required />
              <InputField label="Apellido(s)" name="apellidos" value={patient.apellidos} onChange={onPatientChange} required />
              <InputField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={patient.fechaNacimiento} onChange={onPatientChange} required />
              <InputField label="Edad" name="edad" value={patient.edad} onChange={() => {}}  readOnly placeholder="Automático" className="bg-slate-100 cursor-not-allowed" />
              <SelectField label="Sexo" name="sexo" value={patient.sexo} onChange={onPatientChange} required>
                <option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option>
              </SelectField>
              <SelectField label="Estado Civil" name="estadoCivil" value={patient.estadoCivil} onChange={onPatientChange} placeholder="Seleccione...">
                <option value="Soltero(a)">Soltero(a)</option><option value="Casado(a)">Casado(a)</option><option value="Divorciado(a)">Divorciado(a)</option><option value="Viudo(a)">Viudo(a)</option><option value="Unión libre">Unión libre</option>
              </SelectField>
              <InputField label="Ocupación" name="ocupacion" value={patient.ocupacion} onChange={onPatientChange} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-teal-800 bg-teal-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-teal-200"><Phone className="w-5 h-5 text-teal-600" />Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
              <InputField label="Email" name="email" type="email" value={patient.email} onChange={onPatientChange} required />
              <InputField label="Teléfono Celular" name="celular" type="tel" value={patient.celular} onChange={onPatientChange} required={!patient.sinCelular} />
              <InputField label="Teléfono Fijo" name="telefono" value={patient.telefono} onChange={onPatientChange} />
              <InputField label="Contacto de Emergencia" name="contactoEmergencia" value={patient.contactoEmergencia} onChange={onPatientChange} placeholder="Nombre y Teléfono"/>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mx-2">
                <CheckboxField name="sinCelular" label="No tiene celular" checked={patient.sinCelular} onChange={onPatientChange} />
                <CheckboxField name="aceptaWhatsapp" label="Acepta WhatsApp" checked={patient.aceptaWhatsapp} onChange={onPatientChange} />
                <CheckboxField name="enviarCorreo" label="Acepta correos" checked={patient.enviarCorreo} onChange={onPatientChange} />
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-indigo-800 bg-indigo-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-indigo-200"><CreditCard className="w-5 h-5 text-indigo-600" />Identificación</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 px-2">
                 <SelectField label="Tipo de Identificación" name="tipoIdentificacion" value={patient.tipoIdentificacion} onChange={onPatientChange} required>
                    <option value="Cédula">Cédula</option><option value="Pasaporte">Pasaporte</option>
                 </SelectField>
                 <InputField label="Número Identificación" name="numeroIdentificacion" value={patient.numeroIdentificacion} onChange={onPatientChange} required />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-amber-800 bg-amber-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-amber-200"><MapPin className="w-5 h-5 text-amber-600" />Información Demográfica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
              <InputField label="Dirección" name="direccion" value={patient.direccion} onChange={onPatientChange} />
              <InputField label="País" name="pais" value={patient.pais} onChange={onPatientChange} />
              <InputField label="Estado / Provincia" name="estado" value={patient.estado} onChange={onPatientChange} />
              <InputField label="Ciudad" name="ciudad" value={patient.ciudad} onChange={onPatientChange} />
              <InputField label="Código Postal" name="codigoPostal" value={patient.codigoPostal} onChange={onPatientChange} />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PatientForm;