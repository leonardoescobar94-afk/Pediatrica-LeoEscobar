/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { ScaleItem } from '../types';
import { MilestoneBar } from './MilestoneBar';

interface DevelopmentScaleChartProps {
  items: ScaleItem[];
  scaleId: string;
  selectedAge: number;
  chronologicalAge: number;
  onAgeChange: (newAge: number) => void;
  minAge: number;
  maxAge: number;
  checkedItems: Record<string, 'yes' | 'no' | 'none'>;
  onCheckedItemChange: (itemId: string, status: 'yes' | 'no' | 'none') => void;
  repItemId?: string;
}

export const DevelopmentScaleChart: React.FC<DevelopmentScaleChartProps> = ({
  items,
  scaleId,
  selectedAge,
  chronologicalAge,
  onAgeChange,
  minAge,
  maxAge,
  checkedItems,
  onCheckedItemChange,
  repItemId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic Month Ticks based on scale limits and guidelines
  const monthTicks = React.useMemo(() => {
    if (scaleId === 'haizea-llevant') {
      // "Rango visual recomendado: 0 a 60 meses. Mostrar marcas principales cada 2 meses."
      const ticks: number[] = [];
      for (let i = 0; i <= 60; i += 2) {
        ticks.push(i);
      }
      return ticks;
    } else {
      // Default ELM ticks
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
    }
  }, [scaleId]);

  // Secondary tick marks (every 1 month for HL)
  const secondaryTicks = React.useMemo(() => {
    if (scaleId === 'haizea-llevant') {
      const ticks: number[] = [];
      for (let i = 0; i <= 60; i++) {
        if (i % 2 !== 0) {
          ticks.push(i);
        }
      }
      return ticks;
    }
    return [];
  }, [scaleId]);

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

  // Drag interaction handlers
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    onAgeChange(getAgeForPercentage(pct));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on buttons or checklist, don't drag
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
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

  return (
    <div className="relative border border-slate-150 rounded-lg bg-slate-50/50 p-2 sm:p-3 overflow-x-auto custom-scrollbar flex flex-col min-w-full">
      {/* Scrollable container content */}
      <div className="relative select-none flex flex-col gap-1 min-w-[550px] sm:min-w-[700px] md:min-w-[850px] lg:min-w-0 pr-1">
        
        {/* ITEM BARS STACKED */}
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const isSelected = repItemId === item.id;
            const status = checkedItems[item.id] || 'none';

            return (
              <MilestoneBar
                key={item.id}
                item={item}
                scaleId={scaleId}
                selectedAge={selectedAge}
                chronologicalAge={chronologicalAge}
                getPercentageForAge={getPercentageForAge}
                onAgeChange={onAgeChange}
                isSelected={isSelected}
                status={status}
                onStatusChange={(newStatus) => onCheckedItemChange(item.id, newStatus)}
              />
            );
          })}
        </div>

        {/* TIMELINE GRID TICK AXIS */}
        <div className="grid grid-cols-[44px_150px_1fr] sm:grid-cols-[44px_230px_1fr] md:grid-cols-[44px_280px_1fr] items-center gap-2 sm:gap-3 mt-3 pt-2 border-t border-slate-200 relative h-8 select-none">
          <div className="col-span-2"></div>
          <div className="relative h-full">
            {/* Secondary Ticks (shorter lines, no labels, every 1 month for HL) */}
            {secondaryTicks.map((m) => {
              const leftPos = getPercentageForAge(m);
              return (
                <div 
                  key={`sec-${m}`} 
                  style={{ left: `${leftPos}%` }} 
                  className="absolute transform -translate-x-1/2 flex flex-col items-center"
                >
                  <div className="w-px h-1 bg-slate-300"></div>
                </div>
              );
            })}

            {/* Main Ticks */}
            {monthTicks.map((m) => {
              const leftPos = getPercentageForAge(m);
              return (
                <div 
                  key={`main-${m}`} 
                  style={{ left: `${leftPos}%` }} 
                  className="absolute transform -translate-x-1/2 flex flex-col items-center"
                >
                  <div className="w-px h-1.5 bg-slate-500"></div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold mt-1">
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
          className="absolute top-0 bottom-8 left-[210px] sm:left-[298px] md:left-[348px] right-0 z-10 cursor-ew-resize select-none"
        >
          {/* VERTICAL RED MOVABLE LINE */}
          <div 
            style={{ left: `${getPercentageForAge(selectedAge)}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 pointer-events-none z-10 shadow-xs"
          >
            {/* Handle Bubble */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4.5 bg-rose-600 text-white font-mono text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 flex items-center gap-1 border border-rose-500">
              <span>{selectedAge} m</span>
            </div>
            
            {/* Lower handle anchor */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-white shadow-xs z-20"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
