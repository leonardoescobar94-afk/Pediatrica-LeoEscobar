/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scale, AlertSign } from '../types';

export const HAIZEA_LLEVANT_ALERT_SIGNS: AlertSign[] = [
  {
    id: 'hl-alert-1',
    scaleId: 'haizea-llevant',
    domain: 'general',
    label: 'Irritabilidad permanente',
    startAge: 0,
    endAge: 60,
    alwaysRelevant: true,
    approximate: true,
    notes: 'Llanto persistente de difícil consuelo, sin causa orgánica clara.'
  },
  {
    id: 'hl-alert-2',
    scaleId: 'haizea-llevant',
    domain: 'general',
    label: 'Patrón de conducta repetitivo',
    startAge: 0,
    endAge: 60,
    alwaysRelevant: true,
    approximate: true,
    notes: 'Estereotipias, autoestimulación o fijación excesiva en objetos.'
  },
  {
    id: 'hl-alert-3',
    scaleId: 'haizea-llevant',
    domain: 'general',
    label: 'Pasar ininterrumpidamente de una acción a otra',
    startAge: 12,
    endAge: 60,
    appliesFromAge: 12,
    approximate: true,
    notes: 'Incapacidad de enfocar la atención o finalizar una actividad sencilla.'
  },
  {
    id: 'hl-alert-4',
    scaleId: 'haizea-llevant',
    domain: 'general',
    label: 'Sobresalto exagerado',
    startAge: 0,
    endAge: 12,
    approximate: true,
    notes: 'Reacción desmedida ante estímulos auditivos o visuales cotidianos.'
  },
  {
    id: 'hl-alert-5',
    scaleId: 'haizea-llevant',
    domain: 'postural',
    label: 'Persistencia de la reacción de Moro',
    startAge: 6,
    endAge: 60,
    appliesFromAge: 6,
    approximate: true,
    notes: 'Ausencia de la integración fisiológica del reflejo de Moro después de los 6 meses.'
  },
  {
    id: 'hl-alert-6',
    scaleId: 'haizea-llevant',
    domain: 'socializacion',
    label: 'Pasividad excesiva',
    startAge: 0,
    endAge: 60,
    alwaysRelevant: true,
    approximate: true,
    notes: 'Ausencia de iniciativa de interacción, hiporreactividad al entorno.'
  },
  {
    id: 'hl-alert-7',
    scaleId: 'haizea-llevant',
    domain: 'socializacion',
    label: 'Incapacidad para desarrollar juego simbólico',
    startAge: 18,
    endAge: 60,
    appliesFromAge: 18,
    approximate: true,
    notes: 'Ausencia de juego de simulación (alimentar muñecos, jugar a "hacer como si").'
  },
  {
    id: 'hl-alert-8',
    scaleId: 'haizea-llevant',
    domain: 'lenguaje_logica_matematica',
    label: 'Pérdida de balbuceo',
    startAge: 6,
    endAge: 60,
    appliesFromAge: 6,
    approximate: true,
    notes: 'Regresión o detención brusca de las emisiones vocálicas o silábicas.'
  },
  {
    id: 'hl-alert-9',
    scaleId: 'haizea-llevant',
    domain: 'lenguaje_logica_matematica',
    label: 'Estereotipias verbales',
    startAge: 18,
    endAge: 60,
    appliesFromAge: 18,
    approximate: true,
    notes: 'Repetición constante de palabras, sonidos o frases fuera de contexto.'
  },
  {
    id: 'hl-alert-10',
    scaleId: 'haizea-llevant',
    domain: 'manipulacion',
    label: 'Aducción persistente del pulgar',
    startAge: 3,
    endAge: 60,
    appliesFromAge: 3,
    approximate: true,
    notes: 'Pulgar cautivo de manera constante después de los 3 meses de edad.'
  },
  {
    id: 'hl-alert-11',
    scaleId: 'haizea-llevant',
    domain: 'manipulacion',
    label: 'Asimetría de manos',
    startAge: 4,
    endAge: 60,
    appliesFromAge: 4,
    approximate: true,
    notes: 'Uso preferente marcado de una mano o déficit evidente de movilidad en el lado contralateral antes del año.'
  },
  {
    id: 'hl-alert-12',
    scaleId: 'haizea-llevant',
    domain: 'postural',
    label: 'Hipertonía de aductores',
    startAge: 2,
    endAge: 60,
    appliesFromAge: 2,
    approximate: true,
    notes: 'Resistencia marcada a la abducción pasiva de las caderas.'
  },
  {
    id: 'hl-alert-13',
    scaleId: 'haizea-llevant',
    domain: 'postural',
    label: 'Ausencia de desplazamiento autónomo',
    startAge: 12,
    endAge: 60,
    appliesFromAge: 12,
    approximate: true,
    notes: 'Falta de gateo, arrastre o marcha después del primer año de vida.'
  }
];

export const HAIZEA_LLEVANT_SCALE: Scale = {
  id: 'haizea-llevant',
  name: 'Haizea-Llevant',
  description: 'Escala gráfica de hitos fundamentales del desarrollo infantil (0 a 60 meses). Permite evaluar cuatro áreas principales, identificar hitos logrados/no logrados y registrar signos de alerta clínica.',
  minAgeMonths: 0,
  maxAgeMonths: 60,
  alertSigns: HAIZEA_LLEVANT_ALERT_SIGNS,
  domains: [
    {
      id: 'socializacion',
      name: 'Socialización',
      items: [
        { id: 'hl-soc-1', index: 1, name: 'Reacciona a la voz', edad_25: 0.1, edad_50: 0.2, edad_75: 0.5, edad_90: 1.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-2', index: 2, name: 'Distingue a su madre', edad_25: 0.5, edad_50: 1.0, edad_75: 1.5, edad_90: 2.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-3', index: 3, name: 'Reconoce el biberón', edad_25: 1.0, edad_50: 2.0, edad_75: 3.0, edad_90: 4.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-4', index: 4, name: 'Mira sus manos', edad_25: 1.5, edad_50: 2.5, edad_75: 3.5, edad_90: 5.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-5', index: 5, name: 'Persecución óptica vertical', edad_25: 1.5, edad_50: 2.5, edad_75: 3.5, edad_90: 5.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-6', index: 6, name: 'Persecución óptica horizontal', edad_25: 1.0, edad_50: 2.0, edad_75: 3.0, edad_90: 4.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-7', index: 7, name: 'Busca objeto caído', edad_25: 4.0, edad_50: 5.0, edad_75: 6.5, edad_90: 8.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-8', index: 8, name: 'Come galleta', edad_25: 4.5, edad_50: 5.5, edad_75: 7.0, edad_90: 9.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-9', index: 9, name: 'Juega a “esconderse”', edad_25: 5.0, edad_50: 7.0, edad_75: 9.0, edad_90: 11.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-10', index: 10, name: 'Busca objeto desaparecido', edad_25: 6.0, edad_50: 8.0, edad_75: 10.0, edad_90: 12.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-11', index: 11, name: 'Imita gestos', edad_25: 7.0, edad_50: 9.0, edad_75: 11.0, edad_90: 14.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-12', index: 12, name: 'Colabora cuando le visten', edad_25: 8.0, edad_50: 10.0, edad_75: 12.5, edad_90: 15.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-13', index: 13, name: 'Lleva un vaso a la boca', edad_25: 9.0, edad_50: 12.0, edad_75: 15.0, edad_90: 18.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-14', index: 14, name: 'Imita tareas del hogar', edad_25: 12.0, edad_50: 15.0, edad_75: 18.0, edad_90: 24.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-15', index: 15, name: 'Come con cuchara', edad_25: 12.0, edad_50: 16.0, edad_75: 20.0, edad_90: 24.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-16', index: 16, name: 'Ayuda a recoger los juguetes', edad_25: 14.0, edad_50: 18.0, edad_75: 22.0, edad_90: 28.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-17', index: 17, name: 'Da de comer a los muñecos', edad_25: 15.0, edad_50: 19.0, edad_75: 24.0, edad_90: 30.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-18', index: 18, name: 'Se quita los pantalones', edad_25: 18.0, edad_50: 22.0, edad_75: 28.0, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-19', index: 19, name: 'Dramatiza secuencias', edad_25: 24.0, edad_50: 30.0, edad_75: 36.0, edad_90: 44.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-20', index: 20, name: 'Se pone prendas abiertas', edad_25: 24.0, edad_50: 32.0, edad_75: 40.0, edad_90: 48.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-21', index: 21, name: 'Va al inodoro', edad_25: 24.0, edad_50: 33.0, edad_75: 42.0, edad_90: 48.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-22', index: 22, name: 'Identifica su sexo', edad_25: 30.0, edad_50: 36.0, edad_75: 45.0, edad_90: 52.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-23', index: 23, name: 'Se desabrocha los botones', edad_25: 30.0, edad_50: 38.0, edad_75: 46.0, edad_90: 54.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-24', index: 24, name: 'Manipula guiñol', edad_25: 36.0, edad_50: 42.0, edad_75: 48.0, edad_90: 56.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-25', index: 25, name: 'Hace la comida comestible', edad_25: 36.0, edad_50: 44.0, edad_75: 50.0, edad_90: 58.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' },
        { id: 'hl-soc-26', index: 26, name: 'Dibuja un hombre o una mujer', edad_25: 44.0, edad_50: 48.0, edad_75: 54.0, edad_90: 60.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'socializacion' }
      ]
    },
    {
      id: 'lenguaje_logica_matematica',
      name: 'Lenguaje y lógica-matemática',
      items: [
        { id: 'hl-len-1', index: 1, name: 'Atiende conversación', edad_25: 0.1, edad_50: 0.1, edad_75: 0.4, edad_90: 1.2, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-2', index: 2, name: 'Ríe a carcajadas', edad_25: 1.5, edad_50: 1.5, edad_75: 2.5, edad_90: 4.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-3', index: 3, name: 'Balbucea', edad_25: 3.0, edad_50: 3.0, edad_75: 4.5, edad_90: 6.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-4', index: 4, name: 'Dice inespecíficamente “mamá/papá”', edad_25: 6.0, edad_50: 6.0, edad_75: 8.0, edad_90: 10.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-5', index: 5, name: 'Comprende una prohibición', edad_25: 7.0, edad_50: 7.0, edad_75: 9.0, edad_90: 12.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-6', index: 6, name: 'Reconoce su nombre', edad_25: 6.5, edad_50: 6.5, edad_75: 8.5, edad_90: 11.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-7', index: 7, name: 'Comprende significado de palabras', edad_25: 9.0, edad_50: 9.0, edad_75: 11.0, edad_90: 14.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-8', index: 8, name: 'Obedece orden por gestos', edad_25: 9.0, edad_50: 9.0, edad_75: 11.0, edad_90: 13.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-9', index: 9, name: 'Mamá/Papá', edad_25: 10.0, edad_50: 10.0, edad_75: 12.0, edad_90: 15.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-10', index: 10, name: 'Utiliza palabra “no”', edad_25: 11.0, edad_50: 11.0, edad_75: 14.0, edad_90: 18.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-11', index: 11, name: 'Señala partes de su cuerpo', edad_25: 12.0, edad_50: 12.0, edad_75: 15.0, edad_90: 20.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-12', index: 12, name: 'Nombra objeto dibujado', edad_25: 14.0, edad_50: 14.0, edad_75: 18.0, edad_90: 24.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-13', index: 13, name: 'Ejecuta 2 órdenes', edad_25: 15.0, edad_50: 15.0, edad_75: 19.5, edad_90: 24.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-14', index: 14, name: 'Combina 2 palabras', edad_25: 16.0, edad_50: 16.0, edad_75: 20.0, edad_90: 25.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-15', index: 15, name: 'Utiliza pronombres', edad_25: 18.0, edad_50: 18.0, edad_75: 22.0, edad_90: 28.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-16', index: 16, name: 'Frases de 3 palabras', edad_25: 20.0, edad_50: 20.0, edad_75: 24.0, edad_90: 30.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-17', index: 17, name: 'Memoriza imagen sencilla', edad_25: 22.0, edad_50: 22.0, edad_75: 26.0, edad_90: 32.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-18', index: 18, name: 'Cuenta hasta 2', edad_25: 24.0, edad_50: 24.0, edad_75: 28.5, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-19', index: 19, name: 'Nombra diez imágenes', edad_25: 24.0, edad_50: 24.0, edad_75: 30.0, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-20', index: 20, name: 'Usa verbo ser', edad_25: 24.0, edad_50: 24.0, edad_75: 30.0, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-21', index: 21, name: 'Nombra 5 imágenes', edad_25: 20.0, edad_50: 20.0, edad_75: 24.0, edad_90: 30.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-22', index: 22, name: 'Identifica objetos por el uso', edad_25: 24.0, edad_50: 24.0, edad_75: 30.0, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-23', index: 23, name: 'Discrimina largo/corto', edad_25: 30.0, edad_50: 30.0, edad_75: 36.0, edad_90: 44.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-24', index: 24, name: 'Realiza acciones inconexas', edad_25: 30.0, edad_50: 30.0, edad_75: 36.0, edad_90: 42.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-25', index: 25, name: 'Denomina colores', edad_25: 32.0, edad_50: 32.0, edad_75: 38.0, edad_90: 46.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-26', index: 26, name: 'Responde coherentemente', edad_25: 33.0, edad_50: 33.0, edad_75: 39.0, edad_90: 48.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-27', index: 27, name: 'Reconoce colores', edad_25: 34.0, edad_50: 34.0, edad_75: 40.0, edad_90: 48.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-28', index: 28, name: 'Discrimina mañana/tarde', edad_25: 36.0, edad_50: 36.0, edad_75: 44.0, edad_90: 52.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-29', index: 29, name: 'Cuenta historias', edad_25: 42.0, edad_50: 42.0, edad_75: 48.0, edad_90: 56.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-30', index: 30, name: 'Repite frases', edad_25: 44.0, edad_50: 44.0, edad_75: 50.0, edad_90: 58.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' },
        { id: 'hl-len-31', index: 31, name: 'Reconoce números', edad_25: 48.0, edad_50: 48.0, edad_75: 54.0, edad_90: 60.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'lenguaje_logica_matematica' }
      ]
    },
    {
      id: 'manipulacion',
      name: 'Manipulación',
      items: [
        { id: 'hl-man-1', index: 1, name: 'Junta manos', edad_25: 1.5, edad_50: 1.5, edad_75: 2.5, edad_90: 4.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-2', index: 2, name: 'Dirige la mano al objeto', edad_25: 2.5, edad_50: 2.5, edad_75: 3.5, edad_90: 5.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-3', index: 3, name: 'Cambia objetos de mano', edad_25: 4.5, edad_50: 4.5, edad_75: 5.5, edad_90: 7.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-4', index: 4, name: 'Se quita el pañuelo de la cara', edad_25: 4.5, edad_50: 4.5, edad_75: 5.5, edad_90: 7.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-5', index: 5, name: 'Realiza pinza inferior', edad_25: 6.0, edad_50: 6.0, edad_75: 7.5, edad_90: 9.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-6', index: 6, name: 'Realiza pinza superior', edad_25: 8.0, edad_50: 8.0, edad_75: 10.0, edad_90: 12.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-7', index: 7, name: 'Señala con el índice', edad_25: 9.0, edad_50: 9.0, edad_75: 11.0, edad_90: 13.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-8', index: 8, name: 'Tapa un bolígrafo', edad_25: 12.0, edad_50: 12.0, edad_75: 15.0, edad_90: 18.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-9', index: 9, name: 'Hace torre con 4 cubos', edad_25: 15.0, edad_50: 15.0, edad_75: 18.0, edad_90: 22.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-10', index: 10, name: 'Garabatea espontáneamente', edad_25: 13.0, edad_50: 13.0, edad_75: 16.0, edad_90: 20.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-11', index: 11, name: 'Pasa páginas', edad_25: 14.0, edad_50: 14.0, edad_75: 18.0, edad_90: 22.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-12', index: 12, name: 'Hace torre de 2 cubos', edad_25: 12.0, edad_50: 12.0, edad_75: 15.0, edad_90: 19.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-13', index: 13, name: 'Coge un lápiz', edad_25: 18.0, edad_50: 18.0, edad_75: 24.0, edad_90: 30.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-14', index: 14, name: 'Copia un círculo', edad_25: 24.0, edad_50: 24.0, edad_75: 30.0, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-15', index: 15, name: 'Reproduce un puente', edad_25: 30.0, edad_50: 30.0, edad_75: 36.0, edad_90: 42.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-16', index: 16, name: 'Dobla un papel', edad_25: 33.0, edad_50: 33.0, edad_75: 39.0, edad_90: 46.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-17', index: 17, name: 'Corta con tijeras', edad_25: 36.0, edad_50: 36.0, edad_75: 42.0, edad_90: 48.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-18', index: 18, name: 'Copia un cuadrado', edad_25: 44.0, edad_50: 44.0, edad_75: 50.0, edad_90: 56.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' },
        { id: 'hl-man-19', index: 19, name: 'Reproduce puerta', edad_25: 46.0, edad_50: 46.0, edad_75: 52.0, edad_90: 60.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'manipulacion' }
      ]
    },
    {
      id: 'postural',
      name: 'Postural',
      items: [
        { id: 'hl-pos-1', index: 1, name: 'Enderezamiento cefálico', edad_25: 0.5, edad_50: 0.5, edad_75: 1.5, edad_90: 2.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-2', index: 2, name: 'Paso a sentado', edad_25: 1.5, edad_50: 1.5, edad_75: 2.5, edad_90: 4.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-3', index: 3, name: 'Apoyo antebrazos', edad_25: 2.0, edad_50: 2.0, edad_75: 3.0, edad_90: 4.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-4', index: 4, name: 'Flexión cefálica', edad_25: 3.0, edad_50: 3.0, edad_75: 4.0, edad_90: 5.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-5', index: 5, name: 'Volteo', edad_25: 3.5, edad_50: 3.5, edad_75: 5.0, edad_90: 6.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-6', index: 6, name: 'Reacciones paracaidísticas laterales', edad_25: 5.0, edad_50: 5.0, edad_75: 6.5, edad_90: 8.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-7', index: 7, name: 'Sedestación estable', edad_25: 5.5, edad_50: 5.5, edad_75: 7.0, edad_90: 9.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-8', index: 8, name: 'De pie con apoyo', edad_25: 6.0, edad_50: 6.0, edad_75: 8.0, edad_90: 10.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-9', index: 9, name: 'Se sienta solo', edad_25: 7.0, edad_50: 7.0, edad_75: 9.0, edad_90: 11.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-10', index: 10, name: 'Marcha libre', edad_25: 11.0, edad_50: 11.0, edad_75: 13.0, edad_90: 16.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-11', index: 11, name: 'De pie sin apoyo', edad_25: 10.0, edad_50: 10.0, edad_75: 12.0, edad_90: 14.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-12', index: 12, name: 'Carrera libre', edad_25: 14.0, edad_50: 14.0, edad_75: 18.0, edad_90: 22.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-13', index: 13, name: 'Camina hacia atrás', edad_25: 15.0, edad_50: 15.0, edad_75: 19.0, edad_90: 24.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-14', index: 14, name: 'Da 5 pasos', edad_25: 11.5, edad_50: 11.5, edad_75: 13.5, edad_90: 16.5, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-15', index: 15, name: 'Baja escaleras', edad_25: 16.0, edad_50: 16.0, edad_75: 21.0, edad_90: 26.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-16', index: 16, name: 'Chuta la pelota', edad_25: 18.0, edad_50: 18.0, edad_75: 22.0, edad_90: 28.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-17', index: 17, name: 'Salta hacia adelante', edad_25: 22.0, edad_50: 22.0, edad_75: 27.0, edad_90: 33.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-18', index: 18, name: 'Se mantiene sobre un pie', edad_25: 24.0, edad_50: 24.0, edad_75: 30.0, edad_90: 36.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-19', index: 19, name: 'Salta con los pies juntos', edad_25: 26.0, edad_50: 26.0, edad_75: 32.0, edad_90: 38.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-20', index: 20, name: 'Salta hacia atrás', edad_25: 36.0, edad_50: 36.0, edad_75: 42.0, edad_90: 48.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' },
        { id: 'hl-pos-21', index: 21, name: 'Equilibrio con un pie', edad_25: 44.0, edad_50: 44.0, edad_75: 50.0, edad_90: 58.0, aproximado: true, scaleId: 'haizea-llevant', domain: 'postural' }
      ]
    }
  ]
};
