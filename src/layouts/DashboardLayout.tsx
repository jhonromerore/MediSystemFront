// Archivo: src/layouts/DashboardLayout.tsx (VERSIÓN MEJORADA)

import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X, 
  User,
  LogOut,
  Activity,
  BarChart3,
  Shield,
  HelpCircle,
  ChevronDown,
  Home,
  Plus,
  Clock,
  Heart
} from 'lucide-react';

// Función para verificar autenticación
const useAuth = () => {
  const isAuthenticated = true; // Simular autenticación
  const user = {
    name: "Dr. Juan Pérez",
    email: "dr.perez@medicenter.com",
    avatar: "/api/placeholder/40/40",
    role: "Médico General",
    department: "Medicina Interna"
  };
  return { isAuthenticated, user };
};

// Elementos de navegación
const navigationItems = [
  {
    section: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard", badge: null },
      { id: "pacientes", label: "Pacientes", icon: Users, href: "/pacientes", badge: "12" },
      { id: "historia-clinica", label: "Historia Clínica", icon: FileText, href: "/historia-clinica", badge: null },
      { id: "citas", label: "Citas", icon: Calendar, href: "/citas", badge: "5" },
    ]
  },
  {
    section: "Análisis",
    items: [
      { id: "reportes", label: "Reportes", icon: BarChart3, href: "/reportes", badge: null },
      { id: "estadisticas", label: "Estadísticas", icon: Activity, href: "/estadisticas", badge: null },
    ]
  },
  {
    section: "Sistema",
    items: [
      { id: "configuracion", label: "Configuración", icon: Settings, href: "/configuracion", badge: null },
      { id: "ayuda", label: "Ayuda", icon: HelpCircle, href: "/ayuda", badge: null },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -320 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay para móvil */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-slate-200 z-50 lg:relative lg:z-0"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header del sidebar */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-800">MediSystem</h1>
                      <p className="text-sm text-slate-500">Sistema Médico</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                
                {/* Botón de acción rápida */}
                <motion.button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  Nueva Historia Clínica
                </motion.button>
              </div>

              {/* Navegación */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-6">
                  {navigationItems.map((section, sectionIndex) => (
                    <div key={section.section}>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                        {section.section}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item, itemIndex) => {
                          const isActive = location.pathname === item.href;
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: (sectionIndex * 0.1) + (itemIndex * 0.05),
                                duration: 0.3 
                              }}
                            >
                              <Link
                                to={item.href}
                                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                                onClick={() => {
                                  if (window.innerWidth < 1024) onClose();
                                }}
                              >
                                <item.icon className={`w-5 h-5 transition-colors ${
                                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                                }`} />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                                {isActive && (
                                  <motion.div
                                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                                    layoutId="activeIndicator"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </nav>

              {/* Footer del sidebar - Info del usuario */}
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">Dr. Juan Pérez</p>
                    <p className="text-xs text-slate-500 truncate">Medicina Interna</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: "Nueva cita programada", time: "Hace 5 min", type: "info" },
    { id: 2, title: "Paciente en sala de espera", time: "Hace 10 min", type: "warning" },
    { id: 3, title: "Resultado de laboratorio listo", time: "Hace 15 min", type: "success" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 sticky top-0 z-30 backdrop-blur-md bg-white/80">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-slate-800">
              Bienvenido, {user.name.split(' ')[1]}
            </h1>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar pacientes, historias clínicas..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Quick stats */}
          <div className="hidden lg:flex items-center gap-6 mr-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">12</p>
                <p className="text-xs text-slate-500">Pacientes hoy</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">5</p>
                <p className="text-xs text-slate-500">Citas pendientes</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Notificaciones</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-1 rounded-full ${
                            notification.type === 'info' ? 'bg-blue-100' :
                            notification.type === 'warning' ? 'bg-amber-100' :
                            'bg-emerald-100'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              notification.type === 'info' ? 'bg-blue-500' :
                              notification.type === 'warning' ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                            <p className="text-xs text-slate-500">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      Mi Perfil
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      Configuración
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Shield className="w-4 h-4" />
                      Privacidad
                    </button>
                    <hr className="my-2" />
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar al cambiar el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        // Cerrar dropdowns
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}