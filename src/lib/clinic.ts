// Información real del centro Libre de Ansiedad, tomada de la web oficial
// https://nelsonarturopsicologo.com/ — si algo cambia allá, actualízalo aquí.

export const CLINIC = {
  name: 'Libre de Ansiedad',
  tagline: 'Centro de Psicología Especializado en Ansiedad',
  website: 'https://nelsonarturopsicologo.com/',
  blog: 'https://nelsonarturopsicologo.com/entradas/',
  testimonials: 'https://nelsonarturopsicologo.com/testimonios/',
  team: 'https://nelsonarturopsicologo.com/nuestrp-equipo/',
  phoneDisplay: '+57 311 760 61 07',
  whatsapp:
    'https://wa.me/573117606107?text=' +
    encodeURIComponent('Hola, te hablo desde la membresía de Libre de Ansiedad y quisiera recibir más información'),
  whatsappTherapy:
    'https://wa.me/573117606107?text=' +
    encodeURIComponent('Hola, vengo de la membresía y quiero información sobre la terapia individual'),
  freeSession: 'https://tally.so/r/QKe6Z1',
  instagram: 'https://www.instagram.com/libredeansiedadoficial/',
  facebook: 'https://www.facebook.com/libredeansiedadoficial',
  youtube: 'https://www.youtube.com/c/LibredeAnsiedad',
} as const;

/** Cifras publicadas en la web oficial del centro. */
export const CLINIC_STATS = [
  { value: '1000+', label: 'pacientes atendidos por el centro' },
  { value: '85%', label: 'de las personas que atendemos recomiendan el centro' },
  { value: '90%', label: 'destaca la calidad humana y profesional del equipo' },
  { value: '4.6/5', label: 'calificación promedio de los pacientes' },
];

/** Áreas que trabaja el centro (web oficial, sección "Sobre nosotros"). */
export const CLINIC_TOPICS = [
  'Ansiedad y ataques de pánico',
  'Estrés crónico',
  'Trauma emocional',
  'Trastorno obsesivo compulsivo (TOC)',
  'Trastornos del estado de ánimo',
  'Manejo de la ira',
  'Soledad y dificultades emocionales',
];
