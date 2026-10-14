import Link from 'next/link';
import { CheckoutButton } from './CheckoutButton';

export function Hero() {
  return (
    <section id="hero-principal" className="relative overflow-hidden py-16 lg:py-24 border-b border-black/5">
      {/* Luces y auras orgánicas de fondo */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-[#2b93d1]/10 blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/2 -right-20 h-[500px] w-[500px] rounded-full bg-[#12a04a]/10 blur-3xl"></div>
      
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Columna Izquierda: Mensaje Central y Propuesta de Valor */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            
            {/* Badge de Autoridad Médica / Sereno */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-black/5 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
              <span className="font-label-sm text-xs font-bold text-neutral-700 tracking-wider uppercase">
                Psicología Clínica Basada en Evidencia
              </span>
            </div>
            
            {/* Título Principal */}
            <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl text-[#001531] tracking-tight font-extrabold leading-[1.15]">
              Vuelve a sentir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#133a73] to-[#12a04a]">calma y control</span> en tu vida cotidiana
            </h1>
            
            {/* Descripción */}
            <p className="font-body-lg text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
              Un programa clínico y estructurado impartido por el <strong>Psic. Nelson Arturo</strong>. Aprende técnicas prácticas para desactivar los síntomas de la ansiedad, el estrés crónico y los ataques de pánico con rigor científico y profunda calidez humana.
            </p>
            
            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <CheckoutButton />
              <Link 
                href="/catalogo" 
                className="h-12 px-6 rounded-full bg-white/90 text-neutral-800 hover:text-primary font-label-md text-sm font-semibold flex items-center justify-center gap-1.5 border border-black/10 shadow-sm hover:shadow hover:bg-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Explorar Catálogo</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            
            {/* Barra de Confianza con Miembros Reales */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-black/10 w-full mt-2">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#133a73] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">NA</div>
                <div className="w-8 h-8 rounded-full bg-[#12a04a] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">SM</div>
                <div className="w-8 h-8 rounded-full bg-[#2b93d1] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                </div>
              </div>
              <p className="font-label-sm text-xs sm:text-sm text-neutral-600">
                <strong className="text-neutral-900">+1,800 pacientes y alumnos</strong> transformando su bienestar emocional.
              </p>
            </div>

          </div>
          
          {/* Columna Derecha: Foto Real de Nelson Arturo con Tarjetas Flotantes */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Aura circular detrás de la foto */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#133a73]/15 via-[#12a04a]/10 to-transparent rounded-full filter blur-2xl transform scale-90"></div>

            <div className="relative w-full max-w-[420px] flex justify-center">
              
              {/* Imagen transparente de Nelson Arturo */}
              <div className="relative z-10 w-full max-w-[380px] drop-shadow-2xl">
                <img 
                  alt="Psicólogo Clínico Nelson Arturo - Libre de Ansiedad" 
                  className="w-full h-auto object-contain filter contrast-105" 
                  src="/foto%20inicio%20nelson.png"
                />
              </div>

              {/* Tarjeta Flotante Superior: Especialista */}
              <div className="absolute -top-3 right-0 sm:-right-4 z-20 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl border border-black/5 flex items-center gap-2.5 max-w-[210px] animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900 truncate">Psic. Nelson Arturo</span>
                  <span className="text-[10px] text-neutral-500 font-medium truncate">Especialista Clínico</span>
                </div>
              </div>

              {/* Tarjeta Flotante Inferior: Enfoque Clínico */}
              <div className="absolute -bottom-4 left-0 sm:-left-4 z-20 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-black/5 flex items-center gap-3 max-w-[240px]">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#133a73] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900 truncate">Terapia Cognitiva</span>
                  <span className="text-[10px] text-neutral-500 font-medium truncate">Ejercicios paso a paso</span>
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
}
