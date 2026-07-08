/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyClinicalReportButtonProps {
  reportText: string;
  onCopySuccess?: () => void;
  className?: string;
}

export const CopyClinicalReportButton: React.FC<CopyClinicalReportButtonProps> = ({
  reportText,
  onCopySuccess,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    }).catch((err) => {
      console.error('Error copying to clipboard:', err);
      alert('Error al copiar automáticamente. Por favor, seleccione el texto de la vista previa y cópielo manualmente.');
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs font-bold px-4 py-2.5 rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-xs ${
        copied 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 ring-2 ring-emerald-500/30' 
          : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
      } ${className}`}
      type="button"
      id="btn-copy-clinical-report"
    >
      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? '¡Reporte Copiado!' : 'Copiar para historia clínica'}
    </button>
  );
};
