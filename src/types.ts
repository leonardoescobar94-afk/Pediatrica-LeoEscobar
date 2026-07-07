/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScaleItem {
  id: string;
  index: number;
  name: string;
  edad_25: number;
  edad_50: number;
  edad_75: number;
  edad_90: number;
  metodo?: 'H' | 'T' | 'O' | string; // H: historia, T: prueba directa, O: observación fortuita
  observaciones?: string;
  aproximado?: boolean;
}

export interface ScaleDomain {
  id: string;
  name: string;
  items: ScaleItem[];
}

export interface Scale {
  id: string;
  name: string;
  description: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  domains: ScaleDomain[];
}

export interface DomainResult {
  domainId: string;
  domainName: string;
  neurologicalAge: number; // in months
  representativeItem?: ScaleItem;
  representativePercentile?: string; // e.g. "25-50%", "50-75%", "75-90%", "<25%", ">90%"
  cd: number; // Developmental Quotient
  classification: string;
  observaciones: string;
}

export interface GlobalResult {
  chronologicalAge: number;
  globalNeurologicalAge: number;
  globalCd: number;
  globalClassification: string;
  domainResults: DomainResult[];
}
