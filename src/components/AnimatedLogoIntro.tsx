'use client';

import { useEffect, useState } from 'react';

const svgMarkup = `
<svg class="logo w-full max-w-[980px] h-auto block mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1526 540" role="img" aria-label="Libre de Ansiedad by Nelson Arturo">
<style>
  .bg{fill:#e6e6e6}
  .fb{transform-box:fill-box;transform-origin:center}

  /* ---------- AVES (entran primero, dejan estela) ---------- */
  .fly{animation:fly 1.5s cubic-bezier(.3,.9,.3,1) var(--d) both}
  @keyframes fly{
    0%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(25deg) scale(.7)}
    12%{opacity:1}
    55%{transform:translate(var(--mx),var(--my)) rotate(-14deg) scale(1)}
    100%{opacity:1;transform:none}}
  .flap{animation:flap .32s ease-in-out var(--d) 5}
  @keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}
  .float{animation:float 3.8s ease-in-out calc(var(--d) + 1.8s) infinite}
  @keyframes float{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(5px,-8px) rotate(-3deg)}}
  .bird{stroke:#000;stroke-width:4;stroke-linejoin:round}
  .trail{fill:none;stroke-width:5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;
         animation:trail 1.7s ease-out var(--d) both}
  @keyframes trail{
    0%{stroke-dashoffset:1;opacity:.9}
    60%{stroke-dashoffset:0;opacity:.9}
    100%{stroke-dashoffset:0;opacity:0}}

  /* ---------- CEREBRO ---------- */
  .outline{fill:#000;fill-opacity:0;stroke:#000;stroke-width:14;stroke-linejoin:round;
     stroke-dasharray:1;stroke-dashoffset:1;
     animation:draw 1.3s cubic-bezier(.6,0,.3,1) .9s both,fillin .4s ease-out 1.9s forwards}
  @keyframes draw{to{stroke-dashoffset:0}}
  @keyframes fillin{to{fill-opacity:1}}
  .gap{fill:#e6e6e6;opacity:0;animation:fadein .4s ease-out 2s forwards}
  @keyframes fadein{to{opacity:1}}
  .p{stroke:#000;stroke-width:5;stroke-linejoin:round;opacity:0;
     animation:paint .9s cubic-bezier(.34,1.7,.5,1) var(--d) both}
  @keyframes paint{
    0%{opacity:0;transform:scale(0) rotate(var(--r))}
    30%{opacity:1}
    100%{opacity:1;transform:none}}
  .w{animation:slide .8s cubic-bezier(.2,.9,.2,1) var(--d) both}
  @keyframes slide{
    0%{opacity:0;transform:translate(var(--x),var(--y)) scale(.6)}
    100%{opacity:1;transform:none}}
  .breathe{animation:breathe 4.5s ease-in-out 3.8s infinite}
  @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}

  /* ---------- ONDA DE CALMA + DESTELLOS ---------- */
  .ring{fill:none;stroke-width:6;vector-effect:non-scaling-stroke;opacity:0;
        animation:ring 1.6s cubic-bezier(.1,.7,.3,1) var(--d) both}
  @keyframes ring{0%{opacity:.85;transform:scale(1)}100%{opacity:0;transform:scale(40)}}
  .spark{opacity:0;animation:spark 1.2s cubic-bezier(.1,.8,.3,1) 3s both}
  @keyframes spark{
    0%{opacity:1;transform:translate(0,0) scale(1)}
    100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}}

  /* ---------- TEXTO ---------- */
  .rise{animation:rise .85s cubic-bezier(.2,.9,.2,1) var(--d) both}
  @keyframes rise{0%{transform:translateY(200px) skewY(8deg)}100%{transform:none}}
  .settle{animation:settle 1s ease-out var(--s) both}
  @keyframes settle{
    0%{transform:translate(0,0)}12%{transform:translate(5px,-3px)}28%{transform:translate(-5px,3px)}
    44%{transform:translate(3px,2px)}60%{transform:translate(-2px,-1px)}80%{transform:translate(1px,1px)}
    100%{transform:translate(0,0)}}
  .by{opacity:0;letter-spacing:12px;animation:by 1.1s ease-out 5s forwards}
  @keyframes by{to{opacity:1;letter-spacing:0}}
  text{font-family:Ubuntu,"Segoe UI",Verdana,sans-serif;font-weight:700;fill:#000}

  @media (prefers-reduced-motion:reduce){
    *{animation:none!important}
    .p,.w,.fly,.gap,.by{opacity:1!important}
    .outline{stroke-dashoffset:0;fill-opacity:1}
    .trail,.ring,.spark{display:none}
  }
</style>

<defs>
  <clipPath id="c1"><rect x="530" y="90" width="900" height="180"/></clipPath>
  <clipPath id="c2"><rect x="530" y="278" width="960" height="175"/></clipPath>
</defs>

<rect class="bg" width="1526" height="540"/>

<!-- ESTELAS -->
<path class="trail" pathLength="1" style="--d:0s" stroke="#133a73" d="M-60,330 C20,300 40,200 95,135"/>
<path class="trail" pathLength="1" style="--d:.15s" stroke="#b0106a" d="M-60,380 C80,330 120,200 187,85"/>
<path class="trail" pathLength="1" style="--d:.3s" stroke="#2b93d1" d="M-60,280 C0,250 30,170 68,125"/>

<!-- CEREBRO -->
<g class="fb breathe">
  <path class="outline" pathLength="1" d="M300,105 C270,95 230,105 205,125 C170,140 140,175 140,220 C125,250 130,300 150,330 C145,375 175,415 215,430 C245,445 280,440 300,430 C320,440 355,445 385,430 C425,420 462,385 462,335 C490,300 485,260 462,245 C468,200 445,150 410,128 C385,105 335,95 300,105 Z"/>
  <rect class="gap" x="296" y="112" width="20" height="314" rx="8"/>

  <path class="p fb" style="--r:-120deg;--d:2.0s" fill="#12a04a" d="M148,248 C140,205 155,168 192,150 L246,152 L252,208 L226,238 Z"/>
  <path class="p fb" style="--r:90deg;--d:2.1s" fill="#8dc42a" d="M222,136 C238,116 268,112 288,120 L288,162 L256,166 L240,150 Z"/>
  <path class="p fb" style="--r:-90deg;--d:2.2s" fill="#eeab52" d="M160,262 L286,246 L286,302 L252,322 L202,300 Z"/>
  <path class="p fb" style="--r:120deg;--d:2.3s" fill="#ec6f31" d="M142,264 L202,302 L242,322 L184,332 C152,316 142,292 142,264 Z"/>
  <path class="p fb" style="--r:-100deg;--d:2.4s" fill="#e8363b" d="M166,372 L242,338 L286,342 L286,425 C240,430 192,412 166,372 Z"/>

  <path class="p fb" style="--r:120deg;--d:2.15s" fill="#133a73" d="M325,120 L385,126 L362,186 L325,202 Z"/>
  <path class="p fb" style="--r:-90deg;--d:2.25s" fill="#2b93d1" d="M388,138 C432,152 464,200 466,250 L412,262 L372,216 Z"/>
  <path class="p fb" style="--r:100deg;--d:2.35s" fill="#b0106a" d="M470,266 C480,322 460,382 410,410 L388,352 L370,286 Z"/>
  <path class="p fb" style="--r:-120deg;--d:2.45s" fill="#d6006f" d="M325,238 L362,282 L392,352 L392,402 L325,406 Z"/>
  <path class="p fb" style="--r:90deg;--d:2.55s" fill="#a01060" d="M325,346 L387,352 L325,372 Z"/>
  <path class="p fb" style="--r:-100deg;--d:2.6s" fill="#d6006f" d="M325,376 L392,366 L402,406 C382,426 352,430 325,428 Z"/>

  <path class="w" style="--x:-160px;--y:-30px;--d:2.75s" fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round" d="M224,232 L260,190 L286,166 L286,210 L242,262 Z"/>
  <path class="w" style="--x:-170px;--y:40px;--d:2.85s" fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round" d="M160,342 L240,312 L286,338 L286,366 L240,370 L200,356 L160,360 Z"/>
  <path class="w" style="--x:170px;--y:-40px;--d:2.95s" fill="#fff" stroke="#000" stroke-width="5" stroke-linejoin="round" d="M330,202 L388,152 L380,226 L442,262 L360,276 L330,242 Z"/>
</g>

<!-- ONDA DE CALMA + DESTELLOS -->
<circle class="ring fb" style="--d:3s" cx="300" cy="270" r="8" stroke="#2b93d1"/>
<circle class="ring fb" style="--d:3.15s" cx="300" cy="270" r="8" stroke="#d6006f"/>
<g>
  <circle class="spark" cx="300" cy="270" r="6" fill="#12a04a" style="--dx:-260px;--dy:-120px"/>
  <circle class="spark" cx="300" cy="270" r="5" fill="#eeab52" style="--dx:-220px;--dy:130px"/>
  <circle class="spark" cx="300" cy="270" r="6" fill="#e8363b" style="--dx:-90px;--dy:210px"/>
  <circle class="spark" cx="300" cy="270" r="5" fill="#8dc42a" style="--dx:-120px;--dy:-220px"/>
  <circle class="spark" cx="300" cy="270" r="6" fill="#2b93d1" style="--dx:260px;--dy:-130px"/>
  <circle class="spark" cx="300" cy="270" r="5" fill="#d6006f" style="--dx:230px;--dy:140px"/>
  <circle class="spark" cx="300" cy="270" r="6" fill="#b0106a" style="--dx:100px;--dy:210px"/>
  <circle class="spark" cx="300" cy="270" r="5" fill="#133a73" style="--dx:110px;--dy:-220px"/>
</g>

<!-- AVES -->
<g class="fb fly" style="--d:0s;--sx:-155px;--sy:200px;--mx:-68px;--my:116px"><g class="fb flap" style="--d:0s"><g class="fb float" style="--d:0s">
  <path class="bird" fill="#133a73" d="M40,185 L124,160 L136,80 L152,126 L118,192 Z"/></g></g></g>
<g class="fb fly" style="--d:.15s;--sx:-247px;--sy:300px;--mx:-96px;--my:177px"><g class="fb flap" style="--d:.15s"><g class="fb float" style="--d:.6s">
  <path class="bird" fill="#b0106a" d="M150,78 L190,98 L224,58 L218,90 L190,106 Z"/></g></g></g>
<g class="fb fly" style="--d:.3s;--sx:-128px;--sy:160px;--mx:-56px;--my:88px"><g class="fb flap" style="--d:.3s"><g class="fb float" style="--d:1.1s">
  <path class="bird" fill="#2b93d1" d="M40,125 L76,138 L98,98 L92,132 L76,146 Z"/></g></g></g>

<!-- TEXTO: LIBRE DE (letra por letra) -->
<g clip-path="url(#c1)">
  <g class="rise" style="--d:3.0s"><text x="548" y="255" font-size="205" textLength="92" lengthAdjust="spacingAndGlyphs">L</text></g>
  <g class="rise" style="--d:3.07s"><text x="650" y="255" font-size="205" textLength="40" lengthAdjust="spacingAndGlyphs">I</text></g>
  <g class="rise" style="--d:3.14s"><text x="700" y="255" font-size="205" textLength="112" lengthAdjust="spacingAndGlyphs">B</text></g>
  <g class="rise" style="--d:3.21s"><text x="822" y="255" font-size="205" textLength="114" lengthAdjust="spacingAndGlyphs">R</text></g>
  <g class="rise" style="--d:3.28s"><text x="946" y="255" font-size="205" textLength="98" lengthAdjust="spacingAndGlyphs">E</text></g>
  <g class="rise" style="--d:3.42s"><text x="1109" y="255" font-size="205" textLength="120" lengthAdjust="spacingAndGlyphs">D</text></g>
  <g class="rise" style="--d:3.49s"><text x="1239" y="255" font-size="205" textLength="98" lengthAdjust="spacingAndGlyphs">E</text></g>
</g>

<!-- TEXTO: ANSIEDAD (entra y se asienta temblando) -->
<g clip-path="url(#c2)">
  <g class="rise" style="--d:3.3s"><g class="settle" style="--s:4.1s"><text x="548" y="440" font-size="205" textLength="118" lengthAdjust="spacingAndGlyphs">A</text></g></g>
  <g class="rise" style="--d:3.38s"><g class="settle" style="--s:4.2s"><text x="680" y="440" font-size="205" textLength="105" lengthAdjust="spacingAndGlyphs">N</text></g></g>
  <g class="rise" style="--d:3.46s"><g class="settle" style="--s:4.3s"><text x="799" y="440" font-size="205" textLength="95" lengthAdjust="spacingAndGlyphs">S</text></g></g>
  <g class="rise" style="--d:3.54s"><g class="settle" style="--s:4.4s"><text x="908" y="440" font-size="205" textLength="40" lengthAdjust="spacingAndGlyphs">I</text></g></g>
  <g class="rise" style="--d:3.62s"><g class="settle" style="--s:4.5s"><text x="962" y="440" font-size="205" textLength="98" lengthAdjust="spacingAndGlyphs">E</text></g></g>
  <g class="rise" style="--d:3.7s"><g class="settle" style="--s:4.6s"><text x="1074" y="440" font-size="205" textLength="120" lengthAdjust="spacingAndGlyphs">D</text></g></g>
  <g class="rise" style="--d:3.78s"><g class="settle" style="--s:4.7s"><text x="1208" y="440" font-size="205" textLength="118" lengthAdjust="spacingAndGlyphs">A</text></g></g>
  <g class="rise" style="--d:3.86s"><g class="settle" style="--s:4.8s"><text x="1340" y="440" font-size="205" textLength="120" lengthAdjust="spacingAndGlyphs">D</text></g></g>
</g>

<text class="by" x="540" y="515" font-size="52" style="font-weight:500">By Nelson Arturo</text>
</svg>
`;

export function AnimatedLogoIntro() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    // Al cumplirse el tiempo de la animación (~5.5s), revelar la barra y el botón de explorar
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
      window.dispatchEvent(new CustomEvent('lda_show_header'));
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const handleScrollDown = () => {
    window.dispatchEvent(new CustomEvent('lda_show_header'));
    const heroElement = document.getElementById('hero-principal');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#e6e6e6] pt-24 pb-16 flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden select-none border-b border-black/5 shadow-inner">
      {/* Contenedor central del SVG */}
      <div 
        className="w-full max-w-[1050px] mx-auto flex items-center justify-center transition-transform duration-700 hover:scale-[1.01]"
        dangerouslySetInnerHTML={{ __html: svgMarkup }} 
      />

      {/* Botón flotante para avanzar o saltar intro */}
      <div className={`mt-8 sm:mt-12 transition-all duration-700 flex flex-col items-center gap-3 ${
        animationCompleted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          onClick={handleScrollDown}
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Descubrir plataforma</span>
          <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-y-1">
            keyboard_arrow_down
          </span>
        </button>

        <span className="text-xs text-black/50 font-medium tracking-wide uppercase">
          Desliza para continuar
        </span>
      </div>

      {/* Botón discreto en la esquina para saltar la intro antes si el usuario lo desea */}
      {!animationCompleted && (
        <button
          onClick={handleScrollDown}
          className="absolute bottom-6 right-6 text-xs text-black/40 hover:text-black/80 font-medium uppercase tracking-wider transition-colors px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 backdrop-blur-sm cursor-pointer"
        >
          Saltar intro ▾
        </button>
      )}
    </section>
  );
}
