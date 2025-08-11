import React, { useState } from "react";
import { User, ClipboardList, AlertTriangle, Activity, Stethoscope, Brain, Pill, TestTube, FileText, Save, Plus, Upload } from "lucide-react";
import { ApiService } from '../api/ApiService';
import { PageContainer, MotionCard, CardHeader, TabNavigation, Button, Alert } from './ui';
// + Validación
import {
  patientSchema,
  antecedentesSchema,
  padecimientoActualSchema,
  diagnosticoSchema,
  tratamientoSchema,
  signosVitalesSchema,
  exploracionFisicaSchema,
} from "../validations/schema";
import { toast } from "sonner";

// Formularios modulares
import PatientForm from './PatientForm';
import AntecedentesForm from "./forms/AntecedentesForm";
import PadecimientoActualForm from "./forms/PadecimientoActualForm";
import DiagnosticoForm from './forms/DiagnosticoForm';
import TratamientoForm from './forms/TratamientoForm';
import SignosVitalesForm from './forms/SignosVitalesForm';
import ExploracionFisicaForm from './forms/ExploracionFisicaForm';
import LaboratorioForm from "./forms/LaboratorioForm";

// Tipos de datos importados desde sus módulos
import type { PatientData } from './PatientForm';
import type { AntecedentesData } from "./forms/AntecedentesForm";
import type { PadecimientoActualData } from "./forms/PadecimientoActualForm";
import type { DiagnosticoData } from './forms/DiagnosticoForm';
import type { TratamientoData } from './forms/TratamientoForm';
import type { SignosVitalesData } from './forms/SignosVitalesForm';
import type { ExploracionFisicaData } from './forms/ExploracionFisicaForm';

export default function HistoriaClinica() {

  // --- ORDEN LÓGICO DEL MENÚ DE PESTAÑAS ---
  const tabs = [
    { id: "nuevo-paciente", label: "Datos Paciente", icon: User },
    { id: "padecimiento", label: "Padecimiento Actual", icon: AlertTriangle },
    { id: "vitales", label: "Signos Vitales", icon: Activity },
    { id: "antecedentes", label: "Antecedentes", icon: ClipboardList },
    { id: "exploracion", label: "Exploración Física", icon: Stethoscope },
    { id: "diagnostico", label: "Diagnóstico", icon: Brain },
    { id: "tratamiento", label: "Tratamiento", icon: Pill },
    { id: "laboratorio", label: "Laboratorio", icon: TestTube }
  ];

  // --- Estados del Componente ---
  const [activeTab, setActiveTab] = useState("nuevo-paciente");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState<string | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);

  const [paciente, setPaciente] = useState<PatientData>({
    nombres: '', apellidos: '', fechaNacimiento: '', sexo: 'Masculino', email: '',
    celular: '', sinCelular: false, tipoIdentificacion: 'Cédula', numeroIdentificacion: '',
    telefono: '', aceptaWhatsapp: true, enviarCorreo: true, direccion: '', pais: '',
    estado: '', ciudad: '', codigoPostal: '', numeroExterior: '', numeroInterior: '',
    notas: '', foto: '', edad: '', ocupacion: '', estadoCivil: '', contactoEmergencia: '',
  });
  const [antecedentes, setAntecedentes] = useState<AntecedentesData>({
    personalesPatologicos: "", personalesNoPatologicos: "", familiares: "",
    ginecobstetricos: "", quirurgicos: "", alergias: "", medicamentos: ""
  });
  const [padecimientoActual, setPadecimientoActual] = useState<PadecimientoActualData>({
    motivoConsulta: "", inicioSintomas: "", evolucion: "", sintomasAsociados: "", tratamientoPrevio: ""
  });
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData>({
    principal: "", secundarios: "", diferencial: "", cie10: ""
  });
  const [tratamiento, setTratamiento] = useState<TratamientoData>({
    medicamentos: "", indicaciones: "", recomendaciones: "", proximaCita: ""
  });
  const [signosVitales, setSignosVitales] = useState<SignosVitalesData>({
    temperatura: "", presionSistolica: "", presionDiastolica: "", frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "", saturacionOxigeno: "", peso: "", talla: "", imc: ""
  });
  const [exploracionFisica, setExploracionFisica] = useState<ExploracionFisicaData>({
    exploracionGeneral: { aspectoGeneral: "", estadoConciencia: "", orientacion: "", hidratacion: "", coloracion: "", constitucion: "", actitud: "", facies: "", marcha: "" },
    exploracionSistemas: { cabezaCuello: "", cardiopulmonar: "", abdomen: "", extremidades: "", neurologico: "", piel: "", ganglios: "", genitourinario: "" },
    hallazgosEspecificos: { hallazgosNormales: [], hallazgosAnormales: [], impresionClinica: "" },
    observacionesGenerales: "", fechaExploracion: new Date().toISOString().split('T')[0], exploradoPor: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // --- Handlers ---
  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setPaciente(prev => ({ ...prev, [name]: finalValue }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaciente(prev => ({ ...prev, foto: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };
  const handleAntecedentesChange = (data: AntecedentesData) => setAntecedentes(data);
  const handlePadecimientoActualChange = (data: PadecimientoActualData) => setPadecimientoActual(data);
  const handleDiagnosticoChange = (data: DiagnosticoData) => setDiagnostico(data);
  const handleTratamientoChange = (data: TratamientoData) => setTratamiento(data);
  const handleSignosVitalesChange = (field: keyof SignosVitalesData, value: string) => setSignosVitales(prev => ({ ...prev, [field]: value }));
  const handleExploracionFisicaChange = (data: ExploracionFisicaData) => setExploracionFisica(data);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  // --- Lógica de Guardado ---
  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!currentPatientId && activeTab !== 'nuevo-paciente') {
        throw new Error("Debe crear o seleccionar un paciente primero.");
      }
      // ✅ Valida con Zod la pestaña actual
      const valid = validateActiveTab();
      if (!valid) return;
      switch (activeTab) {
        case "nuevo-paciente":
          const response = await ApiService.createPatient(paciente);
          if (response.success && response.data?.patient.id) {
            setCurrentPatientId(response.data.patient.id);
            setQrData(`ID del Paciente: ${response.data.patient.id}`);
            alert('¡Paciente creado con éxito!');
          } else { throw new Error(response.error || 'Error al crear paciente.'); }
          break;
        case "antecedentes":
        case "padecimiento":
        case "diagnostico":
        case "tratamiento":
          console.log(`Guardando ${activeTab}...`);
          // Aquí: ApiService.createMedicalRecord(...) con los datos del tab
          toast.success(
            `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} guardado.`
          );
          break;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSignosVitales = async () => {
    if (!currentPatientId) {
      toast.error("Debe crear o seleccionar un paciente primero.");
      return;
    }
    try {
      signosVitalesSchema.parse(signosVitales);
      setIsLoading(true);
      // await ApiService.saveSignosVitales(currentPatientId, signosVitales);
      toast.success("Signos vitales guardados.");
    } catch (e) {
      toast.error(firstZodError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExploracionFisica = async () => {
    if (!currentPatientId) {
      toast.error("Debe crear o seleccionar un paciente primero.");
      return;
    }
    try {
      exploracionFisicaSchema.parse(exploracionFisica);
      setIsLoading(true);
      // await ApiService.saveExploracionFisica(currentPatientId, exploracionFisica);
      toast.success("Exploración física guardada.");
    } catch (e) {
      toast.error(firstZodError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFiles = async () => { /* Lógica de subida de archivos */ };
  const validateActiveTab = () => {
    try {
      switch (activeTab) {
        case "nuevo-paciente":
          patientSchema.parse(paciente);
          return true;
        case "antecedentes":
          antecedentesSchema.parse(antecedentes);
          return true;
        case "padecimiento":
          padecimientoActualSchema.parse(padecimientoActual);
          return true;
        case "diagnostico":
          diagnosticoSchema.parse(diagnostico);
          return true;
        case "tratamiento":
          tratamientoSchema.parse(tratamiento);
          return true;
        default:
          return true;
      }
    } catch (e) {
      toast.error(firstZodError(e));
      return false;
    }
  };
  // Coloca esto dentro del componente (o fuera si prefieres)
  const firstZodError = (err: unknown) => {
    // @ts-ignore
    const issues = err?.issues as Array<{ message: string }>;
    return issues?.[0]?.message ?? "Datos inválidos";
  };
  // --- Lógica de Renderizado ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "nuevo-paciente":
        return <PatientForm patient={paciente} onPatientChange={handlePatientChange} onFileChange={handleFileChange} qrData={qrData} />;
      case "padecimiento":
        return <PadecimientoActualForm data={padecimientoActual} onChange={handlePadecimientoActualChange} readOnly={!currentPatientId} />;
      case "vitales":
        return <SignosVitalesForm data={signosVitales} onChange={handleSignosVitalesChange} onSave={handleSaveSignosVitales} isLoading={isLoading} readOnly={!currentPatientId} />;
      case "antecedentes":
        return <AntecedentesForm data={antecedentes} onChange={handleAntecedentesChange} readOnly={!currentPatientId} />;
      case "exploracion":
        return <ExploracionFisicaForm data={exploracionFisica} onChange={handleExploracionFisicaChange} onSave={handleSaveExploracionFisica} isLoading={isLoading} readOnly={!currentPatientId} />;
      case "diagnostico":
        return <DiagnosticoForm data={diagnostico} onChange={handleDiagnosticoChange} readOnly={!currentPatientId} />;
      case "tratamiento":
        return <TratamientoForm data={tratamiento} onChange={handleTratamientoChange} readOnly={!currentPatientId} />;
      case "laboratorio":
        return <LaboratorioForm uploadedFiles={uploadedFiles} onFileSelect={handleFileSelect} onUpload={handleUploadFiles} isLoading={isLoading} readOnly={!currentPatientId} />;
      default:
        return <div className="p-6 text-center">Sección en Desarrollo</div>;
    }
  };

  return (
    <PageContainer>
      <MotionCard className="mb-6">
        <CardHeader title="Historia Clínica" icon={FileText} />
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </MotionCard>
      <MotionCard>
        {error && <Alert type="error" className="m-6">{error}</Alert>}
        <div className="min-h-[600px]">{renderTabContent()}</div>
        {(activeTab === "nuevo-paciente" || activeTab === "antecedentes" || activeTab === "padecimiento" || activeTab === "diagnostico" || activeTab === "tratamiento") && (
          <div className="flex justify-end p-6 pt-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <Button onClick={handleSave} loading={isLoading} icon={Save} className="px-8 py-4 text-lg">Guardar Cambios</Button>
          </div>
        )}
      </MotionCard>
    </PageContainer>
  );
}