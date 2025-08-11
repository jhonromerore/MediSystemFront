// Archivo: src/main.tsx (Versión Final y Completa)

import React from 'react';
import ReactDOM from 'react-dom/client';
// --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importa tus estilos
import './index.css';
import './styles/global.css';

// Importa tus componentes de página y layouts
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Toaster } from 'sonner';
// Define las rutas de tu aplicación
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <DashboardLayout />, // El Layout es el elemento principal que protege las rutas hijas
    children: [
      // Estas son las rutas protegidas. Solo se accede si el Layout lo permite.
      {
        index: true, // Esto hace que sea la ruta por defecto ('/') dentro de este layout
        element: <DashboardPage />,
      },
      // En el futuro, podrías añadir más rutas protegidas aquí. Por ejemplo:
      // { path: "pacientes", element: <PatientsListPage /> },
    ]
  },
]);

// Renderiza la aplicación usando el RouterProvider
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster richColors closeButton />
    </React.StrictMode>
  );
}