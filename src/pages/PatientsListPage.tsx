import React, { useEffect, useMemo, useState } from "react";
import {
  Users, UserPlus, RefreshCw, Search, Eye, Edit, QrCode as QrCodeIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ApiService } from "../api/ApiService";
import { PageContainer, MotionCard, CardHeader, Button, Alert } from "./../components/ui";
import { toast } from "sonner";

type Patient = {
  id: number;
  nombres: string;
  apellidos: string;
  sexo?: string;
  fechaNacimiento?: string; // ISO yyyy-mm-dd
  tipoIdentificacion?: string;
  numeroIdentificacion?: string;
  email?: string;
  celular?: string;
  ciudad?: string;
  // agrega otros campos si tu API los trae
};

function calcAge(iso?: string): string {
  if (!iso) return "";
  const birth = new Date(iso);
  if (Number.isNaN(birth.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? String(age) : "";
}

export default function PatientsListPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // Ajusta al método real de tu ApiService:
      // Debe devolver { success: boolean, data: { patients: Patient[] } }
      const res = await (ApiService as any).getPatients?.();
      const list: Patient[] =
        res?.data?.patients ??
        res?.data ??
        []; // fallback por si tu API responde distinto
      setPatients(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo cargar la lista de pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((p) => {
      const full = `${p.nombres ?? ""} ${p.apellidos ?? ""}`.toLowerCase();
      return (
        full.includes(term) ||
        (p.numeroIdentificacion ?? "").toLowerCase().includes(term) ||
        (p.email ?? "").toLowerCase().includes(term) ||
        (p.celular ?? "").toLowerCase().includes(term) ||
        (p.ciudad ?? "").toLowerCase().includes(term)
      );
    });
  }, [patients, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    // si cambias el término, vuelve a la página 1
    setPage(1);
  }, [q]);

  const handleView = (id: number) => {
    // navega a la historia clínica del paciente
    // ajusta la ruta a la que tengas (ej: /historia/:id o /?patientId=...)
    navigate(`/historia/${id}`);
  };

  const handleEdit = (id: number) => {
    // si tienes ruta de edición, ajusta aquí
    navigate(`/pacientes/${id}/editar`);
  };

  const handleQR = (id: number) => {
    toast.info(`Mostrar QR para paciente #${id}`);
    // podrías abrir un modal con el QR o navegar a una vista que lo muestre
  };

  return (
    <PageContainer>
      <MotionCard className="mb-4 sm:mb-6">
        <CardHeader title="Pacientes" icon={Users} />
        <div className="responsive-padding-x py-4 border-t border-slate-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, cédula, email, teléfono o ciudad..."
              className="responsive-form-field w-full pl-9 pr-3 rounded-lg border border-slate-300 bg-white outline-none focus:ring focus:ring-slate-200"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={load} icon={RefreshCw} className="bg-slate-700 hover:bg-slate-800 responsive-button">
              Actualizar
            </Button>
            <Link to="/pacientes/nuevo">
              <Button icon={UserPlus} className="responsive-button">Nuevo paciente</Button>
            </Link>
          </div>
        </div>
      </MotionCard>

      <MotionCard>
        {error && <Alert type="error" className="m-4">{error}</Alert>}

        <div className="responsive-inner-content overflow-x-auto">
          <div className="responsive-table-container">
            <table className="responsive-table border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs sm:text-sm text-slate-600">
                  <th className="px-2 sm:px-4 py-2 sm:py-3">ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3">Nombre</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">Identificación</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">Sexo</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">Edad</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">Email</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">Celular</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 hidden xl:table-cell">Ciudad</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  // Skeleton rows
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Array.from({ length: 9 }).map((__, j) => (
                        <td key={j} className="px-2 sm:px-4 py-2 sm:py-3">
                          <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-slate-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                      No se encontraron pacientes.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small">{p.id}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="font-medium text-slate-800 responsive-text-small">
                          {p.nombres} {p.apellidos}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small hidden sm:table-cell">
                        {(p.tipoIdentificacion ?? "") && (
                          <span className="text-slate-500 mr-1">{p.tipoIdentificacion}:</span>
                        )}
                        {p.numeroIdentificacion ?? "—"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small hidden md:table-cell">{p.sexo ?? "—"}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small hidden md:table-cell">{calcAge(p.fechaNacimiento) || "—"}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small hidden lg:table-cell">{p.email || "—"}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small hidden lg:table-cell">{p.celular || "—"}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 responsive-text-small hidden xl:table-cell">{p.ciudad || "—"}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                          <Button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 responsive-text-small px-2 sm:px-3 py-1 sm:py-2" onClick={() => handleQR(p.id)} icon={QrCodeIcon}>
                            QR
                          </Button>
                          <Button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 responsive-text-small px-2 sm:px-3 py-1 sm:py-2" onClick={() => handleView(p.id)} icon={Eye}>
                            Ver
                          </Button>
                          <Button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 responsive-text-small px-2 sm:px-3 py-1 sm:py-2" onClick={() => handleEdit(p.id)} icon={Edit}>
                            Editar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {!loading && filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <p className="responsive-text-small text-slate-600 text-center sm:text-left">
                Mostrando{" "}
                <span className="font-semibold">
                  {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)}
                </span>{" "}
                de <span className="font-semibold">{filtered.length}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 responsive-text-small px-3 sm:px-4 py-2"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 responsive-text-small px-3 sm:px-4 py-2"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </MotionCard>
    </PageContainer>
  );
}
