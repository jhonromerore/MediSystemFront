// Archivo: src/components/QRCodeGenerator.tsx (VERSIÓN SIMPLIFICADA)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QRCode from "react-qr-code";
import { Download, Copy, Check, QrCode as QrCodeIcon } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  title?: string;
  description?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 168,
  title = "Código QR del Paciente",
  description = "Escanee para acceder a la información"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleDownload = () => {
    // Crear un canvas para convertir el SVG a imagen
    const svg = document.querySelector(`#qr-code-${value.replace(/\s+/g, '-')}`) as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = size + 32;
      canvas.height = size + 32;
      
      if (ctx) {
        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        img.onload = () => {
          ctx.drawImage(img, 16, 16, size, size);
          
          const link = document.createElement('a');
          link.download = `qr-paciente-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-sm mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      {/* Contenedor del QR */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <QrCodeIcon className="w-5 h-5 text-blue-600" />
            {title}
          </div>
          <p className="text-sm text-slate-500">{description}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <QRCode
              id={`qr-code-${value.replace(/\s+/g, '-')}`}
              value={value}
              size={size}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          </div>
        </div>

        {/* Información del código */}
        <div className="text-center mb-4">
          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-lg inline-block font-mono">
            {value}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 justify-center">
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Descargar
          </motion.button>
        </div>
      </div>

      {/* Indicador de estado */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full shadow-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default QRCodeGenerator;