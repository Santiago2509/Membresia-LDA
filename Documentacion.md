Plataforma de Membresías — Libre de Ansiedad (ePayco)
Sitio propio (sin WordPress) que vende membresías vía ePayco. Los suscriptores activos acceden a contenido exclusivo (video, PDF, texto). Un panel de administrador gestiona el contenido y ve el estado de todos los suscriptores.

1. Resumen
Cliente	Libre de Ansiedad
Precedente	Alma Rosa Connector — integración previa de ePayco con WordPress/PMPro para el mismo cliente; esta plataforma es la migración a app propia
Pasarela	ePayco — API de Suscripciones + Webhook de confirmación
Stack	Next.js 14 + TypeScript, Tailwind CSS v4, Framer Motion, Supabase (DB + Auth), Cloudinary, Vercel
2. Viabilidad (confirmada)
ePayco permite crear planes de membresía y gestionarlos desde su panel de Suscripciones; cada plan genera un link de pago propio.
El formulario de pago de ePayco captura nombre, correo y datos de tarjeta, y tokeniza la tarjeta para cobrar automáticamente en cada ciclo (mensual, en este caso), sin que el cliente vuelva a digitarla.
ePayco notifica cada cambio de estado (suscripción creada, cobro exitoso, cobro fallido, cancelación) mediante un webhook de confirmación hacia un endpoint propio, incluyendo datos del cliente (x_customer_email, x_customer_name) y de la transacción.
No es una conexión permanente ni hay que consultar por nuestra cuenta: ePayco empuja (push) el evento cuando ocurre. Como respaldo, se puede agregar una consulta periódica por API para reconciliar estados si algún webhook puntual no llegara.
3. Flujo de usuario (Home)
El usuario llega a un home público que explica el servicio.
Se muestran los contenidos (videos/guías) como miniaturas de imagen, visibles para todos.
Al hacer clic en una miniatura:
Si no está autenticado o no tiene membresía activa → se le pide suscribirse.
Si ya tiene membresía activa → accede directo al contenido.
En el home hay dos botones: "Suscribirse al plan" e "Iniciar sesión".
4. Flujo de suscripción y autenticación (opción elegida)
Se descartó el formulario propio de registro antes del pago. Flujo definitivo:

Clic en "Suscribirse" → redirección directa al link de pago del plan en ePayco.
El usuario paga y registra su nombre/correo en el formulario de ePayco; su tarjeta queda tokenizada y la suscripción creada.
ePayco llama al webhook de confirmación. El backend:
Verifica la firma de la petición.
Verifica que el evento no se haya procesado antes (tabla webhook_events, idempotencia por event_id/x_ref_payco).
Crea (o encuentra) el perfil del usuario en Supabase con el correo recibido.
Crea/actualiza el registro de membership con estado activa.
El sistema envía al correo del usuario un enlace de activación/creación de contraseña (invite / magic link de Supabase Auth) — nunca una contraseña generada y enviada en texto plano.
El usuario crea su contraseña y ya puede iniciar sesión.
5. Arquitectura
Usuario → Link de pago (plan) en ePayco
                │
                ▼
     Formulario de pago de ePayco (nombre, correo, tarjeta → tokenizada)
                │
                ▼
     Webhook de confirmación → Backend propio (Next.js API route en Vercel)
        - Verifica firma
        - Verifica idempotencia (webhook_events)
        - Crea/actualiza perfil y membresía en Supabase
        - Dispara correo de activación de cuenta
                │
                ▼
     Supabase (Postgres + Auth + RLS)
                │
                ▼
     Frontend: home público + área de miembro + panel de administrador
6. Modelo de datos (Supabase)
profiles — extiende auth.users

Campo	Tipo	Notas
id	uuid (PK, = auth.users.id)	
full_name	text	viene de x_customer_name
email	text	viene de x_customer_email
role	text	user | admin
created_at	timestamptz	
plans

Campo	Tipo	Notas
id	uuid (PK)	
epayco_plan_id	text	id del plan en ePayco
name	text	
price	numeric	
interval	text	mensual, etc.
memberships

Campo	Tipo	Notas
id	uuid (PK)	
user_id	uuid (FK → profiles.id)	
plan_id	uuid (FK → plans.id)	
epayco_subscription_id	text	referencia de la suscripción en ePayco
status	text	pendiente | activa | pago_fallido | cancelada
current_period_end	timestamptz	fecha estimada de próxima renovación
updated_at	timestamptz	se actualiza en cada evento de webhook
content

Campo	Tipo	Notas
id	uuid (PK)	
title	text	
type	text	video | pdf | texto
thumbnail_url	text	pública (Cloudinary), visible sin suscripción
body_or_url	text	oculto hasta validar membresía activa
created_by	uuid (FK → profiles.id, admin)	
created_at	timestamptz	
webhook_events (idempotencia y auditoría)

Campo	Tipo	Notas
id	uuid (PK)	
event_id	text (unique)	x_ref_payco u otro identificador único del evento
payload	jsonb	payload completo recibido
processed_at	timestamptz	
7. Seguridad y control de acceso
Row Level Security (RLS) en Supabase:
profiles / memberships: cada usuario solo puede leer sus propias filas (user_id = auth.uid()); el rol admin tiene política aparte para ver todo.
content: el título y la miniatura son visibles para cualquier usuario autenticado (o incluso público); el campo body_or_url solo se resuelve/entrega si la membresía del usuario está activa (validado en la API, no solo en el frontend).
webhook_events: sin acceso público, solo el backend (rol de servicio) puede escribir/leer.
La firma del webhook se valida siempre antes de procesar cualquier evento.
Ninguna contraseña se genera ni se envía por correo en texto plano — se usa un flujo de activación/magic link.
8. Panel de administrador
Gestión de contenido: crear/editar/eliminar videos, guías PDF y texto, con su miniatura.
Listado de todos los usuarios suscritos, con etiqueta de estado automática (activa, pago_fallido, cancelada, pendiente) que se actualiza sola con cada evento del webhook — sin que el admin tenga que revisar el panel de ePayco manualmente.
Acción manual de respaldo para activar/desactivar una membresía a mano, por si algún webhook puntual falla.
9. Ciclo de vida de una membresía (eventos del webhook)
Suscripción creada / primer pago exitoso → activa.
Cada ciclo de cobro (ej. mensual), ePayco intenta cobrar la tarjeta tokenizada:
Éxito → se mantiene activa, se actualiza current_period_end.
Fallo → pago_fallido (el contenido se bloquea de nuevo hasta que se resuelva).
Cancelación (por el cliente o por reintentos de cobro agotados) → cancelada.
10. Próximos pasos
Crear el plan de membresía en el panel de ePayco y obtener su epayco_plan_id y link de pago.
Crear las tablas anteriores en Supabase con sus políticas RLS.
Implementar el endpoint de webhook (verificación de firma + idempotencia) en Next.js/Vercel.
Implementar el flujo de invitación/activación de cuenta tras el primer webhook exitoso.
Construir el home público, el área de miembro y el panel de administrador.
Fuentes consultadas
https://docs.epayco.com/docs/checkout-respuesta-y-confirmacion
https://docs.epayco.com/docs/descripcion-general-1
https://www.rubydoc.info/gems/epayco/EPayCo/Client/Plans
https://www.rubydoc.info/gems/epayco/EPayCo/Client/Subscription