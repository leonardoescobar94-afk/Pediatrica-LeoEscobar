/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { ScaleDomain, ScaleItem } from '../types';
import { getRepresentativeItem, calculateCD, getCDClassification, getClassificationColorClass } from '../utils/scaleUtils';
import { HelpCircle, Plus, Minus, ArrowRight, Check, X } from 'lucide-react';

interface ScaleDomainChartProps {
  domain: ScaleDomain;
  selectedAge: number; // Neurological age for this domain
  chronologicalAge: number;
  onAgeChange: (newAge: number) => void;
  observaciones: string;
  onObservacionesChange: (newText: string) => void;
  minAge: number;
  maxAge: number;
}

export const ScaleDomainChart: React.FC<ScaleDomainChartProps> = ({
  domain,
  selectedAge,
  chronologicalAge,
  onAgeChange,
  observaciones,
  onObservacionesChange,
  minAge,
  maxAge
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showItemNotes, setShowItemNotes] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, 'yes' | 'no' | 'none'>>(() => {
    try {
      const saved = localStorage.getItem(`checked-items-${domain.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(`checked-items-${domain.id}`, JSON.stringify(checkedItems));
  }, [checkedItems, domain.id]);

  // Hardcoded ticks of months matching ELM scale sheet
  const monthTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];

  // Map age value to percentage position (0 to 100%)
  const getPercentageForAge = (age: number) => {
    const range = maxAge - minAge;
    const clamped = Math.max(minAge, Math.min(maxAge, age));
    return ((clamped - minAge) / range) * 100;
  };

  // Map percentage position to age value
  const getAgeForPercentage = (pct: number) => {
    const range = maxAge - minAge;
    const rawValue = minAge + (pct / 100) * range;
    return Number(Math.max(minAge, Math.min(maxAge, rawValue)).toFixed(1));
  };

  // Handlers for mouse and touch drag interactions
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    onAgeChange(getAgeForPercentage(pct));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        if (e.cancelable) e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

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
            className="bg-white border border-slate-300 text-[11px] rounded px-1.5 py-1 focus:ring-1 focus:ring-slate-400 outline-none max-w-[130px] sm:max-w-[160px] font-medium"
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

      {/* CHART CONTENT */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Main Stack Container with unified grid */}
        <div className="relative border border-slate-150 rounded-lg bg-slate-50/50 p-2 sm:p-3 overflow-hidden flex flex-col">
          <div className="relative select-none flex flex-col gap-1">
            
            {/* ITEM BARS STACKED */}
            {domain.items.map((item) => {
              const startPct = getPercentageForAge(item.edad_25);
              const midPct = getPercentageForAge(item.edad_50);
              const endShadedPct = getPercentageForAge(item.edad_75);
              const endPct = getPercentageForAge(item.edad_90);

              const isLineOver = selectedAge >= item.edad_25 && selectedAge <= item.edad_90;
              const isSelected = repItem?.id === item.id;
              const status = checkedItems[item.id] || 'none';

              return (
                <div key={item.id} id={`chart-row-${item.id}`} className="relative flex flex-col">
                  <div 
                    className={`grid grid-cols-[44px_150px_1fr] sm:grid-cols-[44px_230px_1fr] md:grid-cols-[44px_280px_1fr] items-center gap-2 sm:gap-3 py-0.5 sm:py-1 px-1 sm:px-2 rounded transition-all duration-150 ${
                      isSelected 
                        ? 'bg-amber-50/80 border-l-2 border-amber-500 font-bold' 
                        : status === 'yes'
                        ? 'bg-emerald-50/40 border-l-2 border-emerald-400'
                        : status === 'no'
                        ? 'bg-rose-50/40 border-l-2 border-rose-400'
                        : isLineOver
                        ? 'bg-slate-100/50 border-l-2 border-slate-300'
                        : 'border-l-2 border-transparent hover:bg-slate-100/10'
                    }`}
                  >
                    {/* COL 1: Tri-State Checklist Selector */}
                    <div className="flex items-center gap-0.5 bg-slate-200/50 rounded p-0.5 border border-slate-300/40 shrink-0 w-[44px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckedItems(prev => ({
                            ...prev,
                            [item.id]: status === 'yes' ? 'none' : 'yes'
                          }));
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setCheckedItems(prev => ({
                            ...prev,
                            [item.id]: status === 'no' ? 'none' : 'no'
                          }));
                        }}
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
                      onClick={() => onAgeChange(item.edad_50)}
                      className="flex items-start justify-between gap-1.5 min-w-0 cursor-pointer hover:opacity-80"
                      title={`Hito: ${item.name} (Clic para fijar edad neurológica a ${item.edad_50} meses)`}
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
                              setShowItemNotes(showItemNotes === item.id ? null : item.id);
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
                    <div className="relative h-2.5 w-full bg-slate-200/40 rounded-xs overflow-hidden border border-slate-200/20">
                      
                      {/* Percentil 25 a 50 (White block) */}
                      <div 
                        style={{
                          left: `${startPct}%`,
                          width: `${midPct - startPct}%`
                        }}
                        className="absolute top-0 bottom-0 bg-white border-y border-r border-dashed border-slate-300/80"
                        title="Percentil 25 a 50"
                      />

                      {/* Percentil 50 a 75 (Striped block) */}
                      <div 
                        style={{
                          left: `${midPct}%`,
                          width: `${endShadedPct - midPct}%`
                        }}
                        className="absolute top-0 bottom-0 bg-stripe-pattern border-y border-r border-dashed border-slate-300/80"
                        title="Percentil 50 a 75"
                      />

                      {/* Percentil 75 a 90 (Black block) */}
                      <div 
                        style={{
                          left: `${endShadedPct}%`,
                          width: `${endPct - endShadedPct}%`
                        }}
                        className="absolute top-0 bottom-0 bg-slate-800"
                        title="Percentil 75 a 90"
                      />

                      {/* Inner helper markers */}
                      <div style={{ left: `${startPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-300/40" />
                      <div style={{ left: `${midPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-300/40" />
                      <div style={{ left: `${endShadedPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-300/40" />
                      <div style={{ left: `${endPct}%` }} className="absolute top-0 bottom-0 w-px bg-slate-500/40" />
                    </div>
                  </div>

                  {/* Expanded indications */}
                  {showItemNotes === item.id && item.observaciones && (
                    <div className="ml-[52px] sm:ml-[56px] mr-1 my-1 bg-amber-50 border border-amber-100 rounded p-1.5 text-[10px] text-amber-950 shadow-2xs leading-relaxed animate-fade-in italic">
                      <span className="font-bold text-amber-900 block not-italic">Indicación clínica:</span>
                      {item.observaciones}
                    </div>
                  )}
                </div>
              );
            })}

            {/* TIMELINE GRID TICK AXIS */}
            <div className="grid grid-cols-[44px_150px_1fr] sm:grid-cols-[44px_230px_1fr] md:grid-cols-[44px_280px_1fr] items-center gap-2 sm:gap-3 mt-2 pt-1.5 border-t border-slate-200 relative h-7 select-none">
              <div className="col-span-2"></div>
              <div className="relative h-full">
                {monthTicks.map((m) => {
                  const leftPos = getPercentageForAge(m);
                  return (
                    <div 
                      key={m} 
                      style={{ left: `${leftPos}%` }} 
                      className="absolute transform -translate-x-1/2 flex flex-col items-center"
                    >
                      <div className="w-px h-1 bg-slate-400"></div>
                      <span className="text-[9px] font-mono text-slate-500 font-semibold mt-0.5">
                        {m}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ABSOLUTE INTERACTIVE CONTAINER TO DRAG RED LINE */}
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="absolute top-0 bottom-7 left-[210px] sm:left-[298px] md:left-[348px] right-0 z-10 cursor-ew-resize select-none"
            >
              {/* VERTICAL RED MOVABLE LINE */}
              <div 
                style={{ left: `${getPercentageForAge(selectedAge)}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
              >
                {/* Handle Bubble */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20">
                  {selectedAge} m
                </div>
                
                {/* Lower handle anchor */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full border border-white shadow-2xs z-20"></div>
              </div>
            </div>

          </div>
        </div>

        {/* DOMAIN SUMMARY AND STATUS */}
        <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
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
                className="flex-1 text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:bg-white focus:ring-1 focus:ring-slate-300 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
