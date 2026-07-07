/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Scale, GlobalResult } from './types';
import { INITIAL_SCALES, DEFAULT_ELM_SCALE } from './data/defaultScales';
import { ScaleDomainChart } from './components/ScaleDomainChart';
import { ScaleEditor } from './components/ScaleEditor';
import { 
  calculateGlobalResult, 
  generateClinicalReportText, 
  getCDClassification, 
  getClassificationColorClass 
} from './utils/scaleUtils';
import { 
  Stethoscope, 
  Calendar, 
  Activity, 
  Copy, 
  Trash2, 
  RefreshCw, 
  Sliders, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown, 
  User, 
  FileText 
} from 'lucide-react';

export default function App() {
  // --- APPLICATION STATE ---
  const [scales, setScales] = useState<Scale[]>([]);
  const [selectedScaleId, setSelectedScaleId] = useState<string>('elm-scale');
  
  // Clinical metadata inputs
  const [patientId, setPatientId] = useState<string>(''); // Optional patient identifier
  const [evaluationDate, setEvaluationDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [birthDate, setBirthDate] = useState<string>('');
  const [chronologicalAgeInput, setChronologicalAgeInput] = useState<string>('');
  const [chronologicalAge, setChronologicalAge] = useState<number>(12); // default 12m

  // Neurological ages per domain (indexed by domainId)
  const [neurologicalAges, setNeurologicalAges] = useState<Record<string, number>>({});
  const [domainObservaciones, setDomainObservaciones] = useState<Record<string, string>>({});

  // Global calculations
  const [globalResult, setGlobalResult] = useState<GlobalResult | null>(null);

  // UI state toggles
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [ageWarning, setAgeWarning] = useState<string | null>(null);

  // Active scale getter
  const activeScale = scales.find(s => s.id === selectedScaleId) || DEFAULT_ELM_SCALE;

  // --- INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
    // Load scales database from localStorage
    const stored = localStorage.getItem('pediatric_developmental_scales');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScales(parsed);
          return;
        }
      } catch (e) {
        console.error('Error loading scales from localStorage', e);
      }
    }
    // Fallback to default
    setScales(INITIAL_SCALES);
    localStorage.setItem('pediatric_developmental_scales', JSON.stringify(INITIAL_SCALES));
  }, []);

  // Save scales to localStorage when they change
  const saveScalesToDb = (updatedScales: Scale[]) => {
    setScales(updatedScales);
    localStorage.setItem('pediatric_developmental_scales', JSON.stringify(updatedScales));
  };

  // Whenever activeScale or chronologicalAge changes, reset domain neurological ages
  useEffect(() => {
    if (!activeScale) return;
    
    const initialAges: Record<string, number> = {};
    const initialObs: Record<string, string> = {};

    activeScale.domains.forEach(dom => {
      // Default domain neurological age to match chronological age (within bounds)
      const clamped = Math.max(activeScale.minAgeMonths, Math.min(activeScale.maxAgeMonths, chronologicalAge));
      initialAges[dom.id] = Number(clamped.toFixed(1));
      initialObs[dom.id] = '';
    });

    setNeurologicalAges(initialAges);
    setDomainObservaciones(initialObs);
  }, [selectedScaleId, chronologicalAge]);

  // Calculate age when dates change
  useEffect(() => {
    if (birthDate && evaluationDate) {
      const birth = new Date(birthDate);
      const evalD = new Date(evaluationDate);
      const diffTime = evalD.getTime() - birth.getTime();
      
      if (diffTime < 0) {
        setAgeWarning('La fecha de nacimiento no puede ser posterior a la fecha de evaluación.');
        return;
      }

      // Exact continuous calculation of months: total days divided by mean month length (30.4375)
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      const calculatedMonths = Number((diffDays / 30.4375).toFixed(1));
      
      setAgeWarning(null);
      setChronologicalAgeInput(calculatedMonths.toString());
      triggerAgeAssessment(calculatedMonths);
    }
  }, [birthDate, evaluationDate]);

  // Handle direct manual age input changes
  const handleManualAgeChange = (val: string) => {
    setChronologicalAgeInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      triggerAgeAssessment(parsed);
    }
  };

  // Perform check/warnings on selected age
  const triggerAgeAssessment = (age: number) => {
    setChronologicalAge(age);

    if (age <= 0) {
      setAgeWarning('La edad cronológica debe ser mayor a 0 meses.');
    } else if (age < 1) {
      setAgeWarning('Nota: La edad ingresada es menor de 1 mes (petición de confirmación de edad neonatal).');
    } else if (age > 36) {
      setAgeWarning('ELM está diseñada principalmente para 0 a 36 meses; interpretar con cautela.');
    } else {
      setAgeWarning(null);
    }
  };

  // --- TRIGGER CALCULATIONS ---
  const handleCalculate = () => {
    if (chronologicalAge <= 0) {
      alert('Por favor ingrese una edad cronológica válida mayor a 0 meses.');
      return;
    }
    const result = calculateGlobalResult(
      activeScale,
      chronologicalAge,
      neurologicalAges,
      domainObservaciones
    );
    setGlobalResult(result);

    // Auto-copy report preview text to clipboard as requested
    const reportText = generateClinicalReportText(
      activeScale.name,
      evaluationDate,
      chronologicalAge,
      result
    );

    navigator.clipboard.writeText(reportText).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 3000);
    }).catch((err) => {
      console.error('Error auto-copying to clipboard:', err);
    });
  };

  // Recalculate global results in real-time as neurological ages or observations change
  useEffect(() => {
    if (chronologicalAge > 0 && Object.keys(neurologicalAges).length > 0) {
      const result = calculateGlobalResult(
        activeScale,
        chronologicalAge,
        neurologicalAges,
        domainObservaciones
      );
      setGlobalResult(result);
    }
  }, [neurologicalAges, chronologicalAge, domainObservaciones, selectedScaleId]);

  // Clear Form Fields
  const handleClearForm = () => {
    setBirthDate('');
    setPatientId('');
    setChronologicalAgeInput('12');
    setChronologicalAge(12);
    setAgeWarning(null);
    
    const today = new Date().toISOString().split('T')[0];
    setEvaluationDate(today);

    // Reset domain ages to 12
    const resetAges: Record<string, number> = {};
    const resetObs: Record<string, string> = {};
    activeScale.domains.forEach(dom => {
      resetAges[dom.id] = 12;
      resetObs[dom.id] = '';
    });
    setNeurologicalAges(resetAges);
    setDomainObservaciones(resetObs);
    setGlobalResult(null);
  };

  // --- SCALE DB MANIPULATIONS ---
  const handleSaveScale = (updated: Scale) => {
    const updatedScales = scales.map(sc => sc.id === updated.id ? updated : sc);
    saveScalesToDb(updatedScales);
  };

  const handleAddScale = (newScale: Scale) => {
    if (scales.some(sc => sc.id === newScale.id)) {
      alert('Ya existe una escala con este ID.');
      return;
    }
    const updatedScales = [...scales, newScale];
    saveScalesToDb(updatedScales);
    setSelectedScaleId(newScale.id);
  };

  const handleDeleteScale = (scaleId: string) => {
    if (scaleId === 'elm-scale') {
      alert('La escala ELM es de fábrica y no puede eliminarse.');
      return;
    }
    const updatedScales = scales.filter(sc => sc.id !== scaleId);
    saveScalesToDb(updatedScales);
    setSelectedScaleId('elm-scale');
  };

  const handleRestoreOriginals = () => {
    if (confirm('¿Deseas restaurar la escala original de fábrica? Perderás cualquier cambio de calibración realizado sobre ella.')) {
      const factoryScales = scales.map(sc => {
        if (sc.id === 'elm-scale') {
          return { ...DEFAULT_ELM_SCALE };
        }
        return sc;
      });
      saveScalesToDb(factoryScales);
      alert('Valores preestablecidos de fábrica restaurados.');
    }
  };

  // --- COPY REPORT TO CLINICAL RECORDS ---
  const handleCopyReport = () => {
    if (!globalResult) return;
    const reportText = generateClinicalReportText(
      activeScale.name,
      evaluationDate,
      chronologicalAge,
      globalResult
    );

    navigator.clipboard.writeText(reportText).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2500);
    }).catch((err) => {
      console.error('No se pudo copiar el texto', err);
      alert('Ocurrió un error al intentar copiar. Por favor, selecciona y copia manualmente el reporte clínico de la parte inferior.');
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-slate-200 selection:text-slate-900 pb-16">
      
      {/* PROFESSIONAL CLINICAL TITLE HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 text-white p-2 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-slate-950 tracking-tight leading-tight">
                Pediatría - Escalas del Desarrollo
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Módulo Clínico de Evaluación Modular
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-2xs border ${
                showEditor 
                  ? 'bg-slate-950 text-white border-slate-950' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              id="btn-toggle-editor"
            >
              <Settings className="w-3.5 h-3.5" />
              {showEditor ? 'Vista Operativa' : 'Calibración / JSON'}
            </button>
          </div>
        </div>
      </header>

      {/* BODY WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* MODULAR EDITOR ACCORDION IF TOGGLED */}
        {showEditor && (
          <div className="animate-fade-in">
            <ScaleEditor
              currentScale={activeScale}
              allScales={scales}
              onSelectScale={setSelectedScaleId}
              onSaveScale={handleSaveScale}
              onDeleteScale={handleDeleteScale}
              onAddScale={handleAddScale}
              onRestoreOriginals={handleRestoreOriginals}
            />
          </div>
        )}

        {/* TOP CONFIGURATION PANEL */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <div>
                <h2 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-700">
                  1. Configuración de la Evaluación y Datos del Paciente
                </h2>
                <p className="text-[11px] text-slate-500">
                  Configure los parámetros iniciales, fechas e identificación del paciente.
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={handleCalculate}
                className={`font-semibold py-1.5 px-3 rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5 ${
                  copyStatus 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500 ring-offset-1' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
                id="btn-calculate"
                type="button"
              >
                <Activity className="w-3.5 h-3.5" />
                {copyStatus ? '¡Calculado y Copiado!' : 'Calcular Coeficiente'}
              </button>
              
              <button
                onClick={handleClearForm}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold py-1.5 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                id="btn-clear"
                type="button"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Limpiar
              </button>
            </div>
          </div>

          {/* GRID OF INPUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            
            {/* 1. Tipo de Escala */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="scale-select-main">
                Escala de Evaluación:
              </label>
              <select
                id="scale-select-main"
                value={selectedScaleId}
                onChange={(e) => setSelectedScaleId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-slate-400 outline-none shadow-2xs"
              >
                {scales.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Identificación del Paciente */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="patient-id">
                Identificación Paciente:
              </label>
              <input
                id="patient-id"
                type="text"
                placeholder="Iniciales o ID..."
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none"
              />
            </div>

            {/* 3. Fecha de Evaluación */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="evaluation-date">
                Fecha de Evaluación:
              </label>
              <div className="relative">
                <input
                  id="evaluation-date"
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded pl-8 pr-2 py-1.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* 4. Fecha de Nacimiento */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="birth-date">
                Fecha de Nacimiento:
              </label>
              <div className="relative">
                <input
                  id="birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded pl-8 pr-2 py-1.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* 5. Edad Cronológica */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block" htmlFor="chronological-age-input">
                Edad Cronológica:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="chronological-age-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Ej. 12"
                  value={chronologicalAgeInput}
                  onChange={(e) => handleManualAgeChange(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-slate-400 outline-none font-bold"
                />
                <span className="text-[11px] font-semibold text-slate-500 shrink-0">meses</span>
              </div>
            </div>

          </div>

          {/* COMPACT WARNINGS ROW */}
          {(ageWarning || !patientId) && (
            <div className="mt-3 flex flex-col md:flex-row gap-3">
              {ageWarning && (
                <div className="flex-1 bg-amber-50 border border-amber-200/70 text-amber-800 rounded p-2 text-[10px] flex items-start gap-1.5 leading-normal">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{ageWarning}</span>
                </div>
              )}
              {!patientId && (
                <div className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 rounded p-2 text-[10px] flex items-start gap-1.5 leading-normal">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Evite registrar nombres completos u otros identificadores sensibles para cumplimiento de protección de datos (HIPAA/GDPR).</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ACTIVE SCALE INTERACTIVE RAIL MAP */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-700">
                2. Evaluación de Dominios
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-bold">
              {activeScale.domains.length} Dominios
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {activeScale.domains.map((domain) => (
              <ScaleDomainChart
                key={domain.id}
                domain={domain}
                selectedAge={neurologicalAges[domain.id] || 12}
                chronologicalAge={chronologicalAge}
                onAgeChange={(newAge) => {
                  setNeurologicalAges(prev => ({
                    ...prev,
                    [domain.id]: newAge
                  }));
                }}
                observaciones={domainObservaciones[domain.id] || ''}
                onObservacionesChange={(newText) => {
                  setDomainObservaciones(prev => ({
                    ...prev,
                    [domain.id]: newText
                  }));
                }}
                minAge={activeScale.minAgeMonths}
                maxAge={activeScale.maxAgeMonths}
              />
            ))}
          </div>
        </div>

        {/* CLINICAL SUMMARY & CLIPBOARD COPY REPORT */}
        {globalResult && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6 animate-fade-in" id="results-panel">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-600" />
                <div>
                  <h2 className="font-display font-bold text-base text-slate-900">
                    3. Reporte de Resultados y Coeficiente de Desarrollo
                  </h2>
                  <p className="text-xs text-slate-500">
                    Resumen global del paciente obtenido a partir del promedio de dominios evaluados.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyReport}
                className={`text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-xs ${
                  copyStatus 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
                id="btn-copy-clinical"
              >
                {copyStatus ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copyStatus ? '¡Copiado!' : 'Copiar para historia clínica'}
              </button>
            </div>

            {/* RESULTS METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Edad Cronológica</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-slate-800">{chronologicalAge}</span>
                  <span className="text-xs text-slate-500 font-semibold">meses</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Edad Neurológica Global</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-slate-800">{globalResult.globalNeurologicalAge}</span>
                  <span className="text-xs text-slate-500 font-semibold">meses</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">CD Global</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getClassificationColorClass(globalResult.globalClassification)}`}>
                    {globalResult.globalClassification.split(' / ')[0]}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-slate-800">{globalResult.globalCd}%</span>
                </div>
              </div>
            </div>

            {/* GLOBAL CLASSIFICATION EXPLAINER BANNER */}
            <div className={`border p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed ${getClassificationColorClass(globalResult.globalClassification)}`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wide block mb-1">Clasificación Global: {globalResult.globalClassification}</span>
                El Coeficiente de Desarrollo (CD) global promedio es de <strong>{globalResult.globalCd}%</strong>. 
                {globalResult.globalCd >= 85 ? (
                  <span> Indica un ritmo de desarrollo normal para su edad cronológica en las áreas examinadas.</span>
                ) : globalResult.globalCd >= 65 ? (
                  <span> Indica un rezago o retraso leve en las adquisiciones del desarrollo. Requiere estimulación focalizada y seguimiento clínico periódico.</span>
                ) : globalResult.globalCd >= 51 ? (
                  <span> Indica un retraso moderado. Se recomienda una evaluación multidisciplinaria detallada y el inicio de terapia oportuna.</span>
                ) : (
                  <span> Indica un retraso severo en los hitos del desarrollo evaluados. Requiere derivación inmediata a neurología pediátrica y evaluación diagnóstica integral de alta prioridad.</span>
                )}
              </div>
            </div>

            {/* TABLE COMPARISON DOMAINS */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Área / Dominio</th>
                    <th className="p-3 font-semibold">Hito Representativo</th>
                    <th className="p-3 font-semibold w-28">Edad Estimada</th>
                    <th className="p-3 font-semibold w-24">CD</th>
                    <th className="p-3 font-semibold w-32">Clasificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {globalResult.domainResults.map((dr) => {
                    const badgeClass = getClassificationColorClass(dr.classification);
                    return (
                      <tr key={dr.domainId} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">{dr.domainName}</td>
                        <td className="p-3">
                          {dr.representativeItem ? (
                            <div>
                              <span className="font-bold text-slate-700">{dr.representativeItem.index}. {dr.representativeItem.name}</span>
                              <span className="text-[10px] text-slate-500 block">Percentil: {dr.representativePercentile}</span>
                            </div>
                          ) : (
                            <span className="italic text-slate-400">N/A</span>
                          )}
                        </td>
                        <td className="p-3 font-semibold font-mono text-slate-700">{dr.neurologicalAge} meses</td>
                        <td className="p-3 font-semibold font-mono text-slate-700">{dr.cd}%</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider block text-center ${badgeClass}`}>
                            {dr.classification.split(' / ')[0]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PLAIN COPIABLE REPORT TEXTAREA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block" htmlFor="report-textarea">
                  Vista Previa del Texto Copiable:
                </label>
                <span className="text-[10px] text-slate-400 italic">Formato óptimo estructurado para pegar en historia clínica</span>
              </div>
              <textarea
                id="report-textarea"
                readOnly
                value={generateClinicalReportText(activeScale.name, evaluationDate, chronologicalAge, globalResult)}
                className="w-full h-48 font-mono text-xs bg-slate-50 text-slate-700 border border-slate-300 rounded-xl p-4.5 focus:outline-none custom-scrollbar select-all"
              />
            </div>
          </div>
        )}

      </main>

      {/* FOOTER ACCREDITATIONS & METHODOLOGY */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p><strong>Early Language Milestones (ELM) Evaluation System</strong></p>
            <p className="mt-1">
              Desarrollado bajo pautas metodológicas clínicas de pediatría y fonoaudiología. Referencia: James Coplan, M.D.
            </p>
          </div>
          <div className="flex gap-4">
            <span>Privacidad: Los datos de evaluación no se transmiten al servidor y permanecen localmente en el navegador.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
