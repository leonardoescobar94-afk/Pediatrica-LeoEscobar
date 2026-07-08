/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScaleItem, DomainResult, GlobalResult, Scale } from '../types';

/**
 * Calculates the Development Coefficient (CD)
 * CD = (Neurological Age / Chronological Age) * 100
 */
export function calculateCD(neurologicalAge: number, chronologicalAge: number): number {
  if (chronologicalAge <= 0) return 0;
  return Number(((neurologicalAge / chronologicalAge) * 100).toFixed(1));
}

/**
 * Classifies the Development Coefficient (CD)
 * - Normal: CD >= 85% (If > 100%, "Normal / por encima de lo esperado para la edad")
 * - Leve: CD >= 65% y < 85%
 * - Moderado: CD >= 51% y < 65%
 * - Severo: CD < 51%
 */
export function getCDClassification(cd: number): string {
  if (cd > 100) {
    return 'Normal / por encima de lo esperado para la edad';
  }
  if (cd >= 85) {
    return 'Normal';
  }
  if (cd >= 65) {
    return 'Leve';
  }
  if (cd >= 51) {
    return 'Moderado';
  }
  return 'Severo';
}

/**
 * Gets the color tailwind classes for a classification
 */
export function getClassificationColorClass(classification: string): string {
  if (classification.startsWith('Normal')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (classification === 'Leve') {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  if (classification === 'Moderado') {
    return 'bg-orange-50 text-orange-700 border-orange-200';
  }
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

/**
 * Finds the representative item for a given estimated age in a domain.
 * - Candidates: items where the age falls inside the acquisition range [edad_25, edad_90].
 * - If multiple candidate items exist, select the most advanced one (highest index/progressive item).
 * - If the age is past all items' 90% percentile, returns the last item.
 * - If the age is below all items' 25% percentile, returns the first item.
 */
export function getRepresentativeItem(items: ScaleItem[], age: number): { item: ScaleItem | undefined, percentile: string } {
  if (items.length === 0) {
    return { item: undefined, percentile: '' };
  }

  // Find all items whose active range [edad_25, edad_90] contains the age
  const candidates = items.filter(item => age >= item.edad_25 && age <= item.edad_90);

  let selectedItem: ScaleItem;

  if (candidates.length > 0) {
    // Select the most advanced (highest index in original ordered list)
    selectedItem = candidates.reduce((prev, curr) => curr.index > prev.index ? curr : prev);
  } else {
    // If no exact match (either because it is higher than all 90% or lower than all 25%)
    // Let's check if the age is higher than the max 90% in the scale
    const max90Item = items.reduce((prev, curr) => curr.edad_90 > prev.edad_90 ? curr : prev);
    if (age > max90Item.edad_90) {
      selectedItem = max90Item;
    } else {
      // If it's below the min 25%, select the first item
      const min25Item = items.reduce((prev, curr) => curr.edad_25 < prev.edad_25 ? curr : prev);
      selectedItem = min25Item;
    }
  }

  // Determine percentile band relative to selectedItem
  let percentile = '';
  if (age < selectedItem.edad_25) {
    percentile = '< 25%';
  } else if (age >= selectedItem.edad_25 && age < selectedItem.edad_50) {
    percentile = '25% - 50%';
  } else if (age >= selectedItem.edad_50 && age < selectedItem.edad_75) {
    percentile = '50% - 75%';
  } else if (age >= selectedItem.edad_75 && age <= selectedItem.edad_90) {
    percentile = '75% - 90%';
  } else {
    percentile = '> 90%';
  }

  return { item: selectedItem, percentile };
}

/**
 * Calculates global results for a given scale and evaluation inputs
 */
export function calculateGlobalResult(
  scale: Scale,
  chronologicalAge: number,
  neurologicalAges: Record<string, number>, // keyed by domainId
  observaciones: Record<string, string>
): GlobalResult {
  const domainResults: DomainResult[] = [];
  let sumNeurologicalAge = 0;
  let countDomains = 0;

  scale.domains.forEach(domain => {
    const age = neurologicalAges[domain.id];
    if (age !== undefined && age !== null && !isNaN(age)) {
      sumNeurologicalAge += age;
      countDomains++;

      const { item, percentile } = getRepresentativeItem(domain.items, age);
      const cd = calculateCD(age, chronologicalAge);
      const classification = getCDClassification(cd);

      domainResults.push({
        domainId: domain.id,
        domainName: domain.name,
        neurologicalAge: age,
        representativeItem: item,
        representativePercentile: percentile,
        cd,
        classification,
        observaciones: observaciones[domain.id] || ''
      });
    }
  });

  const globalNeurologicalAge = countDomains > 0 ? Number((sumNeurologicalAge / countDomains).toFixed(1)) : 0;
  const globalCd = countDomains > 0 ? calculateCD(globalNeurologicalAge, chronologicalAge) : 0;
  const globalClassification = countDomains > 0 ? getCDClassification(globalCd) : 'N/A';

  return {
    chronologicalAge,
    globalNeurologicalAge,
    globalCd,
    globalClassification,
    domainResults
  };
}

/**
 * Generates the clean formatted report text suitable for clipboard copy
 */
export function generateClinicalReportText(
  scaleName: string,
  evaluationDate: string,
  chronologicalAge: number,
  globalResult: GlobalResult,
  p95Warnings: string[] = [],
  checkedAlertSigns: string[] = []
): string {
  // Format Date from YYYY-MM-DD to DD/MM/AAAA
  let formattedDate = evaluationDate;
  if (evaluationDate) {
    const parts = evaluationDate.split('-');
    if (parts.length === 3) {
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  // Specific layout for Haizea-Llevant scale
  if (scaleName.toLowerCase().includes('haizea') || scaleName.toLowerCase().includes('llevant')) {
    const hlLines: string[] = [];
    hlLines.push(`[FECHA ${formattedDate}]`);
    hlLines.push('');
    hlLines.push(`Haizea-Llevant:`);
    hlLines.push(`Edad cronológica: ${chronologicalAge} meses.`);
    hlLines.push('');
    hlLines.push(`Resultado global:`);
    hlLines.push(`Edad de desarrollo global estimada: ${globalResult.globalNeurologicalAge} meses.`);
    hlLines.push(`Coeficiente de desarrollo global: ${globalResult.globalCd}%.`);
    hlLines.push(`Clasificación global: ${globalResult.globalClassification.toLowerCase()}.`);
    hlLines.push('');
    hlLines.push(`Resultado por áreas:`);
    
    globalResult.domainResults.forEach(dr => {
      const itemText = dr.representativeItem 
        ? `${dr.representativeItem.index}. ${dr.representativeItem.name}`
        : 'N/A';
      hlLines.push(`${dr.domainName}: edad estimada ${dr.neurologicalAge} meses. CD: ${dr.cd}%. Clasificación: ${dr.classification}. Ítem representativo: ${itemText}.`);
      if (dr.observaciones.trim()) {
        hlLines.push(`   Observaciones: ${dr.observaciones.trim()}`);
      }
    });

    hlLines.push('');
    hlLines.push(`Ítems no logrados después del P95:`);
    if (p95Warnings.length > 0) {
      p95Warnings.forEach(w => {
        hlLines.push(`- ${w}`);
      });
    } else {
      hlLines.push(`- No se identifican`);
    }

    hlLines.push('');
    hlLines.push(`Signos de alerta presentes:`);
    if (checkedAlertSigns.length > 0) {
      checkedAlertSigns.forEach(s => {
        hlLines.push(`- ${s}`);
      });
    } else {
      hlLines.push(`- No se identifican`);
    }

    hlLines.push('');
    hlLines.push(`Interpretación:`);
    hlLines.push(`Resultado estimado según escala gráfica Haizea-Llevant. Interpretar en conjunto con historia clínica, examen neurológico, antecedentes perinatales, contexto funcional y evolución longitudinal.`);

    if (p95Warnings.length > 0 || checkedAlertSigns.length > 0) {
      hlLines.push('');
      hlLines.push(`“Se identifican hallazgos de alerta del desarrollo; se recomienda evaluación clínica cuidadosa y seguimiento/intervención según contexto.”`);
    }

    return hlLines.join('\n');
  }

  // Fallback default layout for ELM and others
  const lines: string[] = [];
  lines.push(`[FECHA EN ${formattedDate}]`);
  lines.push('');
  lines.push(`${scaleName}:`);
  lines.push(`Edad cronológica: ${chronologicalAge} meses.`);
  
  if (globalResult.domainResults.length > 0) {
    lines.push(`Edad neurológica global estimada: ${globalResult.globalNeurologicalAge} meses.`);
    lines.push(`Coeficiente de desarrollo global: ${globalResult.globalCd}%. Clasificación: ${globalResult.globalClassification.toLowerCase()}.`);
    lines.push('');

    globalResult.domainResults.forEach(dr => {
      const itemText = dr.representativeItem 
        ? `${dr.representativeItem.name} (${dr.representativePercentile})`
        : 'N/A';
      lines.push(`${dr.domainName}: ${itemText} (${dr.neurologicalAge} meses). CD: ${dr.cd}%. Clasificación: ${dr.classification}.`);
      if (dr.observaciones.trim()) {
        lines.push(`   Observaciones: ${dr.observaciones.trim()}`);
      }
    });
  } else {
    lines.push('No se han evaluado dominios.');
  }

  lines.push('');
  lines.push('Observación:');
  lines.push('Resultado estimado según edad de desarrollo seleccionada en escala ELM. Interpretar en contexto clínico, antecedentes, examen neurológico y pruebas complementarias.');

  return lines.join('\n');
}
