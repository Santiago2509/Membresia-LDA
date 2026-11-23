// Testimonios reales de pacientes, tomados de https://nelsonarturopsicologo.com/testimonios/
// Solo se corrigió ortografía evidente (p. ej. "eh tenido" -> "he tenido"); el resto es textual.
// No se usan fotos: en la web original varias eran imágenes de banco junto a nombres reales.

export type Testimonial = {
  id: string;
  name: string;
  context: string;
  kind: 'individual' | 'grupal';
  place?: string;
  /** Frase corta y textual para la portada. */
  highlight?: string;
  text: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    "id": "mabel",
    "name": "Mabel",
    "context": "Curso grupal con la psicóloga Ingrid Argüello (dic. 2023)",
    "kind": "grupal",
    "text": "Desde que comencé el curso con la psicóloga Ingrid, comencé a hacer ejercicio lo que me ha ayudado a mejorar mis síntomas, no ha vuelto la ansiedad, también incrementé el hacer varias veces al día la respiración, aplico las meditaciones, lo que también me ha ayudado a mejorar mi vida espiritual y acercarme más a Dios."
  },
  {
    "id": "claudia-escorcia",
    "name": "Claudia Escorcia",
    "context": "Curso grupal con la psicóloga Ingrid Argüello (dic. 2023)",
    "kind": "grupal",
    "text": "Antes de comenzar el curso tenía fallas en mi autoestima, no trabajaba después de dos años de tener ansiedad muy fuerte, después del curso, volví a mi profesión, el debate socrático siempre está conmigo, esto me ha ayudado a creer en mí y a dejar el miedo, lo apliqué tanto, que ahora solo utilizo en las situaciones que me presionan del momento, me gustaría hacer otro curso para afianzar más mis conocimientos. Yo ahora sigo leyendo, haciendo mis ejercicios, pero siempre utilizo el debate para manejar los pensamientos, ya que me saca del pensamiento negativo, o canto de forma ridícula el problema con la técnica de defusión. La gente me ha sentido mucho mejor. Antes del curso, los fines de semana hacía crisis, donde quería vomitar, pelear con todo el mundo, pero ya no, me he ido estabilizando. Voy para otros retos más, donde me he ido disciplinando, me he enfrentado a mis temores afectivos del pasado, he salido con chicos ya no me estreso ni tiemblo, he vuelto a ser yo, aceptándome a mí misma, he leído todos los libros que me recomendaron y otros más. El curso fue una bendición, me gustaría otro curso para seguir aprendiendo, en esta oportunidad hice Clic con el curso, porque era lo que yo sentía, lo que yo vivía, veía que muchas cosas hacía mal, solté muchas cosas que tenía guardadas y me ayudó demasiado.",
    "highlight": "Volví a mi profesión. He vuelto a ser yo, aceptándome a mí misma."
  },
  {
    "id": "lucia-sierra",
    "name": "Lucía Sierra",
    "context": "Curso grupal con la psicóloga Ingrid Argüello (dic. 2023)",
    "kind": "grupal",
    "text": "Desde que hice el curso he retomado varias cosas que no hacía, ahora salgo más, puedo tomar el camión o autobús e ir a mis citas médicas, ya que solo me trasladaba en taxi y me daba ansiedad transportarme en autobús, realizo mi respiración controlo mis síntomas, utilizo mucho el debate socrático, la meditación me ayuda a relajar, mi psiquiatra ha dicho que pronto me va disminuir la dosis de clonazepam ya que he estado mejor. Me cuido con la alimentación ya que he tenido otros problemas médicos que debo seguir tratando. Ya no tengo tantos pensamientos catastróficos con la muerte, acepto que en algún momento llegará y que en la vida es natural este tipo de pensamientos."
  },
  {
    "id": "lorena-duran",
    "name": "Lorena Durán",
    "context": "Paciente de la psicóloga Camila Antilaf",
    "kind": "individual",
    "text": "Mi experiencia con la Ansiedad inicio en enero 2023, un día de repente comencé a sentir que mi corazón latía muy fuerte, me sentía confundida como si me fuera a desmayar, sentía las manos dormidas y sudaba frío, inmediatamente llamé al servicio médico, me hicieron un electrocardiograma y todo salió bien, me recomendaron hacer seguimiento con la EPS, tuve que hacerme muchos exámenes, tiroides, hormonas, azúcar en sangre, holter cardíaco, pero todo salía bien. A finales del mes de abril tenía programado un viaje al exterior, ya tenía todo listo para mi viaje y el día anterior fui a cenar con una amiga, al llegar al lugar me comencé a sentir muy mal, temblaba, no podía estar tranquila, sentía que algo malo me iba a pasar, no logre calmarme hasta llegar a mi casa, debido a esto no pude hacer mi viaje, perdí toda mi inversión porque no era capaz de ir a un aeropuerto y mucho menos viajar sola. Ese mismo día comencé a buscar información sobre la ansiedad y encontré un vídeo del doctor Nelson hablando sobre su experiencia con la ansiedad, ahí me di cuenta de que realmente lo que tenía era ansiedad porque me vi reflejada en todo lo que el doctor decía en el vídeo, inmediatamente sin perder tiempo contacte al equipo del doctor e inicie tratamiento con la doctora Camila el lunes siguiente. Durante el tratamiento con la doctora recibí mucha información que me ayudo a entender lo que me estaba pasando y a saber cómo manejarlo y a ser consciente de que realmente si me esforzaba, iba a poder superar la ansiedad. Comencé a hacer todos los ejercicios que la doctora me recomendaba, al principio no era fácil porque yo sentía miedo incluso de salir de mi casa y no me sentía capaz de estar en un lugar público lleno de personas, sin embargo, me esforcé para hacer todo lo que la doctora me recomendaba, ella me apoyó y me acompaño mucho durante todo el proceso, y me dio todas las herramientas que al día de hoy me permiten decir que supere la ansiedad. Ahora puedo nuevamente salir sola sin ningún problema, puedo hacer todas mis actividades, ya he tenido que viajar sola y aunque a veces la ansiedad aparece en alguna medida, tengo las herramientas suficientes para poder manejarla.",
    "highlight": "Ahora puedo nuevamente salir sola sin ningún problema, puedo hacer todas mis actividades."
  },
  {
    "id": "johel-david-solano",
    "name": "Johel David Solano",
    "context": "Paciente de la psicóloga Camila Antilaf",
    "kind": "individual",
    "text": "Mi nombre es Johel, soy de Costa Rica, y este es un resumen de mi experiencia con la ansiedad: Casi a finales del año 2021, llegué del trabajo a mi casa, (estaba en el turno de noche, que no me gusta mucho), me senté a tomar café mirando tv, y de pronto empecé a ver borroso y sentí una sensación de frío en el cuerpo y mi corazón empezó a latir muy rápido, yo traté de calmarme, dejé de ver tv y me acosté a dormir, pensando que seguro había sido por el cansancio del trabajo. Dormí tal vez unas horas, pero me desperté y mi corazón seguía latiendo muy rápido, me levanté de la cama y le conté a mi mamá, recuerdo que busqué en Google y me salió que podía ser la presión alta, entonces fui a una clínica y me empecé a sentir peor, sin aire y mareado, me pasaron con la doctora y ella me revisó la presión y todo estaba bien, pero mi corazón seguía igual de rápido, ahí fue cuando la doctora me dijo: estás teniendo un ataque de ansiedad, yo ni sabía qué era eso, me dijo que todo iba a estar bien y de hecho, me calmé un poco y mi corazón bajó el ritmo y me fui a mi casa. Ese fue el principio de un año muy difícil, donde sentí que algo había cambiado en mí y me hacía sentir incómodo todos los días, con mil síntomas que me hacían creer que tenía una enfermedad o que me iba a dar un ataque al corazón, el cual fue mi mayor miedo, bajé como 15 kilos, solo comía una vez al día, hacía el menor esfuerzo físico que podía, porque me daba miedo sentir mi corazón latiendo, empecé a tener ataques de pánico debido al miedo que le tenía a esos síntomas y estaba siempre vigilante de las sensaciones de mi cuerpo, en el trabajo me tomaba la presión arterial cada vez que podía y revisaba mi frecuencia cardíaca, casi que en todo momento, los ataques de pánico aumentaron de intensidad y yo me iba para el Hospital, donde me decían que todo estaba bien, que era solo ansiedad, pero yo no creía y fui donde la doctora que me vio la primera vez y llegué tan mal que me recetó antidepresivos para calmar la ansiedad, me dijo que era una enfermedad mental, seguro heredada y que iba a tener que tomar pastillas toda mi vida, fue un golpe duro en ese momento. Tomé las pastillas por 4 meses, me ayudaron tal vez un mes, pero después más bien se intensificaron los ataques y pasaba yendo al menos una vez a la semana al hospital, fue tanto que renuncié a mi trabajo, ya no podía más, no tenía fuerza, me sentía cansado y no tenía buen rendimiento, me sentía demasiado estresado, pensé que tal vez sin el estrés del trabajo iba a mejorar todo, fue lo contrario, ya no tenía nada en qué ocuparme y las sensaciones de la ansiedad ocupaban mi mente todo el día y los ataques de pánico se hacían más seguidos, me daba miedo salir de la casa y después hasta en mi casa me sentía inseguro. Fue ahí donde busqué ayuda. Vi en YouTube un vídeo de la gente de Libre de Ansiedad, donde hablaban sobre las terapias que ellos usaban con los pacientes y me gustó mucho la forma que ellos abordaban el tema, los contacté, me atendieron súper rápido, tomaron mis datos y me asignaron a mi Psicóloga: Camila Antilaf, fue como un ángel que llegó a mi vida en el peor momento posible y empezamos las sesiones. Fue difícil al principio, en medio de las sesiones tenía ataques de ansiedad y tuvimos que detener algunas. Las sesiones duraron varios meses, aprendí mucho sobre la ansiedad, empecé a poner en práctica todo lo que me enseñaron en la terapia, me puse a terminar mis estudios, empecé a ir al gimnasio y tratar de hacer mi vida normal, fue muy difícil al principio, la ansiedad te hace creer que no puedes, te quita la confianza y te llena de miedo. En el momento que escribo esto, 29 de abril del 2024, ha pasado un año desde la última sesión con Cami, veo hacia atrás y me doy cuenta que mi vida ahora es mejor que antes, terminé mis estudios, sigo ejercitándome, mi salud mental es mejor y es mi prioridad. Yo recomiendo 100% a la gente de Libre de ansiedad, son profesionales que te van a ayudar a salir adelante de esa situación, fue mi mejor inversión",
    "place": "Costa Rica",
    "highlight": "Veo hacia atrás y me doy cuenta que mi vida ahora es mejor que antes. Fue mi mejor inversión."
  },
  {
    "id": "digna-robles",
    "name": "Digna Robles",
    "context": "Paciente de la psicóloga Ingrid Argüello",
    "kind": "individual",
    "text": "Soy Digna Robles y he tenido ansiedad por más 12 años tenía muchas fobias, entre ellas la agorafobia; salir de casa sola para mi era muy difícil pero con la terapia poco a poco me fui exponiendo a los lugares y a las actividades que me causaban ansiedad y hace poco empecé a trabajar en un trabajo en el cual tengo que viajar en transporte público y está un poco lejos de donde vivo pero con la ayuda de la terapia que he recibido de la doctora Ingrid he aprendido a controlar los síntomas de ansiedad, la doctora Ingrid me ha enseñado a controlar mis pensamientos y detenerme cuando estoy pensando demás y enfocarme en lo realmente importante y eso hago cuando salgo de casa pienso en lo que voy a hacer y lo importante que es para mi hacerlo antes de la terapia cuando yo iba a salir lo primero que venía a mi mente era que iba a tener otro ataque de pánico al lugar donde iba a ir, gracias a Libre de ansiedad y a la doctora Ingrid ahora puedo hacer muchas cosas por mi misma.",
    "highlight": "Gracias a Libre de Ansiedad y a la doctora Ingrid ahora puedo hacer muchas cosas por mí misma."
  },
  {
    "id": "leidy",
    "name": "Leidy",
    "context": "Paciente de la psicóloga Ingrid Argüello",
    "kind": "individual",
    "text": "Después de terminar tratamiento con Libre de Ansiedad con la psicóloga Ingrid por 6 meses, tengo una vida tranquila, concentrada laboralmente y en tener un hijo. Desde que estaba en Venezuela, de niña era muy nerviosa o ansiosa, me auto exigía mucho en el colegio y ser buena niña. Después de pandemia viviendo sola en Chile aumento la ansiedad, empezaron los síntomas más fuertes, al ir al médico me dijeron que debía ir al psiquiatra, tome terapias con dos psicólogos antes de Ingrid, pero no tuve una buena experiencia ya que ellos no era especializados, la primera psicóloga me dejo muy asustada solo veía que me podía curar con medicamentos y me hablaba en términos que no entendía, solo tome dos sesiones, luego pase a otro psicólogo en Chile porque estabas teniendo muchas dificultades para dormir y me ayudo con los ataques de pánico, me dio de alta en tres meses pero me seguía sintiendo mal. Yo seguí investigando sobre la ansiedad y empecé a los dos años con Ingrid, mejore las técnicas para manejar mis síntomas, aplico lo que me enseño de Mindfulness, en esta terapia fue todo muy distinto, ya que encontré una experta que trabajo mi parte mental. Tenía miedo al silencio y estar sola, ahora puedo estarlo ya que entendí todas mis crisis de pánico. Sé que esto también depende de la motivación y el juicio que le puse a las tareas puestas por Ingrid, tengo guardado todos mis apuntes y archivos que reviso cuando lo necesito. Ahora soy otra y esto también lo ha visto mi esposo, he tenido ansiedad social y a veces, se me intenta despertar en el trabajo, pero aplico mis técnicas y lo controlo, también quisiera comentar que tuve un problema con mi salud y mis plaquetas, afortunadamente ya había comenzado la terapia, lo que me permitió superar mi temor a los medicamentos oncológicos, ella me ayudo bastante con esa situación tan difícil, ahora el médico me dijo que me he recuperado del tema de mis plaquetas y él se sorprendió preguntándome, que estaba haciendo para que realmente me haya mejorado, de hecho le doy gracias a Ingrid y a Libre de Ansiedad por todas las cosas que aprendí y aplico mucho los ejercicios de Mindfullness en cada momento.",
    "place": "Chile"
  },
  {
    "id": "jhoban-arley-piedrahita",
    "name": "Jhoban Arley Piedrahita",
    "context": "Paciente de la psicóloga Ingrid Argüello",
    "kind": "individual",
    "text": "Ingrid, Quiero agradecerte de todo corazón por ayudarme a superar mis miedos y limitaciones. Tu acompañamiento y tus técnicas de psicóloga me permitieron enfrentar mis temores y lograr cosas que antes me parecían imposibles. Gracias por creer en mí y por ser un guía en mi camino hacia venciendo mis propios temores. Espero que sigas ayudando a muchas personas más como yo. Las charlas de Nelson Arturo Psicólogo en su canal libre de ansiedad me sirvieron, tus técnicas de respiración, los dos libros que me diste me ayudaron mucho, la trampa de la felicidad, con sus ejercicios, El arte de no amargarse la vida, qué buen libro, de momento ya me estoy enfocando en mi propósito y cada vez que me llega una situación de ansiedad la manejo con la respiración. Me alegra el trabajo que ustedes hicieron, a verdad algo tan sencillo como un vídeo en YouTube, me aliviaba la vida, bueno que continúe con ese buen trabajo, hay mucha gente que necesita ser salvados"
  },
  {
    "id": "ivan",
    "name": "Iván",
    "context": "Paciente de la psicóloga Ingrid Argüello",
    "kind": "individual",
    "text": "Ingrid me ayudó en un momento muy difícil. Gracias a su tiempo, paciencia y conocimientos pude comprender de otra manera diferentes situaciones que generan malestar e incertidumbre. Además, le compartí distintas experiencias y pensamientos que van más allá de la ansiedad y que también necesitaba contar para conocerme más y sentirme mejor. Las lecturas, los vídeos y los ejercicios a realizar también resultan muy importantes para aprender nuevas técnicas. Luego, el gran desafío es llevar la teoría a la práctica y en ese proceso me encuentro para aceptar con aún mejor predisposición los distintos obstáculos que nos presenta la vida cotidiana. Todo lo aprendido me resultó fundamental para tomar decisiones. También, las personas del equipo siempre fueron compresivas y amables para coordinar, agendar consultas y realizar pagos. Gracias por todo."
  },
  {
    "id": "elia-vasquez",
    "name": "Elia Vásquez",
    "context": "Paciente de la psicóloga Ingrid Argüello",
    "kind": "individual",
    "text": "Soy Elia Vasquez, cuando empecé a sentirme muy mal a causa de la ansiedad, sentí mucha vergüenza y pensé que la terapia psicológica no era una opción para mi. Ahora doy gracias, primero a Dios y al equipo de Nelson Arturo; especialmente quiero agradecer a la psicóloga Ingrid Argüello por ser empática y por ayudarme con herramientas para sentirme muchísimo mejor. En mi caso no tuve que tomar medicamentos, solo puse en práctica las indicaciones de mi terapeuta. Gracias",
    "highlight": "En mi caso no tuve que tomar medicamentos, solo puse en práctica las indicaciones de mi terapeuta."
  },
  {
    "id": "patricia-velasquez",
    "name": "Patricia Velásquez",
    "context": "Paciente de la psicóloga Ingrid Argüello",
    "kind": "individual",
    "text": "Mi nombre es Patricia soy de Chile de la ciudad de Cálama. Doy testimonio de lo que me pasó : sufrí trastornos de ansiedad, agorafobia y depresión durante casi 10 años, claro no entendía lo que me pasaba y  porqué me estaba sintiendo así, busqué ayuda con 3 psicólogos y ninguno de ellos me solucionó el problema que tenía, no había ningún diagnóstico; solo me hacían tenderme en una camilla con música relajante y unos aroma terapia en fin y otras cosas más, lo que producía era sólo un efecto placebo nada más, claro no está mal pero no me solucionaban  el problema de raíz que era lo que yo buscaba. Con todo hasta vi a un médico acupunturista que me colocaba las agujas y me producía lo mismo sensación de bienestar momentáneo; porqué lo digo a la mera presión laboral todo se iba a las pailas y volvía a sentirme mal y mucha estrés y me gatillaba en ataque de pánico, literalmente salía corriendo a la clínica y no tenía nada todos los exámenes salían bien, no me iba a morir de un paro cardíaco. Pensé que tenía que lidiar con todo esto toda mi vida, dejé mi trabajo porque ya no podía seguir trabajando y me encerré en mi casa sin salir por un tiempo, yo sola empecé a salir a la calle hasta dónde mas aguantaba y me devolvía.  Hasta que un día busqué ayuda por Internet y encontré a este equipo de psicólogos de “Libre de Ansiedad”. Hasta entonces no sabía que uno podía hacer las consultas por este medio. Busqué información y algunos testimonios de personas que habían superado la ansiedad y depresión en fin todas esas cosas que conlleva. Pasado un tiempo volvieron a aparecer los ataques de pánico con más fuerza que la primera vez y ahí sí que me asustó. El último ataque de pánico que tuve fue este año en febrero 2024, ese mismo día hice las consultas por Whatsapp y esa misma semana empecé mi primera terapia con la doctora Ingrid Argüello. Gracias  a la psicóloga quién me ayudó con mi problema pude superar la ansiedad, agorafobia y depresión; Ya no soy esclava  de mis emociones y puedo llevar una vida más tranquila, en paz  y disfrutar de la vida. ¡Nunca es tarde para pedir ayuda!",
    "place": "Calama, Chile",
    "highlight": "Ya no soy esclava de mis emociones y puedo llevar una vida más tranquila, en paz y disfrutar de la vida. ¡Nunca es tarde para pedir ayuda!"
  },
  {
    "id": "mercedes-sevilla",
    "name": "Mercedes Sevilla",
    "context": "Paciente del psicólogo Rodrigo Da Cruz",
    "kind": "individual",
    "text": "Agradecerle inmensamente por todo lo que está haciendo a mi favor, para superar esta ansiedad y miedo que me aquejaban seriamente. Gracias a sus conocimientos, profesionalismo, dedicación y carisma, me siento mucho mejor y me doy cuenta de que estoy liberándome de esa situación. He progresado mucho con sus terapias, las cuales me han demostrado que tienen solución; aún me falta un poquito, pues la tengo o tuve durante muchos años. Muchas gracias a usted Doctor y también gracias a Dios."
  },
  {
    "id": "donato-pena",
    "name": "Donato Peña",
    "context": "Paciente del psicólogo Rodrigo Da Cruz",
    "kind": "individual",
    "text": "Por la Razón que busque ayuda de psicología fue porque estaba muy desesperado, Estaba pasando por un mal momento, tenía ataques, ansiedad, tenía depresión, mucho estrés, no encontraba la salida. 2. Lo que aprendí con la terapia fue enfrentar mis miedos, aprendí a que no puedo controlar lo que la otra Gente hace y Dice, aprendí a tener más fe en mismo, a no tener miedo a mis pensamientos, 3. ¿Qué le agradezco a Rodrigo? ¡Tengo mucho que agradecer a Rodrigo es su paciencia conmigo para saber escuchar y lo más bueno de él es que es muy profesional, tiene mucho conocimiento de su profesión, me dio tantos consejos para aprender a cómo controlar mis miedos a enfrentar desafíos que tanto miedo me daban, muchas gracias Rodrigo!"
  },
  {
    "id": "mirna-garcia",
    "name": "Mirna García",
    "context": "Paciente del psicólogo Rodrigo Da Cruz",
    "kind": "individual",
    "text": "Mil gracias Dr. Da Cruz. Agradezco mucho su ayuda. He quedado muy contenta con su profesionalismo, gentileza y sensibilidad para darme tratamiento y haberme ayudado a salir del mal estado en el que me encontraba. Yo había tenido terapia aquí en California unas 5 veces durante años y nunca con la calidad de terapia que recibí de su parte. Siempre atento a escuchar y no olvidar ningún detalle de lo expuesto en nuestras pláticas. Siempre atento a enviarme vídeos, e información adecuada a mi situación. Mostrando siempre mucho conocimiento e interés en mi padecimiento. Lo recomendaría sin dudarlo. Gracias, Dios le puso en mi camino",
    "place": "California, EE. UU."
  },
  {
    "id": "victor-soriano",
    "name": "Víctor Soriano",
    "context": "Paciente de la psicóloga Denise Klaskin",
    "kind": "individual",
    "text": "A terapia entre por verme hundido en depresión y ansiedad, sin saber que hacer y que buscar. Denise me enseño los pasos a dar para salir de esto y le agradezco Ufff, todo gracias a ella he aprendido a solucionar momentos de ansiedad y depresión, he conseguido algo que dudaba que lo pudiera conseguir, quitarme mucho rumiaje de mi cabeza al dormir, le tengo que dar las gracias por este cambio en mi vida"
  }
];

/** Video de testimonios publicado en el canal de YouTube del centro. */
export const TESTIMONIAL_VIDEO_ID = 'sMkXN1AjGBg';

export const FEATURED_TESTIMONIALS: Testimonial[] = ["Patricia Velásquez", "Lorena Durán", "Johel David Solano", "Digna Robles", "Elia Vásquez", "Claudia Escorcia"]
  .map((name) => TESTIMONIALS.find((t) => t.name === name))
  .filter((t): t is Testimonial => Boolean(t));
