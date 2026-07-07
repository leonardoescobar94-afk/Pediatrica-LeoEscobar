/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scale, ScaleItem } from '../types';
import { Download, Upload, RefreshCw, Save, Plus, FileCode, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

interface ScaleEditorProps {
  currentScale: Scale;
  allScales: Scale[];
  onSelectScale: (scaleId: string) => void;
  onSaveScale: (updated: Scale) => void;
  onDeleteScale: (scaleId: string) => void;
  onAddScale: (newScale: Scale) => void;
  onRestoreOriginals: () => void;
}

export const ScaleEditor: React.FC<ScaleEditorProps> = ({
  currentScale,
  allScales,
  onSelectScale,
  onSaveScale,
  onDeleteScale,
  onAddScale,
  onRestoreOriginals
}) => {
  const [isRawJsonMode, setIsRawJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(currentScale, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState(false);

  // Tabular editor state for items
  const [editingScale, setEditingScale] = useState<Scale>({ ...currentScale });

  // Update tabular edit state if current scale changes
  React.useEffect(() => {
    setEditingScale({ ...currentScale });
    setJsonText(JSON.stringify(currentScale, null, 2));
    setJsonError(null);
  }, [currentScale]);

  // Handle number changes in Mode 2 (calibration table)
  const handleItemNumberChange = (domainId: string, itemId: string, field: 'edad_25' | 'edad_50' | 'edad_75' | 'edad_90', value: number) => {
    const updatedDomains = editingScale.domains.map(dom => {
      if (dom.id !== domainId) return dom;
      return {
        ...dom,
        items: dom.items.map(it => {
          if (it.id !== itemId) return it;
          return {
            ...it,
            [field]: value
          };
        })
      };
    });

    const updated = { ...editingScale, domains: updatedDomains };
    setEditingScale(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleSaveTabular = () => {
    onSaveScale(editingScale);
    setJsonSuccess(true);
    setTimeout(() => setJsonSuccess(false), 3000);
  };

  // RAW JSON Import & Save handlers
  const handleSaveRawJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as Scale;
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.domains)) {
        throw new Error('La escala debe contener "id", "name" y una lista de "domains".');
      }
      onSaveScale(parsed);
      setEditingScale(parsed);
      setJsonError(null);
      setJsonSuccess(true);
      setTimeout(() => setJsonSuccess(false), 3000);
    } catch (err: any) {
      setJsonError(err.message || 'Error de formato JSON inválido.');
    }
  };

  // Export current scale as .json file download
  const handleExportJsonFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentScale, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentScale.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON via file upload
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as Scale;
        if (!parsed.id || !parsed.name || !Array.isArray(parsed.domains)) {
          throw new Error('Formato inválido: falta id, nombre o dominios.');
        }
        onAddScale(parsed);
        setJsonError(null);
        alert(`Escala "${parsed.name}" importada exitosamente.`);
      } catch (err: any) {
        alert(`Error al importar escala: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Add an empty scale skeleton
  const handleCreateNewEmptyScale = () => {
    const uniqueId = `custom-scale-${Date.now()}`;
    const newEmpty: Scale = {
      id: uniqueId,
      name: 'Nueva Escala de Desarrollo',
      description: 'Describe brevemente los objetivos, límites de edad y dominios de esta escala personalizada.',
      minAgeMonths: 0,
      maxAgeMonths: 36,
      domains: [
        {
          id: 'dominio-1',
          name: 'Área Psicomotriz / Lenguaje',
          items: [
            {
              id: `${uniqueId}-it1`,
              index: 1,
              name: 'Hito de ejemplo (Edita el nombre)',
              edad_25: 1.0,
              edad_50: 2.0,
              edad_75: 3.5,
              edad_90: 5.0,
              metodo: 'H/T',
              observaciones: 'Escribe aquí indicaciones de evaluación.',
              aproximado: false
            }
          ]
        }
      ]
    };
    onAddScale(newEmpty);
    onSelectScale(uniqueId);
    alert('Nueva escala creada. Ahora puedes editar sus parámetros en la tabla o en el editor JSON.');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCode className="w-5 h-5 text-slate-500" />
            Repositorio y Calibración de Escalas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agrega escalas, edita sus percentiles en tiempo real o modifica el JSON directamente.
          </p>
        </div>

        {/* REPO ACTIONS */}
        <div className="flex flex-wrap gap-2">
          {/* File input proxy */}
          <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-2xs">
            <Upload className="w-3.5 h-3.5" />
            Importar JSON
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportJsonFile} 
              className="hidden" 
            />
          </label>

          <button
            onClick={handleExportJsonFile}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
            title="Descargar escala seleccionada como archivo .json"
            id="btn-export-json"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar JSON
          </button>

          <button
            onClick={handleCreateNewEmptyScale}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
            id="btn-add-scale"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar nueva escala
          </button>
        </div>
      </div>

      {/* SCALE SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="scale-select-editor">
            Escala Activa en Editor:
          </label>
          <select
            id="scale-select-editor"
            value={currentScale.id}
            onChange={(e) => onSelectScale(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 font-semibold focus:ring-1 focus:ring-slate-400 outline-none shadow-2xs"
          >
            {allScales.map(sc => (
              <option key={sc.id} value={sc.id}>
                {sc.name} {sc.id === 'elm-scale' ? '(Original)' : '(Personalizada)'}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center">
          <h4 className="text-xs font-bold text-slate-800">{currentScale.name}</h4>
          <p className="text-xs text-slate-500 mt-1 italic">{currentScale.description}</p>
        </div>
      </div>

      {/* MODE SWITCHER (Tabular calibration vs raw JSON) */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setIsRawJsonMode(false)}
          className={`px-4 py-2 text-xs font-semibold transition border-b-2 -mb-px ${
            !isRawJsonMode 
              ? 'border-slate-800 text-slate-900 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-calibration-editor"
        >
          Modo 2: Calibración / Editor Numérico
        </button>
        <button
          onClick={() => setIsRawJsonMode(true)}
          className={`px-4 py-2 text-xs font-semibold transition border-b-2 -mb-px ${
            isRawJsonMode 
              ? 'border-slate-800 text-slate-900 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-json-editor"
        >
          Editor de JSON Directo
        </button>
      </div>

      {/* MODE 2: TABULAR CALIBRATION EDITOR */}
      {!isRawJsonMode ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Edita los meses (percentiles 25%, 50%, 75% y 90%) de cada hito clínico en la tabla de abajo.
            </span>
            <div className="flex gap-2">
              <button
                onClick={onRestoreOriginals}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                title="Restaurar a valores preestablecidos de fábrica"
                id="btn-restore-scale"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar originales
              </button>
              <button
                onClick={handleSaveTabular}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                id="btn-save-tabular"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar cambios
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold">Índice & Hito Clínico</th>
                    <th className="p-3 font-semibold w-24">P25 (Meses)</th>
                    <th className="p-3 font-semibold w-24">P50 (Meses)</th>
                    <th className="p-3 font-semibold w-24">P75 (Meses)</th>
                    <th className="p-3 font-semibold w-24">P90 (Meses)</th>
                    <th className="p-3 font-semibold w-24">Método</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {editingScale.domains.map(domain => (
                    <React.Fragment key={domain.id}>
                      {/* Domain Header Row */}
                      <tr className="bg-slate-100/60 font-semibold text-slate-800">
                        <td colSpan={6} className="p-2.5 px-4">
                          Dominio: {domain.name}
                        </td>
                      </tr>
                      {domain.items.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-800">
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded mr-1.5">
                              {item.index}
                            </span>
                            {item.name}
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="120"
                              value={item.edad_25}
                              onChange={(e) => handleItemNumberChange(domain.id, item.id, 'edad_25', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="120"
                              value={item.edad_50}
                              onChange={(e) => handleItemNumberChange(domain.id, item.id, 'edad_50', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="120"
                              value={item.edad_75}
                              onChange={(e) => handleItemNumberChange(domain.id, item.id, 'edad_75', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="120"
                              value={item.edad_90}
                              onChange={(e) => handleItemNumberChange(domain.id, item.id, 'edad_90', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-center"
                            />
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-center">
                            {item.metodo || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* MODE: RAW JSON DIRECT EDITOR */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-600">
              Modifica la estructura completa de la escala (ID, nombre, dominios o hitos) en formato JSON.
            </span>
            <button
              onClick={handleSaveRawJson}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
              id="btn-save-json"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar JSON
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-96 font-mono text-xs bg-slate-900 text-slate-200 rounded-xl p-4 focus:ring-1 focus:ring-slate-400 focus:outline-none shadow-inner"
            placeholder="Pega tu JSON aquí..."
            id="json-textarea"
          />

          {jsonError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-3 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong>Error en el JSON:</strong> {jsonError}
              </div>
            </div>
          )}
        </div>
      )}

      {/* POPUP ALERT SUCCESS */}
      {jsonSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Cambios guardados exitosamente. Los gráficos interactivos se actualizarán con los nuevos límites de percentiles.</span>
        </div>
      )}

      {/* DELETE EXTRA CUSTOM SCALE OPTION */}
      {currentScale.id !== 'elm-scale' && (
        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={() => {
              if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la escala personalizada "${currentScale.name}"?`)) {
                onDeleteScale(currentScale.id);
                alert('Escala eliminada.');
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar Escala Personalizada
          </button>
        </div>
      )}
    </div>
  );
};
