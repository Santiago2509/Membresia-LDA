// Equipo del centro, tomado de https://nelsonarturopsicologo.com/nuestrp-equipo/
// y de las páginas individuales de cada psicóloga. Fotos reales del sitio oficial.

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  /** Resumen corto para la tarjeta. */
  summary: string;
  /** Párrafos de la biografía completa. */
  bio: string[];
  /** Cómo puede ayudarte (opcional). */
  helps?: string[];
  founder?: boolean;
};

export const TEAM: TeamMember[] = [
  {
    id: 'nelson-arturo',
    name: 'Nelson Arturo',
    role: 'Psicólogo especialista en ansiedad · Fundador',
    photo: '/nelson-quien-soy.jpg',
    founder: true,
    summary:
      'Soy psicólogo, especialista en el tratamiento de la ansiedad, pero también fui uno de los afectados.',
    bio: [
      'Soy psicólogo, especialista en el tratamiento de la ansiedad, pero también fui uno de los afectados. Quiero ayudarte a que seas una persona mucho más fuerte, inteligente y calmada para que seas libre y reemprendas tus sueños.',
      'Fundé Libre de Ansiedad, un centro de psicología online conformado por un equipo de psicólogos clínicos especializados en ansiedad, estrés y trastornos emocionales, que trabaja con Terapia Cognitivo-Conductual y otras metodologías validadas por la ciencia, sin medicamentos.',
    ],
  },
  {
    id: 'ingrid-arguello',
    name: 'Ingrid Argüello',
    role: 'Magíster en Psicología Clínica',
    photo: '/equipo/ingrid-arguello.jpg',
    summary:
      'Especialista en evaluación y tratamiento de trastornos emocionales, con más de 9 años acompañando a personas en terapia.',
    bio: [
      'Soy Magíster en Psicología Clínica y Especialista en Evaluación y Tratamiento de Trastornos Emocionales. Durante más de 9 años, he acompañado a personas en terapia individual, de pareja y familiar. Mi objetivo es proporcionar herramientas efectivas para superar la ansiedad y otros trastornos emocionales.',
      'Desde joven, enfrenté episodios de ansiedad, ataques de pánico, depresión y tricotilomanía. La búsqueda de ayuda profesional no siempre fue efectiva, lo que me llevó a profundizar en el estudio de la psicología. Esta experiencia me permitió desarrollar un método basado en evidencia para manejar estos desafíos sin medicación.',
      'Las técnicas que utilizo están respaldadas por la psicología clínica y han demostrado ser efectivas para el tratamiento de la ansiedad. A través de estrategias comprobadas, ayudo a mis pacientes a recuperar el equilibrio emocional y mejorar su calidad de vida.',
    ],
  },
  {
    id: 'erika-espinoza',
    name: 'Erika Espinoza',
    role: 'Psicóloga clínica',
    photo: '/equipo/erika-espinoza.jpg',
    summary:
      'Acompaña a pacientes que enfrentan ansiedad y otras dificultades emocionales, con herramientas prácticas y efectivas.',
    bio: [
      'Soy psicóloga clínica con experiencia en el acompañamiento de pacientes que enfrentan ansiedad y otras dificultades emocionales. Mi enfoque se basa en brindar herramientas prácticas y efectivas para gestionar el estrés, mejorar el bienestar emocional y recuperar el equilibrio en la vida diaria.',
    ],
    helps: [
      'Evaluación y diagnóstico de la ansiedad',
      'Estrategias para el manejo del estrés y la regulación emocional',
      'Terapia personalizada basada en evidencia científica',
      'Acompañamiento en la construcción de hábitos saludables para la salud mental',
    ],
  },
  {
    id: 'camila-cubillos',
    name: 'Camila Cubillos',
    role: 'Psicóloga con énfasis clínico',
    photo: '/equipo/camila-cubillos.jpg',
    summary:
      'Egresada de la Universidad Konrad Lorenz. Trabaja desde un enfoque cognitivo-conductual, respaldado científicamente.',
    bio: [
      'Soy Camila Cubillos, psicóloga con énfasis clínico, egresada de la Universidad Konrad Lorenz. Cuento con experiencia en atención clínica y he tenido el privilegio de acompañar a consultantes que han logrado avances significativos en sus procesos de cambio.',
      'Trabajo desde un enfoque cognitivo-conductual, respaldado científicamente, y creo profundamente en el poder de la terapia para transformar vidas. Al igual que tú, he vivido momentos de ansiedad, y por eso entiendo cuán desafiante puede ser enfrentarla.',
    ],
  },
  {
    id: 'aura-vargas',
    name: 'Aura María Vargas',
    role: 'Psicóloga clínica y de la salud',
    photo: '/equipo/aura-vargas.jpg',
    summary:
      'Formación en Psicología Clínica y de la Salud. Interviene en ansiedad, desregulación emocional y duelo.',
    bio: [
      'Soy Aura Vargas, psicóloga con formación en Psicología Clínica y de la Salud. Cuento con más de 2 años de experiencia en procesos terapéuticos, realizando intervención en ansiedad, desregulación emocional, duelo, entre otros.',
    ],
  },
];
