'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon, type IconName } from './ui/Icon';
import { EPAYCO_PLAN_URL } from '@/lib/membership';

const SITUATIONS: {
  id: string;
  icon: IconName;
  color: string;
  label: string;
  title: string;
  text: string;
  points: string[];
}[] = [
  {
    id: 'panico',
    icon: 'heart',
    color: '#e8363b',
    label: 'Me dan ataques de pánico',
    title: 'Cuando el cuerpo se acelera de golpe',
    text: 'El corazón late fuerte, falta el aire y sientes que pierdes el control. Entender qué está pasando en tu cuerpo le quita gran parte del miedo, y tener un ejercicio a mano te ayuda a frenar la escalada.',
    points: [
      'Audios guiados de respiración para usar en el momento',
      'Videos que explican, paso a paso, qué es una crisis de pánico',
      'Técnicas de aterrizaje para volver al presente',
    ],
  },
  {
    id: 'pensamientos',
    icon: 'brain',
    color: '#2b93d1',
    label: 'Mi mente no para de pensar',
    title: 'Pensamientos que no se detienen',
    text: 'La ansiedad hace que la mente anticipe lo peor una y otra vez. Con la Terapia Cognitivo-Conductual aprendes a reconocer esos pensamientos y a dejar de creerles todo lo que dicen.',
    points: [
      'Lecciones sobre pensamientos ansiosos y cómo cuestionarlos',
      'Registros en PDF para practicar la reestructuración cognitiva',
      'Ejercicios cortos para salir del bucle',
    ],
  },
  {
    id: 'estres',
    icon: 'sun',
    color: '#eeab52',
    label: 'Vivo preocupado y en alerta',
    title: 'Preocupación constante, todos los días',
    text: 'Cuando vives en alerta, el cansancio y la tensión se acumulan. Pequeños cambios diarios, practicados con constancia, ayudan a que el cuerpo y la mente vuelvan a descansar.',
    points: [
      'Rutinas y ejercicios para bajar la tensión del día',
      'Guías prácticas para organizar tus preocupaciones',
      'Audios de relajación para terminar el día',
    ],
  },
  {
    id: 'entender',
    icon: 'book',
    color: '#12a04a',
    label: 'Quiero entender mi ansiedad',
    title: 'Empezar por entender',
    text: 'Si apenas estás empezando, lo más útil es comprender de dónde viene la ansiedad y por qué aparece. Con información clara dejas de sentirte perdido y sabes por dónde avanzar.',
    points: [
      'Videos con explicaciones claras, sin tecnicismos',
      'Artículos cortos para repasar cuando lo necesites',
      'Un recorrido a tu ritmo, desde el celular o el computador',
    ],
  },
];

export function SituationPicker() {
  const [active, setActive] = useState(SITUATIONS[0].id);
  const current = SITUATIONS.find((s) => s.id === active) ?? SITUATIONS[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
      <div role="tablist" aria-label="Elige lo que te está pasando" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        {SITUATIONS.map((s) => {
          const selected = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`panel-${s.id}`}
              onClick={() => setActive(s.id)}
              className={`group flex min-h-[4.5rem] cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                selected
                  ? 'border-ink bg-ink text-white shadow-lg'
                  : 'border-ink/10 bg-white text-ink hover:border-ink/40'
              }`}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: selected ? 'rgba(255,255,255,0.12)' : `${s.color}1f`, color: selected ? '#fff' : s.color }}
              >
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <span className="text-lg font-semibold leading-snug">{s.label}</span>
              <Icon
                name="arrow-right"
                className={`ml-auto h-5 w-5 shrink-0 transition-transform ${selected ? 'translate-x-0' : 'opacity-40 group-hover:translate-x-1'}`}
              />
            </button>
          );
        })}
      </div>

      <div
        key={current.id}
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        className="animate-fade-up rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_rgba(11,31,58,0.08)] sm:p-10 lg:col-span-7"
      >
        <span className="block h-1.5 w-16 rounded-full" style={{ backgroundColor: current.color }} />
        <h3 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl">{current.title}</h3>
        <p className="mt-4 text-lg leading-relaxed text-body">{current.text}</p>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-ink/60">Lo que encuentras en la membresía</p>
        <ul className="mt-4 space-y-3">
          {current.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-lg text-ink">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-calm/15 text-calm">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href={EPAYCO_PLAN_URL}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
          >
            Quiero empezar
            <Icon name="arrow-right" className="h-5 w-5" />
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex h-14 items-center justify-center rounded-full border border-ink/20 px-7 text-lg font-semibold text-ink transition-colors hover:border-ink"
          >
            Ver el catálogo
          </Link>
        </div>
        <p className="mt-6 text-sm text-body">
          El contenido es educativo y no reemplaza la terapia. Si estás en crisis, busca ayuda profesional de inmediato.
        </p>
      </div>
    </div>
  );
}
