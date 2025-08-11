// Archivo: src/pages/LoginPage.tsx

import { LoginForm } from '../components/LoginForm'; // <-- ¡Esta es la forma correcta!

export function LoginPage() {
  return (
    // Podrías añadir wrappers o layouts aquí si fuera necesario
    <LoginForm />
  );
}