// Archivo: src/pages/DashboardOverviewPage.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Clock, 
  TrendingUp, 
  Heart, 
  AlertCircle,
  CheckCircle,
  Timer,
  UserPlus,
  BarChart3,
  PieChart,
  Stethoscope,
  Pill,
  TestTube,
  Brain,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Star,
  MapPin,
  Phone
} from 'lucide-react';

// Datos simulados
const statsData = {
  patients: {
    total: 1247,
    newToday: 8,
    change: 12.5,
    trend: 'up'
  },
  appointments: {
    today: 24,
    pending: 6,
    completed: 18,
    cancelled: 2
  },
  revenue: {
    monthly: 45680,
    change: 8.2,
    trend: 'up'
  },
  satisfaction: {
    score: 4.8,
    total: 152,
    change: 2.1
  }
};

const recentPatients = [
  { id: 1, name: "María González", age: 34, lastVisit: "2024-08-05", status: "active", condition: "Hipertensión" },
  { id: 2, name: "Carlos Rodríguez", age: 45, lastVisit: "2024-08-04", status: "follow-up", condition: "Diabetes" },
  { id: 3, name: "Ana Martínez", age: 28, lastVisit: "2024-08-03", status: "completed", condition: "Control rutinario" },
  { id: 4, name: "Luis Fernández", age: 67, lastVisit: "2024-08-02", status: "critical", condition: "Arritmia cardíaca" },
  { id: 5, name: "Elena Torres", age: 52, lastVisit: "2024-08-01", status: "active", condition: "Migraña crónica" }
];

const upcomingAppointments = [
  { id: 1, patient: "Roberto Silva", time: "09:00", type: "Consulta general", duration: 30 },
  { id: 2, patient: "Patricia López", time: "10:30", type: "Control diabetes", duration: 45 },
  { id: 3, patient: "Miguel Herrera", time: "11:15", type: "Revisión postoperatoria", duration: 30 },
  { id: 4, patient: "Carmen Ruiz", time: "14:00", type: "Primera consulta", duration: 60 },
  { id: 5, patient: "Diego Morales", time: "15:30", type: "Control hipertensión", duration: 30 }
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, trend, change, color, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
          
          {change && (
            <div className="flex items-center gap-1 mt-3">
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              ) : null}
              <span className={`text-sm font-semibold ${
                trend === 'up' ? 'text-emerald-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-slate-600'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-slate-500 text-sm">vs mes anterior</span>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-2xl ${color} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const QuickActions: React.FC = () => {
  const actions = [
    { id: 1, label: "Nueva Historia Clínica", icon: FileText, color: "bg-blue-600", href: "/historia-clinica" },
    { id: 2, label: "Programar Cita", icon: Calendar, color: "bg-emerald-600", href: "/citas" },
    { id: 3, label: "Buscar Paciente", icon: Users, color: "bg-purple-600", href: "/pacientes" },
    { id: 4, label: "Ver Reportes", icon: BarChart3, color: "bg-orange-600", href: "/reportes" }
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-blue-600" />
        Acciones Rápidas
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center gap-2 text-sm font-semibold shadow-md`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + (index * 0.1) }}
          >
            <action.icon className="w-6 h-6" />
            {action.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const RecentPatients: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'follow-up': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'follow-up': return 'Seguimiento';
      case 'completed': return 'Completado';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Pacientes Recientes
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {recentPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + (index * 0.1) }}
            whileHover={{ x: 4 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {patient.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.age} años • {patient.condition}</p>
              <p className="text-xs text-slate-400">Última visita: {patient.lastVisit}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
              {getStatusLabel(patient.status)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const UpcomingAppointments: React.FC = () => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Citas de Hoy
        </h3>
        <span className="text-sm text-slate-500">
          {upcomingAppointments.length} citas programadas
        </span>
      </div>

      <div className="space-y-3">
        {upcomingAppointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + (index * 0.1) }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-px h-8 bg-slate-200"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-slate-800">{appointment.patient}</p>
                <span className="text-sm font-semibold text-blue-600">{appointment.time}</span>
              </div>
              <p className="text-sm text-slate-600">{appointment.type}</p>
              <p className="text-xs text-slate-500">{appointment.duration} minutos</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MapPin className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const SystemHealth: React.FC = () => {
  const healthMetrics = [
    { label: "Sistema", status: "operational", value: "99.9%" },
    { label: "Base de Datos", status: "operational", value: "Normal" },
    { label: "Respaldo", status: "warning", value: "6h ago" },
    { label: "API", status: "operational", value: "< 200ms" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-600';
      case 'warning': return 'text-amber-600';
      case 'error': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
    >
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-600" />
        Estado del Sistema
      </h3>

      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + (index * 0.1) }}
          >
            <div className="flex items-center gap-3">
              <span className={getStatusColor(metric.status)}>
                {getStatusIcon(metric.status)}
              </span>
              <span className="text-sm font-medium text-slate-700">{metric.label}</span>
            </div>
            <span className="text-sm text-slate-600">{metric.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-emerald-800">Todo funciona correctamente</span>
        </div>
        <p className="text-sm text-emerald-600">
          Todos los sistemas están operativos. Última verificación: hace 2 minutos.
        </p>
      </div>
    </motion.div>
  );
};

export const DashboardOverviewPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Panel de Control</h1>
            <p className="text-slate-600">
              {currentTime.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-6 h-6" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Pacientes"
          value={statsData.patients.total.toLocaleString()}
          subtitle={`+${statsData.patients.newToday} nuevos hoy`}
          icon={Users}
          trend={statsData.patients.trend as 'up'}
          change={statsData.patients.change}
          color="bg-gradient-to-r from-blue-600 to-indigo-600"
          delay={0.1}
        />
        <StatCard
          title="Citas Hoy"
          value={statsData.appointments.today}
          subtitle={`${statsData.appointments.completed} completadas`}
          icon={Calendar}
          color="bg-gradient-to-r from-emerald-600 to-green-600"
          delay={0.2}
        />
        <StatCard
          title="Ingresos Mensuales"
          value={`$${statsData.revenue.monthly.toLocaleString()}`}
          icon={TrendingUp}
          trend={statsData.revenue.trend as 'up'}
          change={statsData.revenue.change}
          color="bg-gradient-to-r from-purple-600 to-pink-600"
          delay={0.3}
        />
        <StatCard
          title="Satisfacción"
          value={`${statsData.satisfaction.score}/5`}
          subtitle={`${statsData.satisfaction.total} evaluaciones`}
          icon={Star}
          change={statsData.satisfaction.change}
          trend="up"
          color="bg-gradient-to-r from-amber-600 to-orange-600"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingAppointments />
          <RecentPatients />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <SystemHealth />
        </div>
      </div>

      {/* Footer info */}
      <motion.div
        className="text-center text-slate-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <p>MediSystem v2.0 • Sistema de Gestión Médica Integral</p>
        <p>Última actualización: {new Date().toLocaleString()}</p>
      </motion.div>
    </div>
  );
};

export default DashboardOverviewPage;