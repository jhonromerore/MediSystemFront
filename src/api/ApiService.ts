// Archivo: src/api/ApiService.ts

// Exportamos las interfaces para que puedan ser usadas en otros archivos
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PatientResponse {
  patient: {
    id: number;
  };
}

// Exportamos el objeto ApiService
export const ApiService = {
  baseURL: 'http://localhost:3000/api',
  
  getHeaders: () => ({
    'Content-Type': 'application/json',
    // En el futuro, aquí también añadirías el token de autenticación:
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  }),

  login: async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${ApiService.baseURL}/auth/login`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error HTTP: ${response.status}`);
      }
      return { success: true, data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error en login';
      return { success: false, error: errorMessage };
    }
  },

  createPatient: async (patientData: any): Promise<ApiResponse<PatientResponse>> => {
    try {
      const response = await fetch(`${ApiService.baseURL}/patients`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(patientData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${JSON.stringify(data)}`);
      }
      return { 
        success: true, 
        data: { patient: data.data.patient }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error creando paciente';
      return { success: false, error: errorMessage };
    }
  },

  createMedicalRecord: async (medicalData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${ApiService.baseURL}/medical-records`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify(medicalData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${JSON.stringify(data)}`);
      }
      return { success: true, data };
    } catch (error: unknown)
    {
      const errorMessage = error instanceof Error ? error.message : 'Error creando historia clínica';
      return { success: false, error: errorMessage };
    }
  }
};