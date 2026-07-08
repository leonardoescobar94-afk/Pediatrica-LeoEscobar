/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScaleItem } from '../types';
import { Check, X, HelpCircle } from 'lucide-react';

interface MilestoneBarProps {
  item: ScaleItem;
  scaleId: string;
  selectedAge: number;
  chronologicalAge: number;
  getPercentageForAge: (age: number) => number;
  onAgeChange: (age: number) => void;
  isSelected: boolean;
  status: 'yes' | 'no' | 'none';
  onStatusChange: (status: 'yes' | 'no' | 'none') => void;
}

export const MilestoneBar: React.FC<MilestoneBarProps> = ({
  item,
  scaleId,
  selectedAge,
  chronologicalAge,
  getPercentageForAge,
  onAgeChange,
  isSelected,
  status,
  onStatusChange,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  const isHL = scaleId === 'haizea-llevant';

  // Get percentage bounds
  const p25 = item.edad_25;
  const p50 = item.edad_50;
  const p75 = item.edad_75;
  const p95 = item.edad_90; // in our mapping edad_90 represents P95 for Haizea-Llevant

  const startPct = getPercentageForAge(p25);
  const midPct = getPercentageForAge(p50);
  const endShadedPct = getPercentageForAge(p75);
  const endPct = getPercentageForAge(p95);

  const isLineOver = selectedAge >= p25 && selectedAge <= p95;

  // Determine if it is a "Hito no adquirido después del P95"
  const isOverP95Warning = status === 'no' && chronologicalAge > p95;

  return (
    <div className="relative flex flex-col w-full">
      <div 
        className={`grid grid-cols-[44px_150px_1fr] sm:grid-cols-[44px_230px_1fr] md:grid-cols-[44px_280px_1fr] items-center gap-2 sm:gap-3 py-1 px-1.5 sm:px-2 rounded border-l-2 transition-all duration-150 ${
          isSelected 
            ? 'bg-amber-50/80 border-amber-500 font-bold' 
            : status === 'yes'
            ? 'bg-emerald-50/40 border-emerald-400'
            : isOverP95Warning
            ? 'bg-rose-50/90 border-rose-500 animate-pulse'
            : status === 'no'
            ? 'bg-rose-50/30 border-rose-300'
            : isLineOver
            ? 'bg-slate-100/50 border-slate-300'
            : 'border-transparent hover:bg-slate-100/10'
        }`}
      >
        {/* COL 1: Tri-State Checklist Selector */}
        <div className="flex items-center gap-0.5 bg-slate-200/50 rounded p-0.5 border border-slate-300/40 shrink-0 w-[44px]">
          <button
            onClick={() => onStatusChange(status === 'yes' ? 'none' : 'yes')}
            className={`p-0.5 rounded transition-all ${
              status === 'yes' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-emerald-600 hover:bg-white'
            }`}
            title="Logrado"
            id={`chk-yes-${item.id}`}
            type="button"
          >
            <Check className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => onStatusChange(status === 'no' ? 'none' : 'no')}
            className={`p-0.5 rounded transition-all ${
              status === 'no' 
                ? 'bg-rose-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-rose-600 hover:bg-white'
            }`}
            title="No logrado"
            id={`chk-no-${item.id}`}
            type="button"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* COL 2: Name & Index (Clicking here sets neurological age to this item's P50) */}
        <div 
          onClick={() => onAgeChange(p50)}
          className="flex items-start justify-between gap-1.5 min-w-0 cursor-pointer hover:opacity-80"
          title={`Hito: ${item.name} (Clic para fijar edad neurológica a ${p50} meses)`}
        >
          <div className="flex items-start gap-1.5 min-w-0 flex-1">
            <span className="text-[9px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-sm font-bold shrink-0 mt-0.5">
              {item.index}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-800 font-semibold leading-tight whitespace-normal break-words">
              {item.name}
            </span>
            {item.aproximado && (
              <span className="text-[8px] text-amber-600 bg-amber-50 px-0.5 rounded border border-amber-100 shrink-0 font-medium mt-0.5">
                aprox.
              </span>
            )}
            {isOverP95Warning && (
              <span className="text-[8px] text-rose-700 bg-rose-100 px-1 rounded border border-rose-300 font-bold shrink-0 mt-0.5 animate-pulse">
                &gt; P95 ALERTA
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-0.5 shrink-0">
            {item.metodo && (
              <span className="text-[8px] text-slate-400 font-bold px-0.5 py-0.2 rounded bg-slate-100 border border-slate-200">
                {item.metodo}
              </span>
            )}
            {item.observaciones && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotes(!showNotes);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Ver indicación clínica"
                type="button"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* COL 3: Horizontal Percentile Bar */}
        <div 
          className="relative h-3 w-full bg-slate-100 rounded-xs overflow-hidden border border-slate-200/50 group"
          title={`P50: ${p50}m | P75: ${p75}m | P95: ${p95}m${item.aproximado ? ' (Valor aproximado)' : ''}`}
        >
          {isHL ? (
            /* HAIZEA-LLEVANT STYLE: Green segment (P50 to P75), Blue segment (P75 to P95) */
            <>
              {/* Green: P50 to P75 */}
              <div 
                style={{
                  left: `${midPct}%`,
                  width: `${endShadedPct - midPct}%`
                }}
                className="absolute top-0 bottom-0 bg-emerald-500 hover:bg-emerald-600 transition-colors"
                title="Verde: adquisición 50-75%"
              />

              {/* Blue: P75 to P95 */}
              <div 
                style={{
                  left: `${endShadedPct}%`,
                  width: `${endPct - endShadedPct}%`
                }}
                className="absolute top-0 bottom-0 bg-sky-500 hover:bg-sky-600 transition-colors"
                title="Azul: adquisición 75-95%"
              />
            </>
          ) : (
            /* ELM STYLE: White (P25 to P50), Striped (P50 to P75), Dark (P75 to P90) */
            <>
              {/* White Block: P25 to P50 */}
              <div 
                style={{
                  left: `${startPct}%`,
                  width: `${midPct - startPct}%`
                }}
                className="absolute top-0 bottom-0 bg-white border-y border-r border-dashed border-slate-300/80"
              />

              {/* Striped Block: P50 to P75 */}
              <div 
                style={{
                  left: `${midPct}%`,
                  width: `${endShadedPct - midPct}%`
                }}
                className="absolute top-0 bottom-0 bg-stripe-pattern border-y border-r border-dashed border-slate-300/80"
              />

              {/* Dark Block: P75 to P90 */}
              <div 
                style={{
                  left: `${endShadedPct}%`,
                  width: `${endPct - endShadedPct}%`
                }}
                className="absolute top-0 bottom-0 bg-slate-800"
              />
            </>
          )}

          {/* Inner helper thin vertical lines */}
          <div style={{ left: `${startPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-300/20" />
          <div style={{ left: `${midPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-300/20" />
          <div style={{ left: `${endShadedPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-300/20" />
          <div style={{ left: `${endPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-500/20" />
        </div>
      </div>

      {/* Expanded indications */}
      {showNotes && item.observaciones && (
        <div className="ml-[52px] sm:ml-[56px] mr-1 my-1 bg-amber-50 border border-amber-100 rounded p-1.5 text-[10px] text-amber-950 shadow-2xs leading-relaxed animate-fade-in italic">
          <span className="font-bold text-amber-900 block not-italic">Indicación clínica:</span>
          {item.observaciones}
        </div>
      )}
    </div>
  );
};
