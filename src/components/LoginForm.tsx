// Archivo: src/components/LoginForm.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Stethoscope, LogIn } from "lucide-react";
import { InputField, Button, Alert, CheckboxField } from "./ui";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) {
      setError("");
      setShowError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowError(false);

    if (!formData.email || !formData.password) {
      setError("Por favor, complete todos los campos");
      setShowError(true);
      setIsLoading(false);
      return;
    }

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login:", { ...formData, rememberMe });
      // Aquí puedes agregar la lógica real de login
    } catch {
      setError("Error al iniciar sesión");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissError = () => {
    setShowError(false);
    setError("");
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex items-center justify-center">
          <motion.div
            className="bg-white/30 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Stethoscope className="text-white w-10 h-10" />
          </motion.div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Bienvenido de Vuelta
            </h2>
            <p className="text-slate-500 mt-2">
              Ingrese sus credenciales para acceder al sistema.
            </p>
          </div>

          {/* Error Alert */}
          {showError && error && (
            <Alert 
              type="error" 
              dismissible={true}
              onDismiss={handleDismissError}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="doctor@ejemplo.com"
              value={formData.email}
              onChange={handleInputChange}
              icon={Mail}
              required
            />

            <InputField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <CheckboxField
                label="Recordarme"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                description="Mantener la sesión iniciada"
              />
              
              <a 
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                icon={LogIn}
                size="lg"
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Sistema Médico. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </motion.div>
  );
}