/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DomainResult } from '../types';
import { getClassificationColorClass } from '../utils/scaleUtils';
import { Activity, HelpCircle, ArrowRight } from 'lucide-react';

interface DomainResultCardProps {
  result: DomainResult;
}

export const DomainResultCard: React.FC<DomainResultCardProps> = ({ result }) => {
  const badgeClass = getClassificationColorClass(result.classification);

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4.5 space-y-3.5 shadow-2xs transition-all flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-slate-500" />
          {result.domainName}
        </span>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeClass}`}>
          {result.classification.split(' / ')[0]}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
        <div>
          <span className="text-[10px] text-slate-500 font-semibold block uppercase">Edad Estimada</span>
          <span className="text-lg font-bold text-slate-800">{result.neurologicalAge}</span>
          <span className="text-[10px] text-slate-400 font-semibold ml-0.5">meses</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-semibold block uppercase">Coeficiente</span>
          <span className="text-lg font-bold text-slate-800">{result.cd}%</span>
        </div>
      </div>

      {/* Representative Milestone */}
      {result.representativeItem ? (
        <div className="text-xs space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Hito Clínico Representativo:</span>
          <div className="flex items-start gap-1 text-slate-700 leading-normal bg-slate-50/50 p-2 rounded border border-slate-100">
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-800 font-mono text-[11px] bg-slate-100 px-1 py-0.2 rounded mr-1">
                {result.representativeItem.index}
              </span>
              <span className="font-semibold">{result.representativeItem.name}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Rango habitual: {result.representativeItem.edad_25} - {result.representativeItem.edad_90}m (P50: {result.representativeItem.edad_50}m)
              </p>
              <p className="text-[9px] text-indigo-600 font-semibold mt-0.5 uppercase tracking-wider">
                Ubicación: Hito en rango {result.representativePercentile}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400 italic">No se identifica hito representativo.</div>
      )}

      {/* Observations */}
      {result.observaciones?.trim() && (
        <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-2 bg-amber-50/40 p-2 rounded leading-relaxed">
          <strong>Observaciones:</strong> {result.observaciones.trim()}
        </div>
      )}
    </div>
  );
};
