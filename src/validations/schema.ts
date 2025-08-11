import { z } from "zod";

/** ---------- Paciente ---------- */
export const CedulaEC = z
  .string()
  .trim()
  .regex(/^\d{10}$/, "Cédula inválida (10 dígitos)"); // Ajusta si usas validación provincial

export const patientSchema = z.object({
  nombres: z.string().trim().min(2, "Mínimo 2 caracteres"),
  apellidos: z.string().trim().min(2, "Mínimo 2 caracteres"),
  fechaNacimiento: z.string().trim().min(1, "Requerido"),
  sexo: z.enum(["Masculino", "Femenino", "Otro"]).or(z.string().trim().min(1)),
  email: z.string().email("Correo inválido").or(z.literal("")).optional(),
  celular: z.string().trim().min(7, "Teléfono inválido").or(z.literal("")),
  sinCelular: z.boolean().optional(),
  tipoIdentificacion: z.enum(["Cédula", "Pasaporte"]).or(z.string().trim().min(1)),
  numeroIdentificacion: z.string().trim().min(5, "Identificación inválida"),
  telefono: z.string().trim().optional().or(z.literal("")),
  aceptaWhatsapp: z.boolean().optional(),
  enviarCorreo: z.boolean().optional(),
  direccion: z.string().trim().optional().or(z.literal("")),
  pais: z.string().trim().optional().or(z.literal("")),
  estado: z.string().trim().optional().or(z.literal("")),
  ciudad: z.string().trim().optional().or(z.literal("")),
  codigoPostal: z.string().trim().optional().or(z.literal("")),
  numeroExterior: z.string().trim().optional().or(z.literal("")),
  numeroInterior: z.string().trim().optional().or(z.literal("")),
  notas: z.string().trim().optional().or(z.literal("")),
  foto: z.string().url().optional().or(z.literal("")),
  edad: z.string().optional().or(z.literal("")),
  ocupacion: z.string().trim().optional().or(z.literal("")),
  estadoCivil: z
    .enum(["Soltero(a)", "Casado(a)", "Divorciado(a)", "Viudo(a)", "Unión libre"])
    .or(z.string().trim().optional().or(z.literal(""))),
  contactoEmergencia: z.string().trim().optional().or(z.literal("")),
});

/** ---------- Signos vitales ---------- */
const numStr = (label: string, min?: number, max?: number) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(Number(v)), `${label} debe ser numérico`)
    .refine(
      (v) => v === "" || (min === undefined || Number(v) >= min),
      `${label} mínimo ${min}`,
    )
    .refine(
      (v) => v === "" || (max === undefined || Number(v) <= max),
      `${label} máximo ${max}`,
    );

export const signosVitalesSchema = z.object({
  temperatura: numStr("Temperatura", 30, 45),
  presionSistolica: numStr("P. Sistólica", 60, 250),
  presionDiastolica: numStr("P. Diastólica", 30, 150),
  frecuenciaCardiaca: numStr("Frec. Cardíaca", 20, 220),
  frecuenciaRespiratoria: numStr("Frec. Respiratoria", 6, 60),
  saturacionOxigeno: numStr("Sat. Oxígeno", 50, 100),
  peso: numStr("Peso", 1, 500),
  talla: numStr("Talla", 30, 250),
  imc: numStr("IMC", 5, 80).optional().or(z.literal("")),
});

/** ---------- Antecedentes ---------- */
const longText = z.string().max(4000, "Máximo 4000 caracteres").default("");

export const antecedentesSchema = z.object({
  personalesPatologicos: longText,
  personalesNoPatologicos: longText,
  familiares: longText,
  ginecobstetricos: longText,
  quirurgicos: longText,
  alergias: longText,
  medicamentos: longText,
});

/** ---------- Padecimiento Actual ---------- */
export const padecimientoActualSchema = z.object({
  motivoConsulta: z.string().min(3, "Describe el motivo"),
  inicioSintomas: z.string().min(3, "Describe el inicio/evolución"),
  evolucion: z.string().optional().or(z.literal("")),
  sintomasAsociados: z.string().optional().or(z.literal("")),
  tratamientoPrevio: z.string().optional().or(z.literal("")),
});

/** ---------- Exploración Física ---------- */
export const exploracionFisicaSchema = z.object({
  exploracionGeneral: z.object({
    aspectoGeneral: longText,
    estadoConciencia: longText,
    orientacion: longText,
    hidratacion: longText,
    coloracion: longText.optional().or(z.literal("")),
    constitucion: longText,
    actitud: longText.optional().or(z.literal("")),
    facies: longText,
    marcha: longText.optional().or(z.literal("")),
  }),
  exploracionSistemas: z.object({
    cabezaCuello: longText,
    cardiopulmonar: longText,
    abdomen: longText,
    extremidades: longText,
    neurologico: longText,
    piel: longText,
    ganglios: longText.optional().or(z.literal("")),
    genitourinario: longText.optional().or(z.literal("")),
  }),
  hallazgosEspecificos: z.object({
    hallazgosNormales: z.array(z.string()).default([]),
    hallazgosAnormales: z.array(z.string()).default([]),
    impresionClinica: longText,
  }),
  observacionesGenerales: longText,
  fechaExploracion: z.string().optional().or(z.literal("")),
  exploradoPor: z.string().optional().or(z.literal("")),
});

/** ---------- Diagnóstico ---------- */
export const diagnosticoSchema = z.object({
  principal: z.string().min(3, "Describe el diagnóstico principal"),
  secundarios: z.string().optional().or(z.literal("")),
  diferencial: z.string().optional().or(z.literal("")),
  cie10: z.string().optional().or(z.literal("")),
});

/** ---------- Tratamiento ---------- */
export const tratamientoSchema = z.object({
  medicamentos: z.string().min(3, "Incluye al menos un fármaco"),
  indicaciones: z.string().min(3, "Incluye indicaciones"),
  recomendaciones: z.string().optional().or(z.literal("")),
  proximaCita: z.string().optional().or(z.literal("")),
});

/** ---------- Utilidad ---------- */
export type PatientSchema = z.infer<typeof patientSchema>;
export type SignosVitalesSchema = z.infer<typeof signosVitalesSchema>;
export type AntecedentesSchema = z.infer<typeof antecedentesSchema>;
export type PadecimientoActualSchema = z.infer<typeof padecimientoActualSchema>;
export type ExploracionFisicaSchema = z.infer<typeof exploracionFisicaSchema>;
export type DiagnosticoSchema = z.infer<typeof diagnosticoSchema>;
export type TratamientoSchema = z.infer<typeof tratamientoSchema>;
