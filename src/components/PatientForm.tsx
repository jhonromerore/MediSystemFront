import React, { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Camera,
  FileText,
  QrCode,
  Phone,
  CreditCard,
  MapPin,
} from "lucide-react";

import InputField from "./ui/InputField";
import SelectField from "./ui/SelectField";
import CheckboxField from "./ui/CheckboxField";
import QRCodeGenerator from "./QRCodeGenerator";
import { toast } from "sonner";
const sexoValues = ["Masculino", "Femenino", "Otro"] as const;
const estadoCivilValues = ["Soltero(a)", "Casado(a)", "Divorciado(a)", "Viudo(a)", "Unión libre"] as const;
const idValues = ["Cédula", "Pasaporte"] as const;
// --- Schema Zod para validación ---
const patientSchema = z.object({
  nombres: z.string().min(2, "Mínimo 2 caracteres"),
  apellidos: z.string().min(2, "Mínimo 2 caracteres"),
  fechaNacimiento: z.string().min(1, "Requerido"),
  sexo: z.enum(sexoValues, { message: "Seleccione sexo" }),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  celular: z.string().min(7, "Teléfono inválido").optional().or(z.literal("")),
  sinCelular: z.boolean(),
  tipoIdentificacion: z.enum(idValues, { message: "Seleccione tipo de identificación" }),
  numeroIdentificacion: z.string().min(5, "Número inválido"),
  telefono: z.string().optional().or(z.literal("")),
  aceptaWhatsapp: z.boolean(),
  enviarCorreo: z.boolean(),
  direccion: z.string().optional().or(z.literal("")),
  pais: z.string().optional().or(z.literal("")),
  estado: z.string().optional().or(z.literal("")),
  ciudad: z.string().optional().or(z.literal("")),
  codigoPostal: z.string().optional().or(z.literal("")),
  numeroExterior: z.string().optional().or(z.literal("")),
  numeroInterior: z.string().optional().or(z.literal("")),
  notas: z.string().optional().or(z.literal("")),
  foto: z.string().optional().or(z.literal("")),
  edad: z.string().optional().or(z.literal("")),
  ocupacion: z.string().optional().or(z.literal("")),
  estadoCivil: z.enum(estadoCivilValues, { message: "Seleccione estado civil" })
               .optional()
               .or(z.literal("")),
  contactoEmergencia: z.string().optional().or(z.literal("")),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  qrData: string | null;
  onSubmit: (data: PatientFormValues) => void;
}

export default function PatientForm({ qrData, onSubmit }: PatientFormProps) {
  const methods = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      sexo: "Masculino",
      email: "",
      celular: "",
      sinCelular: false,
      tipoIdentificacion: "Cédula",
      numeroIdentificacion: "",
      telefono: "",
      aceptaWhatsapp: true,
      enviarCorreo: true,
      direccion: "",
      pais: "",
      estado: "",
      ciudad: "",
      codigoPostal: "",
      numeroExterior: "",
      numeroInterior: "",
      notas: "",
      foto: "",
      edad: "",
      ocupacion: "",
      estadoCivil: "",
      contactoEmergencia: "",
    },
  });

  const { setValue, control, handleSubmit } = methods;
  const fechaNacimiento = useWatch({ control, name: "fechaNacimiento" });

  // Calcular edad automáticamente
  useEffect(() => {
    if (fechaNacimiento) {
      const today = new Date();
      const birth = new Date(fechaNacimiento);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      setValue("edad", age >= 0 ? age.toString() : "");
    }
  }, [fechaNacimiento, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setValue("foto", reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitHandler = (data: PatientFormValues) => {
    onSubmit(data);
    toast.success("Paciente guardado correctamente");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="p-6 md:p-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">
              Información del Paciente
            </h2>
            <p className="text-slate-500 mt-1">
              Complete los datos para crear o actualizar el perfil médico.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Columna izquierda */}
            <div className="lg:col-span-1 space-y-6">
              <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                <h3 className="font-semibold text-blue-800 bg-blue-50 px-4 py-3 flex items-center gap-2 border-b border-blue-200">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Fotografía
                </h3>
                <div className="p-4 flex flex-col items-center space-y-4">
                  {methods.getValues("foto") ? (
                    <img
                      src={methods.getValues("foto")}
                      alt="Foto Paciente"
                      className="w-28 h-28 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="w-14 h-14 text-slate-400" />
                    </div>
                  )}
                  <label className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors">
                    Subir / Cambiar Foto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                <h3 className="font-semibold text-amber-800 bg-amber-50 px-4 py-3 flex items-center gap-2 border-b border-amber-200">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Notas Internas
                </h3>
                <div className="p-4">
                  <textarea
                    {...methods.register("notas")}
                    placeholder="Anotaciones especiales..."
                    rows={5}
                    className="w-full text-sm p-2 border-2 border-slate-200 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-200 transition bg-slate-50"
                  />
                </div>
              </div>
              {qrData && (
                <div className="border rounded-xl bg-white text-center shadow-sm overflow-hidden">
                  <h3 className="font-semibold text-emerald-800 bg-emerald-50 px-4 py-3 flex items-center justify-center gap-2 border-b border-emerald-200">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    Código QR
                  </h3>
                  <div className="p-4 flex justify-center">
                    <QRCodeGenerator value={qrData} />
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl border shadow-sm space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-blue-800 bg-blue-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-blue-200">
                  <User className="w-5 h-5 text-blue-600" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
                  <InputField label="Nombre(s)" name="nombres" required />
                  <InputField label="Apellido(s)" name="apellidos" required />
                  <InputField
                    label="Fecha de Nacimiento"
                    name="fechaNacimiento"
                    type="date"
                    required
                  />
                  <InputField
                    label="Edad"
                    name="edad"
                    readOnly
                    placeholder="Automático"
                    className="bg-slate-100 cursor-not-allowed"
                  />
                  <SelectField label="Sexo" name="sexo" required>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </SelectField>
                  <SelectField
                    label="Estado Civil"
                    name="estadoCivil"
                    placeholder="Seleccione..."
                  >
                    <option value="Soltero(a)">Soltero(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viudo(a)">Viudo(a)</option>
                    <option value="Unión libre">Unión libre</option>
                  </SelectField>
                  <InputField label="Ocupación" name="ocupacion" />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-teal-800 bg-teal-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-teal-200">
                  <Phone className="w-5 h-5 text-teal-600" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    required
                  />
                  <InputField
                    label="Teléfono Celular"
                    name="celular"
                    type="tel"
                  />
                  <InputField label="Teléfono Fijo" name="telefono" />
                  <InputField
                    label="Contacto de Emergencia"
                    name="contactoEmergencia"
                    placeholder="Nombre y Teléfono"
                  />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mx-2">
                  <CheckboxField name="sinCelular" label="No tiene celular" />
                  <CheckboxField name="aceptaWhatsapp" label="Acepta WhatsApp" />
                  <CheckboxField name="enviarCorreo" label="Acepta correos" />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-indigo-800 bg-indigo-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-indigo-200">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Identificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 px-2">
                  <SelectField
                    label="Tipo de Identificación"
                    name="tipoIdentificacion"
                    required
                  >
                    <option value="Cédula">Cédula</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </SelectField>
                  <InputField
                    label="Número Identificación"
                    name="numeroIdentificacion"
                    required
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-amber-800 bg-amber-50 px-4 py-3 rounded-t-lg flex items-center gap-3 border-b-2 border-amber-200">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Información Demográfica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
                  <InputField label="Dirección" name="direccion" />
                  <InputField label="País" name="pais" />
                  <InputField label="Estado / Provincia" name="estado" />
                  <InputField label="Ciudad" name="ciudad" />
                  <InputField label="Código Postal" name="codigoPostal" />
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
