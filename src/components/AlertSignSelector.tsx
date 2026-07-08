/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertSign } from '../types';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface AlertSignSelectorProps {
  alertSigns: AlertSign[];
  checkedAlerts: Record<string, boolean>;
  onChange: (alertId: string, isChecked: boolean) => void;
  chronologicalAge: number;
}

export const AlertSignSelector: React.FC<AlertSignSelectorProps> = ({
  alertSigns,
  checkedAlerts,
  onChange,
  chronologicalAge
}) => {
  if (!alertSigns || alertSigns.length === 0) return null;

  // Group alert signs by domain for easy clinical reading
  const domains: Record<string, string> = {
    general: 'Signos de Alerta Generales',
    socializacion: 'Socialización',
    lenguaje_logica_matematica: 'Lenguaje y lógica-matemática',
    manipulacion: 'Manipulación',
    postural: 'Postural'
  };

  const groupedAlerts: Record<string, AlertSign[]> = {};
  alertSigns.forEach((sign) => {
    const key = sign.domain || 'general';
    if (!groupedAlerts[key]) {
      groupedAlerts[key] = [];
    }
    groupedAlerts[key].push(sign);
  });

  const totalChecked = Object.values(checkedAlerts).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4" id="alert-signs-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">
              Signos de Alerta Clínica (Haizea-Llevant)
            </h3>
            <p className="text-[11px] text-slate-500">
              Seleccione los signos observados. Tienen relevancia según la edad del paciente.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {totalChecked > 0 ? (
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-orange-200 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              {totalChecked} Presente{totalChecked > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ninguno observado
            </span>
          )}
        </div>
      </div>

      {/* Grid of Grouped Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(Object.entries(groupedAlerts) as Array<[string, AlertSign[]]>).map(([domainKey, signs]) => (
          <div key={domainKey} className="space-y-2 border border-slate-100 rounded-lg p-3 bg-slate-50/40">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
              {domains[domainKey] || domainKey}
            </h4>
            
            <div className="space-y-2">
              {signs.map((sign) => {
                const isChecked = !!checkedAlerts[sign.id];
                
                // Check if sign is currently age-relevant
                let ageRelevant = true;
                if (sign.appliesFromAge !== undefined && chronologicalAge < sign.appliesFromAge) {
                  ageRelevant = false;
                }
                if (sign.startAge !== undefined && sign.endAge !== undefined) {
                  if (chronologicalAge < sign.startAge || chronologicalAge > sign.endAge) {
                    ageRelevant = false;
                  }
                }

                return (
                  <div 
                    key={sign.id} 
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all ${
                      isChecked 
                        ? 'bg-orange-50/75 border-orange-300 shadow-2xs' 
                        : !ageRelevant
                        ? 'opacity-50 hover:opacity-75 bg-slate-100/50 border-slate-200'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`chk-alert-${sign.id}`}
                      checked={isChecked}
                      onChange={(e) => onChange(sign.id, e.target.checked)}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 h-3.5 w-3.5 cursor-pointer accent-orange-600"
                    />
                    <div className="min-w-0 flex-1">
                      <label 
                        htmlFor={`chk-alert-${sign.id}`}
                        className={`text-xs font-bold block cursor-pointer select-none leading-snug ${
                          isChecked ? 'text-orange-950' : 'text-slate-800'
                        }`}
                      >
                        {sign.label}
                      </label>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                        {sign.notes}
                      </p>
                      
                      {/* Age validity label */}
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        {sign.alwaysRelevant ? (
                          <span className="text-[8px] bg-slate-100 text-slate-600 border border-slate-200 rounded px-1 py-0.2 font-mono font-semibold">
                            Cualquier edad
                          </span>
                        ) : sign.appliesFromAge !== undefined ? (
                          <span className={`text-[8px] border rounded px-1 py-0.2 font-mono font-semibold ${
                            chronologicalAge >= sign.appliesFromAge
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            Aplica desde ≥ {sign.appliesFromAge} meses
                          </span>
                        ) : sign.startAge !== undefined && sign.endAge !== undefined ? (
                          <span className={`text-[8px] border rounded px-1 py-0.2 font-mono font-semibold ${
                            ageRelevant
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            Aplica entre {sign.startAge}-{sign.endAge} meses
                          </span>
                        ) : null}

                        {isChecked && (
                          <span className="text-[8px] bg-rose-600 text-white font-bold rounded px-1 py-0.2 animate-pulse">
                            ¡PRESENTE!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {totalChecked > 0 && (
        <div className="bg-orange-50 border border-orange-200 text-orange-900 rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <strong>Recomendación Clínica:</strong> Se identifican signos de alerta del desarrollo marcados como presentes. Esto requiere evaluación clínica cuidadosa, anamnesis detallada y seguimiento evolutivo personalizado.
          </div>
        </div>
      )}
    </div>
  );
};
