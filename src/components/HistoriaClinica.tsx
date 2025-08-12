import React, { useState } from "react";
import {
  User, ClipboardList, AlertTriangle, Activity, Stethoscope, Brain, Pill, TestTube,
  FileText, Save
} from "lucide-react";
import { ApiService } from "../api/ApiService";
import { PageContainer, MotionCard, CardHeader, TabNavigation, Button, Alert } from "./ui";
import {
  antecedentesSchema,
  padecimientoActualSchema,
  diagnosticoSchema,
  tratamientoSchema,
  signosVitalesSchema,
  exploracionFisicaSchema,
} from "../validations/schema";
import { toast } from "sonner";

// Formularios
import PatientForm from "./PatientForm";
import AntecedentesForm from "./forms/AntecedentesForm";
import PadecimientoActualForm from "./forms/PadecimientoActualForm";
import DiagnosticoForm from "./forms/DiagnosticoForm";
import TratamientoForm from "./forms/TratamientoForm";
import SignosVitalesForm from "./forms/SignosVitalesForm";
import ExploracionFisicaForm from "./forms/ExploracionFisicaForm";
import LaboratorioForm from "./forms/LaboratorioForm";

// Tipos de los demás formularios
import type { AntecedentesData } from "./forms/AntecedentesForm";
import type { PadecimientoActualData } from "./forms/PadecimientoActualForm";
import type { DiagnosticoData } from "./forms/DiagnosticoForm";
import type { TratamientoData } from "./forms/TratamientoForm";
import type { SignosVitalesData } from "./forms/SignosVitalesForm";
import type { ExploracionFisicaData } from "./forms/ExploracionFisicaForm";

export default function HistoriaClinica() {
  // Tabs
  const tabs = [
    { id: "nuevo-paciente", label: "Datos Paciente", icon: User },
    { id: "padecimiento", label: "Padecimiento Actual", icon: AlertTriangle },
    { id: "vitales", label: "Signos Vitales", icon: Activity },
    { id: "antecedentes", label: "Antecedentes", icon: ClipboardList },
    { id: "exploracion", label: "Exploración Física", icon: Stethoscope },
    { id: "diagnostico", label: "Diagnóstico", icon: Brain },
    { id: "tratamiento", label: "Tratamiento", icon: Pill },
    { id: "laboratorio", label: "Laboratorio", icon: TestTube },
  ];

  // Estado general
  const [activeTab, setActiveTab] = useState("nuevo-paciente");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrData, setQrData] = useState<string | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<number | null>(null);

  // Estados de los otros formularios (controlados como antes)
  const [antecedentes, setAntecedentes] = useState<AntecedentesData>({
    personalesPatologicos: "",
    personalesNoPatologicos: "",
    familiares: "",
    ginecobstetricos: "",
    quirurgicos: "",
    alergias: "",
    medicamentos: "",
  });
  const [padecimientoActual, setPadecimientoActual] = useState<PadecimientoActualData>({
    motivoConsulta: "",
    inicioSintomas: "",
    evolucion: "",
    sintomasAsociados: "",
    tratamientoPrevio: "",
  });
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData>({
    principal: "",
    secundarios: "",
    diferencial: "",
    cie10: "",
  });
  const [tratamiento, setTratamiento] = useState<TratamientoData>({
    medicamentos: "",
    indicaciones: "",
    recomendaciones: "",
    proximaCita: "",
  });
  const [signosVitales, setSignosVitales] = useState<SignosVitalesData>({
    temperatura: "",
    presionSistolica: "",
    presionDiastolica: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    saturacionOxigeno: "",
    peso: "",
    talla: "",
    imc: "",
  });
  const [exploracionFisica, setExploracionFisica] = useState<ExploracionFisicaData>({
    exploracionGeneral: {
      aspectoGeneral: "",
      estadoConciencia: "",
      orientacion: "",
      hidratacion: "",
      coloracion: "",
      constitucion: "",
      actitud: "",
      facies: "",
      marcha: "",
    },
    exploracionSistemas: {
      cabezaCuello: "",
      cardiopulmonar: "",
      abdomen: "",
      extremidades: "",
      neurologico: "",
      piel: "",
      ganglios: "",
      genitourinario: "",
    },
    hallazgosEspecificos: { hallazgosNormales: [], hallazgosAnormales: [], impresionClinica: "" },
    observacionesGenerales: "",
    fechaExploracion: new Date().toISOString().split("T")[0],
    exploradoPor: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Handlers de formularios no-RHF
  const handleAntecedentesChange = (data: AntecedentesData) => setAntecedentes(data);
  const handlePadecimientoActualChange = (data: PadecimientoActualData) => setPadecimientoActual(data);
  const handleDiagnosticoChange = (data: DiagnosticoData) => setDiagnostico(data);
  const handleTratamientoChange = (data: TratamientoData) => setTratamiento(data);
  const handleSignosVitalesChange = (field: keyof SignosVitalesData, value: string) =>
    setSignosVitales((prev) => ({ ...prev, [field]: value }));
  const handleExploracionFisicaChange = (data: ExploracionFisicaData) => setExploracionFisica(data);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  // --- Guardado general (no incluye "nuevo-paciente"; ese se guarda dentro de PatientForm) ---
  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!currentPatientId) {
        throw new Error("Debe crear o seleccionar un paciente primero.");
      }

      // Validación por tab (excepto nuevo-paciente)
      const valid = validateActiveTab();
      if (!valid) return;

      switch (activeTab) {
        case "antecedentes":
        case "padecimiento":
        case "diagnostico":
        case "tratamiento":
          // TODO: ApiService.createMedicalRecord(...)
          toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} guardado.`);
          break;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  // Guardados específicos
  const handleSaveSignosVitales = async () => {
    if (!currentPatientId) return toast.error("Debe crear o seleccionar un paciente primero.");
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
    if (!currentPatientId) return toast.error("Debe crear o seleccionar un paciente primero.");
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

  const handleUploadFiles = async () => {
    // TODO: subir archivos de laboratorio
  };

  const validateActiveTab = () => {
    try {
      switch (activeTab) {
        // "nuevo-paciente" se valida/guarda dentro de PatientForm
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

  const firstZodError = (err: unknown) => {
    // @ts-ignore
    const issues = err?.issues as Array<{ message: string }>;
    return issues?.[0]?.message ?? "Datos inválidos";
  };

  // Submit del nuevo paciente (llamado desde PatientForm)
  const handleCreatePatient = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await ApiService.createPatient(values);
      if (response.success && response.data?.patient.id) {
        setCurrentPatientId(response.data.patient.id);
        setQrData(`ID del Paciente: ${response.data.patient.id}`);
        toast.success("¡Paciente creado con éxito!");
        setActiveTab("padecimiento"); // opcional: avanzar al siguiente tab
      } else {
        throw new Error(response.error || "Error al crear paciente.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo crear el paciente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  const renderTabContent = () => {
    switch (activeTab) {
      case "nuevo-paciente":
        return <PatientForm qrData={qrData} onSubmit={handleCreatePatient} />;

      case "padecimiento":
        return (
          <PadecimientoActualForm
            data={padecimientoActual}
            onChange={handlePadecimientoActualChange}
            readOnly={!currentPatientId}
          />
        );

      case "vitales":
        return (
          <SignosVitalesForm
            data={signosVitales}
            onChange={handleSignosVitalesChange}
            onSave={handleSaveSignosVitales}
            isLoading={isLoading}
            readOnly={!currentPatientId}
          />
        );

      case "antecedentes":
        return (
          <AntecedentesForm
            data={antecedentes}
            onChange={handleAntecedentesChange}
            readOnly={!currentPatientId}
          />
        );

      case "exploracion":
        return (
          <ExploracionFisicaForm
            data={exploracionFisica}
            onChange={handleExploracionFisicaChange}
            onSave={handleSaveExploracionFisica}
            isLoading={isLoading}
            readOnly={!currentPatientId}
          />
        );

      case "diagnostico":
        return (
          <DiagnosticoForm
            data={diagnostico}
            onChange={handleDiagnosticoChange}
            readOnly={!currentPatientId}
          />
        );

      case "tratamiento":
        return (
          <TratamientoForm
            data={tratamiento}
            onChange={handleTratamientoChange}
            readOnly={!currentPatientId}
          />
        );

      case "laboratorio":
        return (
          <LaboratorioForm
            uploadedFiles={uploadedFiles}
            onFileSelect={handleFileSelect}
            onUpload={handleUploadFiles}
            isLoading={isLoading}
            readOnly={!currentPatientId}
          />
        );

      default:
        return <div className="p-6 text-center">Sección en Desarrollo</div>;
    }
  };

  return (
    <PageContainer>
      <MotionCard className="mb-4 sm:mb-6">
        <CardHeader title="Historia Clínica" icon={FileText} />
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </MotionCard>

      <MotionCard>
        <div className="responsive-inner-content">{renderTabContent()}</div>

        {/* Ocultamos el botón global en "nuevo-paciente" porque el submit lo maneja PatientForm */}
        {(activeTab === "antecedentes" ||
          activeTab === "padecimiento" ||
          activeTab === "diagnostico" ||
          activeTab === "tratamiento") && (
          <div className="flex justify-center sm:justify-end responsive-padding-x py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
            <Button onClick={handleSave} loading={isLoading} icon={Save} className="responsive-button-full responsive-button">
              Guardar Cambios
            </Button>
          </div>
        )}
      </MotionCard>
    </PageContainer>
  );
}
