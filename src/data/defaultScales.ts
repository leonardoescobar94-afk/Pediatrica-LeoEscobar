/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scale } from '../types';

export const DEFAULT_ELM_SCALE: Scale = {
  id: 'elm-scale',
  name: 'Early Language Milestones (ELM)',
  description: 'Escala de hitos tempranos del lenguaje diseñada principalmente para niños de 0 a 36 meses. Evalúa tres áreas del desarrollo del lenguaje: Expresivo Auditivo, Receptivo Auditivo y Visual.',
  minAgeMonths: 0,
  maxAgeMonths: 36,
  domains: [
    {
      id: 'expresivo',
      name: 'Expresivo Auditivo',
      items: [
        { id: 'exp-1', index: 1, name: 'Coo (Arrullo)', edad_25: 0.2, edad_50: 0.5, edad_75: 1.0, edad_90: 2.1, metodo: 'H', observaciones: 'Sonido vocálico repetitivo e involuntario.', aproximado: true },
        { id: 'exp-2', index: 2, name: 'Vocalización recíproca', edad_25: 0.5, edad_50: 1.0, edad_75: 1.7, edad_90: 3.2, metodo: 'H/O', observaciones: 'Responde vocalizando ante la estimulación verbal de la madre u otro cuidador.', aproximado: true },
        { id: 'exp-3', index: 3, name: 'Risa', edad_25: 1.5, edad_50: 2.5, edad_75: 3.5, edad_90: 4.5, metodo: 'H/O', observaciones: 'Risa social o carcajada espontánea ante juegos.', aproximado: true },
        { id: 'exp-4', index: 4, name: 'Frambuesa (Trompetillas)', edad_25: 4.0, edad_50: 5.5, edad_75: 7.0, edad_90: 8.5, metodo: 'H/O', observaciones: 'Vibración de labios con saliva o soplido de juego.', aproximado: true },
        { id: 'exp-5', index: 5, name: 'Balbuceo monosilábico', edad_25: 4.0, edad_50: 6.0, edad_75: 8.0, edad_90: 10.0, metodo: 'H/O', observaciones: 'Sonidos de consonante-vocal únicos como "ba", "da", "ma".', aproximado: true },
        { id: 'exp-6', index: 6, name: 'Balbuceo polisilábico', edad_25: 5.0, edad_50: 7.0, edad_75: 9.5, edad_90: 12.0, metodo: 'H/O', observaciones: 'Repetición encadenada de sílabas como "dadada" o "mamama".', aproximado: true },
        { id: 'exp-7', index: 7, name: 'Mamá/papá: cualquiera', edad_25: 6.0, edad_50: 8.0, edad_75: 10.0, edad_90: 12.5, metodo: 'H', observaciones: 'Dice "mamá" o "papá" de forma inespecífica, sin asociarlo a un cuidador en particular.', aproximado: true },
        { id: 'exp-8', index: 8, name: 'Mamá/papá: correcto', edad_25: 10.0, edad_50: 12.0, edad_75: 14.0, edad_90: 17.0, metodo: 'H/T', observaciones: 'Utiliza "mamá" o "papá" de forma específica para referirse al cuidador correspondiente.', aproximado: true },
        { id: 'exp-9', index: 9, name: 'Primera palabra (no mamá/papá)', edad_25: 9.0, edad_50: 11.0, edad_75: 14.0, edad_90: 18.0, metodo: 'H', observaciones: 'Usa la primera palabra real con significado claro.', aproximado: true },
        { id: 'exp-10', index: 10, name: '4-6 palabras aisladas', edad_25: 11.0, edad_50: 14.0, edad_75: 18.0, edad_90: 21.5, metodo: 'H', observaciones: 'Tiene un repertorio de 4 a 6 palabras diferentes, además de "mamá/papá".', aproximado: true },
        { id: 'exp-11', index: 11, name: 'Dice 2 deseos', edad_25: 13.0, edad_50: 16.0, edad_75: 19.0, edad_90: 24.0, metodo: 'H', observaciones: 'Expresa deseos simples uniendo palabras o gestos verbales ("más leche", "quiero coche").', aproximado: true },
        { id: 'exp-12', index: 12, name: 'Frases de 2 palabras', edad_25: 16.0, edad_50: 20.0, edad_75: 23.0, edad_90: 27.0, metodo: 'H', observaciones: 'Combina espontáneamente dos palabras independientes ("auto papá", "nene duerme").', aproximado: true },
        { id: 'exp-13', index: 13, name: '50 palabras aisladas', edad_25: 15.0, edad_50: 19.0, edad_75: 23.0, edad_90: 27.5, metodo: 'H', observaciones: 'Utiliza al menos 50 palabras inteligibles de forma consistente en su rutina.', aproximado: true },
        { id: 'exp-14', index: 14, name: 'Mi/tú: cualquiera', edad_25: 16.5, edad_50: 21.0, edad_75: 25.0, edad_90: 30.0, metodo: 'H', observaciones: 'Utiliza los pronombres posesivos o personales de manera ocasional.', aproximado: true },
        { id: 'exp-15', index: 15, name: 'Comprendido la mitad por extraños', edad_25: 18.0, edad_50: 22.0, edad_75: 26.0, edad_90: 32.0, metodo: 'H', observaciones: 'Al menos el 50% de las verbalizaciones del niño son comprendidas por personas de fuera de su entorno habitual.', aproximado: true },
        { id: 'exp-16', index: 16, name: 'Preposiciones', edad_25: 24.0, edad_50: 29.0, edad_75: 32.0, edad_90: 36.0, metodo: 'T', observaciones: 'Usa correctamente al menos dos preposiciones ("en", "sobre", "debajo").', aproximado: true },
        { id: 'exp-17', index: 17, name: 'Conversaciones', edad_25: 22.0, edad_50: 28.0, edad_75: 33.0, edad_90: 36.0, metodo: 'H/O', observaciones: 'Mantiene intercambios verbales breves con coherencia en la conversación.', aproximado: true },
        { id: 'exp-18', index: 18, name: 'Objetos: nombre y uso', edad_25: 24.0, edad_50: 28.0, edad_75: 32.0, edad_90: 36.0, metodo: 'T', observaciones: 'Nombra y describe el uso de al menos tres objetos cotidianos.', aproximado: true },
        { id: 'exp-19', index: 19, name: 'Comprendido 3/4 partes', edad_25: 24.0, edad_50: 30.0, edad_75: 34.0, edad_90: 36.0, metodo: 'H', observaciones: 'Alrededor del 75% de lo que habla es comprendido por personas ajenas al hogar.', aproximado: true },
        { id: 'exp-20', index: 20, name: 'Comprendido todo por extraños', edad_25: 30.0, edad_50: 33.0, edad_75: 35.0, edad_90: 36.0, metodo: 'H', observaciones: 'El 100% de su discurso es inteligible para cualquier persona.', aproximado: true }
      ]
    },
    {
      id: 'receptivo',
      name: 'Receptivo Auditivo',
      items: [
        { id: 'rec-1', index: 1, name: 'Alerta a la voz', edad_25: 0.0, edad_50: 0.2, edad_75: 0.8, edad_90: 1.5, metodo: 'H/O', observaciones: 'Detiene su actividad, gira los ojos o se alarma al escuchar una voz humana cercana.', aproximado: true },
        { id: 'rec-2', index: 2, name: 'Orientado a voz lateral', edad_25: 3.0, edad_50: 4.5, edad_75: 6.0, edad_90: 7.5, metodo: 'T', observaciones: 'Gira la cabeza lateralmente de manera directa hacia la fuente de una voz.', aproximado: true },
        { id: 'rec-3', index: 3, name: 'Reconoce sonidos', edad_25: 4.0, edad_50: 5.5, edad_75: 7.0, edad_90: 9.0, metodo: 'H', observaciones: 'Reacciona emocional o físicamente a sonidos familiares de casa (tetera, timbre, pasos).', aproximado: true },
        { id: 'rec-4', index: 4, name: 'Campana, lateral', edad_25: 4.0, edad_50: 5.0, edad_75: 6.5, edad_90: 8.0, metodo: 'T', observaciones: 'Gira la cabeza hacia un lado cuando se hace sonar una campana fuera de su vista.', aproximado: true },
        { id: 'rec-5', index: 5, name: 'Campana, Oblicuo y Directo', edad_25: 6.0, edad_50: 7.5, edad_75: 9.0, edad_90: 11.0, metodo: 'T', observaciones: 'Gira la cabeza en un plano oblicuo y hacia abajo localizando directamente la campana.', aproximado: true },
        { id: 'rec-6', index: 6, name: 'Se inhibe al "No"', edad_25: 5.0, edad_50: 7.0, edad_75: 9.0, edad_90: 11.0, metodo: 'H', observaciones: 'Detiene temporalmente una acción o mira al cuidador cuando este le dice "no".', aproximado: true },
        { id: 'rec-7', index: 7, name: 'Campana, diagonal', edad_25: 8.0, edad_50: 9.5, edad_75: 11.0, edad_90: 13.0, metodo: 'T', observaciones: 'Localiza con precisión el estímulo sonoro de la campana en plano diagonal elevado.', aproximado: true },
        { id: 'rec-8', index: 8, name: 'Orden de un paso con gesto', edad_25: 8.5, edad_50: 10.5, edad_75: 12.5, edad_90: 15.0, metodo: 'T', observaciones: 'Cumple una orden simple (ej: "dame el juguete") acompañada de un gesto extendido.', aproximado: true },
        { id: 'rec-9', index: 9, name: 'Señala >= 1 parte del cuerpo', edad_25: 11.0, edad_50: 14.0, edad_75: 17.0, edad_90: 20.0, metodo: 'T', observaciones: 'Señala correctamente al menos una parte de su cuerpo cuando se le pregunta ("¿dónde está tu nariz?").', aproximado: true },
        { id: 'rec-10', index: 10, name: 'Orden de dos pasos sin gesto', edad_25: 16.0, edad_50: 20.0, edad_75: 23.0, edad_90: 27.0, metodo: 'T', observaciones: 'Realiza dos comandos consecutivos sin gestos que lo guíen ("recoge la pelota y dámela").', aproximado: true },
        { id: 'rec-11', index: 11, name: 'Señala objetos nombrados', edad_25: 12.0, edad_50: 15.0, edad_75: 18.0, edad_90: 22.0, metodo: 'T', observaciones: 'Señala de manera correcta al menos 3 juguetes o ilustraciones de un libro al ser nombrados.', aproximado: true },
        { id: 'rec-12', index: 12, name: 'Señala objetos descritos por uso', edad_25: 18.0, edad_50: 21.5, edad_75: 25.0, edad_90: 29.0, metodo: 'T', observaciones: 'Señala objetos de acuerdo con su función ("¿con qué tomamos la sopa?", "¿qué sirve para peinarte?").', aproximado: true },
        { id: 'rec-13', index: 13, name: 'Órdenes preposicionales', edad_25: 24.0, edad_50: 29.0, edad_75: 32.0, edad_90: 36.0, metodo: 'T', observaciones: 'Cumple órdenes de colocación con preposiciones ("pon el lápiz encima del papel", "debajo de la silla").', aproximado: true }
      ]
    },
    {
      id: 'visual',
      name: 'Visual',
      items: [
        { id: 'vis-1', index: 1, name: 'Sonríe', edad_25: 0.2, edad_50: 0.8, edad_75: 1.5, edad_90: 2.2, metodo: 'H/O', observaciones: 'Muestra sonrisa en respuesta al rostro humano o la interacción social.', aproximado: true },
        { id: 'vis-2', index: 2, name: 'Reconoce a los padres', edad_25: 0.5, edad_50: 1.5, edad_75: 2.5, edad_90: 3.5, metodo: 'H/O', observaciones: 'Cambia su actitud o vocaliza alegremente al mirar los rostros de sus cuidadores habituales.', aproximado: true },
        { id: 'vis-3', index: 3, name: 'Reconoce objetos', edad_25: 1.0, edad_50: 2.2, edad_75: 3.2, edad_90: 4.5, metodo: 'H', observaciones: 'Se estira para alcanzar biberones o juguetes familiares demostrando reconocimiento visual.', aproximado: true },
        { id: 'vis-4', index: 4, name: 'Responde a expresiones faciales', edad_25: 1.5, edad_50: 3.0, edad_75: 4.2, edad_90: 5.5, metodo: 'O', observaciones: 'Altera su propia expresión facial respondiendo a los cambios gestuales del evaluador.', aproximado: true },
        { id: 'vis-5', index: 5, name: 'Seguimiento visual', edad_25: 0.0, edad_50: 1.0, edad_75: 2.0, edad_90: 3.0, metodo: 'T', observaciones: 'Sigue un objeto llamativo con los ojos y cabeza a través de un arco horizontal completo de 180 grados.', aproximado: true },
        { id: 'vis-6', index: 6, name: 'Parpadea ante amenaza', edad_25: 2.0, edad_50: 3.0, edad_75: 4.2, edad_90: 5.5, metodo: 'T', observaciones: 'Parpadea de forma refleja ante la aproximación rápida de la mano del examinador.', aproximado: true },
        { id: 'vis-7', index: 7, name: 'Imita gestos de juegos', edad_25: 4.5, edad_50: 6.5, edad_75: 8.5, edad_90: 11.0, metodo: 'T', observaciones: 'Imita movimientos corporales simples en juegos infantiles guiados (aplauso, mover manito de adiós).', aproximado: true },
        { id: 'vis-8', index: 8, name: 'Orden de un paso con gesto', edad_25: 8.5, edad_50: 10.5, edad_75: 12.5, edad_90: 15.0, metodo: 'T', observaciones: 'Comprende el sentido visual del señalamiento de un objeto distante y lo observa de inmediato.', aproximado: true },
        { id: 'vis-9', index: 9, name: 'Inicia gestos de juegos', edad_25: 7.0, edad_50: 9.0, edad_75: 11.5, edad_90: 14.0, metodo: 'H/O', observaciones: 'Propone o inicia por iniciativa propia un juego con gestos (jugar al escondite con mantas, etc.).', aproximado: true },
        { id: 'vis-10', index: 10, name: 'Señala los objetos deseados', edad_25: 9.0, edad_50: 12.0, edad_75: 14.5, edad_90: 18.0, metodo: 'H/O', observaciones: 'Señala directamente con el dedo índice un objeto fuera de su alcance para manifestar interés.', aproximado: true }
      ]
    }
  ]
};

export const INITIAL_SCALES: Scale[] = [DEFAULT_ELM_SCALE];
