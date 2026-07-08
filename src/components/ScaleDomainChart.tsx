/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScaleDomain, ScaleItem } from '../types';
import { getRepresentativeItem, calculateCD, getCDClassification, getClassificationColorClass } from '../utils/scaleUtils';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { DevelopmentScaleChart } from './DevelopmentScaleChart';

interface ScaleDomainChartProps {
  domain: ScaleDomain;
  scaleId: string;
  selectedAge: number; // Neurological age for this domain
  chronologicalAge: number;
  onAgeChange: (newAge: number) => void;
  observaciones: string;
  onObservacionesChange: (newText: string) => void;
  minAge: number;
  maxAge: number;
  checkedItems: Record<string, 'yes' | 'no' | 'none'>;
  onCheckedItemChange: (itemId: string, status: 'yes' | 'no' | 'none') => void;
}

export const ScaleDomainChart: React.FC<ScaleDomainChartProps> = ({
  domain,
  scaleId,
  selectedAge,
  chronologicalAge,
  onAgeChange,
  observaciones,
  onObservacionesChange,
  minAge,
  maxAge,
  checkedItems,
  onCheckedItemChange
}) => {

  // Adjustments fine-tuning (+0.5, -0.5)
  const adjustAge = (amount: number) => {
    const updated = Number((selectedAge + amount).toFixed(1));
    onAgeChange(Math.max(minAge, Math.min(maxAge, updated)));
  };

  // Dropdown manual item select handler
  const handleItemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = e.target.value;
    if (!itemId) return;
    const matched = domain.items.find(it => it.id === itemId);
    if (matched) {
      // Set to midpoint of the 50-75% segment
      const midPoint = Number(((matched.edad_50 + matched.edad_75) / 2).toFixed(1));
      onAgeChange(midPoint);
    }
  };

  const { item: repItem, percentile: repPercentile } = getRepresentativeItem(domain.items, selectedAge);
  const itemCD = calculateCD(selectedAge, chronologicalAge);
  const itemClassification = getCDClassification(itemCD);
  const colorClass = getClassificationColorClass(itemClassification);

  return (
    <div id={`domain-card-${domain.id}`} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* CARD HEADER */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0"></span>
            <span className="truncate">{domain.name}</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
            Clic en hito fija P50 • Marca ✓/✗ • Arrastra la línea roja o usa controles.
          </p>
        </div>

        {/* INPUTS AND FINE-TUNING CONTROLS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Milestone Selector */}
          <select
            id={`sel-${domain.id}`}
            className="bg-white border border-slate-300 text-[11px] rounded px-1.5 py-1 focus:ring-1 focus:ring-slate-400 outline-none max-w-[130px] sm:max-w-[160px] font-medium text-slate-700"
            value={repItem?.id || ''}
            onChange={handleItemSelect}
          >
            <option value="">-- Seleccionar --</option>
            {domain.items.map(it => (
              <option key={it.id} value={it.id}>
                {it.index}. {it.name}
              </option>
            ))}
          </select>

          {/* Age Fine Tuning */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded p-0.5">
            <button
              onClick={() => adjustAge(-0.5)}
              className="p-1 text-slate-600 hover:bg-white hover:text-slate-900 rounded transition-all"
              title="Restar 0.5 meses"
              id={`btn-minus-${domain.id}`}
              type="button"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            <input
              type="number"
              step="0.1"
              min={minAge}
              max={maxAge}
              value={selectedAge}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  onAgeChange(Math.max(minAge, Math.min(maxAge, Number(val.toFixed(1)))));
                }
              }}
              className="w-10 text-center bg-transparent border-0 text-[11px] font-bold text-slate-800 focus:ring-0 p-0"
              title="Edad estimada en meses"
              id={`input-age-${domain.id}`}
            />
            <span className="text-[9px] text-slate-500 pr-1 font-semibold font-mono">m</span>

            <button
              onClick={() => adjustAge(0.5)}
              className="p-1 text-slate-600 hover:bg-white hover:text-slate-900 rounded transition-all"
              title="Sumar 0.5 meses"
              id={`btn-plus-${domain.id}`}
              type="button"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* CHART CONTENT - Reused general chart component */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <DevelopmentScaleChart
          items={domain.items}
          scaleId={scaleId}
          selectedAge={selectedAge}
          chronologicalAge={chronologicalAge}
          onAgeChange={onAgeChange}
          minAge={minAge}
          maxAge={maxAge}
          checkedItems={checkedItems}
          onCheckedItemChange={onCheckedItemChange}
          repItemId={repItem?.id}
        />

        {/* DOMAIN SUMMARY AND STATUS */}
        <div className="mt-4 pt-3 border-t border-slate-150 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resultado del Dominio</h4>
            {repItem ? (
              <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2 flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {repItem.index}. {repItem.name} (P50: {repItem.edad_50}m)
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                    Edad Neurológica: <span className="font-bold text-slate-700">{selectedAge}m</span> • Rango: <span className="font-bold text-slate-700">{repItem.edad_25}-{repItem.edad_90}m</span> ({repPercentile})
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No hay hito seleccionado.</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between text-xs font-semibold bg-slate-50 border border-slate-200/50 rounded-lg px-2 py-1">
                <span className="text-slate-500 text-[10px]">Coeficiente:</span>
                <span className="text-slate-800 font-bold">{itemCD}%</span>
              </div>
              
              <div className={`border rounded-lg px-2 py-1 flex items-center justify-between text-[11px] font-bold ${colorClass}`}>
                <span className="opacity-80 text-[10px]">Clasificación:</span>
                <span className="uppercase tracking-wider truncate">{itemClassification}</span>
              </div>
            </div>

            {/* Observations field */}
            <div className="flex items-center gap-1.5">
              <label htmlFor={`obs-${domain.id}`} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Obs:
              </label>
              <input
                id={`obs-${domain.id}`}
                type="text"
                placeholder="Añadir observaciones para este dominio..."
                value={observaciones}
                onChange={(e) => onObservacionesChange(e.target.value)}
                className="flex-1 text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:bg-white focus:ring-1 focus:ring-slate-300 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
