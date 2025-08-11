// Archivo: src/components/forms/AntecedentesForm.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Hospital, Users, Baby, Scissors, AlertTriangle, Pill, Heart, User } from 'lucide-react';
import { FormField } from '../ui';

export interface AntecedentesData {
  personalesPatologicos: string;
  personalesNoPatologicos: string;
  familiares: string;
  ginecobstetricos: string;
  quirurgicos: string;
  alergias: string;
  medicamentos: string;
}

interface AntecedentesFormProps {
  data: AntecedentesData;
  onChange: (data: AntecedentesData) => void;
}

const AntecedentesForm: React.FC<AntecedentesFormProps> = ({ data, onChange }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const updateField = (field: keyof AntecedentesData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const antecedentesCategories = [
    {
      id: 'patologicos',
      title: 'Antecedentes Personales Patológicos',
      subtitle: 'Enfermedades, hospitalizaciones y procedimientos médicos previos',
      icon: Hospital,
      color: 'from-red-600 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
      field: 'personalesPatologicos' as keyof AntecedentesData,
      placeholder: 'Diabetes, hipertensión, cirugías previas, hospitalizaciones, enfermedades crónicas...',
      emoji: '🏥'
    },
    {
      id: 'no-patologicos',
      title: 'Antecedentes Personales No Patológicos',
      subtitle: 'Hábitos, estilo de vida y factores de riesgo',
      icon: Heart,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      field: 'personalesNoPatologicos' as keyof AntecedentesData,
      placeholder: 'Tabaquismo, alcoholismo, drogas, actividad física, dieta, ocupación...',
      emoji: '🚭'
    },
    {
      id: 'familiares',
      title: 'Antecedentes Familiares',
      subtitle: 'Enfermedades hereditarias y patologías familiares',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      field: 'familiares' as keyof AntecedentesData,
      placeholder: 'Diabetes familiar, hipertensión, cáncer, enfermedades cardíacas, enfermedades hereditarias...',
      emoji: '👨‍👩‍👧‍👦'
    },
    {
      id: 'gineco',
      title: 'Antecedentes Gineco-Obstétricos',
      subtitle: 'Historia reproductiva y ginecológica (solo para pacientes femeninas)',
      icon: Baby,
      color: 'from-purple-600 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      field: 'ginecobstetricos' as keyof AntecedentesData,
      placeholder: 'Menarca, ciclos menstruales, embarazos, partos, cesáreas, abortos, FUM, anticonceptivos...',
      emoji: '👶'
    },
    {
      id: 'quirurgicos',
      title: 'Antecedentes Quirúrgicos',
      subtitle: 'Cirugías y procedimientos invasivos previos',
      icon: Scissors,
      color: 'from-orange-600 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200',
      field: 'quirurgicos' as keyof AntecedentesData,
      placeholder: 'Apendicectomía, colecistectomía, cesárea, fracturas, anestesias, complicaciones quirúrgicas...',
      emoji: '🔬'
    },
    {
      id: 'alergias',
      title: 'Alergias y Reacciones Adversas',
      subtitle: 'Alergias conocidas a medicamentos, alimentos y sustancias',
      icon: AlertTriangle,
      color: 'from-red-600 to-orange-600',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      field: 'alergias' as keyof AntecedentesData,
      placeholder: 'Penicilina, mariscos, látex, polen, tipo de reacción (rash, anafilaxia, etc.)...',
      emoji: '⚠️'
    },
    {
      id: 'medicamentos',
      title: 'Medicamentos Actuales',
      subtitle: 'Tratamientos farmacológicos en uso',
      icon: Pill,
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200',
      field: 'medicamentos' as keyof AntecedentesData,
      placeholder: 'Losartán 50mg c/día, Metformina 850mg c/12h, Aspirina 100mg c/día, vitaminas...',
      emoji: '💊'
    }
  ];

  return (
    <div className="p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={fadeInUp}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Hospital className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Antecedentes Médicos</h2>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Registre de manera detallada el historial médico completo del paciente. 
            Esta información es fundamental para el diagnóstico y tratamiento adecuado.
          </p>
        </motion.div>

        {/* Grid de antecedentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {antecedentesCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300`}>
                {/* Header de la tarjeta */}
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                          <span className="text-2xl">{category.emoji}</span>
                          {category.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {category.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  <div className="space-y-4">
                    <FormField
                      label=""
                      value={data[category.field]}
                      onChange={(value) => updateField(category.field, value)}
                      multiline
                      rows={6}
                      placeholder={category.placeholder}
                    />
                    
                    {/* Contador de caracteres y consejos */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {data[category.field].length} caracteres
                      </span>
                      <div className="flex items-center gap-2">
                        {data[category.field].length > 0 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium">Información registrada</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-xs font-medium">Pendiente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Resumen de completitud */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border-2 border-slate-200"
          variants={fadeInUp}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Estado de Completitud de Antecedentes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(data).filter(value => value.trim() !== '').length}
                </div>
                <div className="text-sm text-slate-600">Secciones Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {Object.values(data).filter(value => value.trim() === '').length}
                </div>
                <div className="text-sm text-slate-600">Secciones Pendientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((Object.values(data).filter(value => value.trim() !== '').length / Object.values(data).length) * 100)}%
                </div>
                <div className="text-sm text-slate-600">Progreso Total</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notas importantes */}
        <motion.div
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
          variants={fadeInUp}
          transition={{ delay: 1 }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Recordatorios Importantes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sea específico con fechas, dosis y nombres de medicamentos</li>
                <li>• Incluya reacciones adversas y alergias por más leves que parezcan</li>
                <li>• Los antecedentes familiares deben incluir parentesco y edad de diagnóstico</li>
                <li>• Para antecedentes gineco-obstétricos, incluya fechas y complicaciones</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AntecedentesForm;