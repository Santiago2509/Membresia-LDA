'use client';

import { useEffect, useState } from 'react';
import { Icon } from './ui/Icon';

type Phase = { key: 'in' | 'hold' | 'out'; label: string; hint: string; seconds: number; scale: number };

// Respiración 4-4-6: exhalar más lento de lo que se inhala ayuda a calmar el cuerpo.
const PHASES: Phase[] = [
  { key: 'in', label: 'Inhala', hint: 'por la nariz, despacio', seconds: 4, scale: 1 },
  { key: 'hold', label: 'Sostén', hint: 'el aire, sin tensión', seconds: 4, scale: 1 },
  { key: 'out', label: 'Exhala', hint: 'por la boca, lento', seconds: 6, scale: 0.55 },
];
const TOTAL_ROUNDS = 4;

type State = { phaseIndex: number; remaining: number; round: number; finished: boolean };
const INITIAL: State = { phaseIndex: 0, remaining: PHASES[0].seconds, round: 1, finished: false };

/** Avanza un segundo el ejercicio (función pura). */
function advance(prev: State): State {
  if (prev.finished) return prev;
  if (prev.remaining > 1) return { ...prev, remaining: prev.remaining - 1 };
  const next = (prev.phaseIndex + 1) % PHASES.length;
  if (next === 0) {
    if (prev.round >= TOTAL_ROUNDS) return { ...prev, finished: true };
    return { phaseIndex: 0, remaining: PHASES[0].seconds, round: prev.round + 1, finished: false };
  }
  return { ...prev, phaseIndex: next, remaining: PHASES[next].seconds };
}

export function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<State>(INITIAL);
  const { phaseIndex, remaining, round, finished } = state;
  const phase = PHASES[phaseIndex];
  // Al terminar las respiraciones, el ejercicio se detiene solo
  const isRunning = running && !finished;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setState(advance), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const reset = () => {
    setRunning(false);
    setStarted(false);
    setState(INITIAL);
  };

  const start = () => {
    if (finished) setState(INITIAL);
    setStarted(true);
    setRunning(true);
  };

  // Escala del círculo: en reposo pequeño; durante la fase, transiciona a la escala de esa fase
  const circleScale = !started || finished ? 0.62 : phase.scale;
  const transitionSeconds = started && isRunning ? phase.seconds : 0.6;

  return (
    <div className="grid grid-cols-1 items-center gap-10 rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(11,31,58,0.08)] sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
      {/* Círculo animado */}
      <div className="relative mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-sky/10" />
        <div
          className="absolute inset-[6%] rounded-full bg-gradient-to-br from-sky/80 via-brand/80 to-calm/70 shadow-[0_0_80px_rgba(43,147,209,0.35)]"
          style={{
            transform: `scale(${circleScale})`,
            transition: `transform ${transitionSeconds}s ease-in-out`,
          }}
        />
        <div className="relative z-10 text-center text-white" aria-live="polite">
          {!started && !finished && <p className="font-display text-3xl">Listo</p>}
          {started && !finished && (
            <>
              <p className="font-display text-4xl sm:text-5xl">{phase.label}</p>
              <p className="mt-1 text-5xl font-semibold tabular-nums sm:text-6xl">{remaining}</p>
            </>
          )}
          {finished && <p className="px-6 font-display text-3xl">¡Muy bien!</p>}
        </div>
      </div>

      {/* Instrucciones y controles */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-calm">Pruébalo ahora · gratis</p>
        <h2 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
          Un minuto para bajar la ansiedad
        </h2>

        {!finished ? (
          <p className="mt-5 text-lg leading-relaxed text-body">
            Respiración 4-4-6: inhala 4 segundos, sostén 4 y exhala 6. Exhalar más lento de lo que inhalas le indica a
            tu cuerpo que puede calmarse. Sigue el círculo durante {TOTAL_ROUNDS} respiraciones.
          </p>
        ) : (
          <p className="mt-5 text-lg leading-relaxed text-body animate-fade-up">
            Así se sienten las herramientas de la membresía: ejercicios cortos y prácticos que puedes usar en el momento
            en que la ansiedad sube. Dentro encontrarás muchos más, guiados por el Psic. Nelson Arturo.
          </p>
        )}

        {started && !finished && (
          <div className="mt-6" aria-hidden="true">
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i < round - 1 ? 'bg-calm' : i === round - 1 ? 'bg-calm/40' : 'bg-ink/10'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-body">
              Respiración {round} de {TOTAL_ROUNDS} · {phase.hint}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!isRunning ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-8 text-lg font-semibold text-white transition-colors hover:bg-brand"
            >
              <Icon name={finished ? 'refresh' : 'play'} className="h-5 w-5" />
              {finished ? 'Repetir ejercicio' : started ? 'Continuar' : 'Empezar ejercicio'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRunning(false)}
              className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-8 text-lg font-semibold text-white transition-colors hover:bg-brand"
            >
              <Icon name="pause" className="h-5 w-5" />
              Pausar
            </button>
          )}
          {started && !finished && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-14 cursor-pointer items-center justify-center rounded-full border border-ink/20 px-8 text-lg font-semibold text-ink transition-colors hover:border-ink"
            >
              Reiniciar
            </button>
          )}
          {finished && (
            <a
              href="#precio-membresia"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/20 px-8 text-lg font-semibold text-ink transition-colors hover:border-ink"
            >
              Ver la membresía
              <Icon name="arrow-right" className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
