# Configura JobOps en 15 minutos

Versión en inglés: [setup.md](setup.md). Hay una versión ilustrada en https://joselblas.github.io/jobops-kit/setup/.

No escribes código y no rellenas plantillas a mano. Instalas las habilidades una vez y Claude te entrevista para escribir tus archivos de partida. La idea en una línea: **todo es contexto, escrito en texto.** Claude lee unos pocos archivos sobre ti y sobre lo que buscas. Nunca se inventa nada.

## Lo que necesitas

| Necesitas | Para qué |
|---|---|
| Una cuenta de Claude que pueda crear Proyectos y añadir habilidades | El asistente vive en un Proyecto |
| Tu CV actual, como archivo o pegado como texto | Claude parte de él y te pide que confirmes cada dato |
| Chrome o Edge | El panel guarda directamente en tu carpeta con ellos. En otros navegadores funciona con descarga |
| Unos 15 minutos | Sobre todo, contestar preguntas sobre ti |

No necesitas Python ni Git. Solo sirven para los scripts opcionales.

## Antes de empezar: qué se queda dónde

- **Solo en tu ordenador:** el panel, tu `tracker.csv` y tu carpeta privada. El panel no hace peticiones de red y no tiene analítica.
- **En tu cuenta de Claude:** todo lo que escribas o subas al Proyecto. Se trata según los ajustes de privacidad de tu cuenta. Revísalos en Claude, en **Ajustes, Privacidad**, antes de subir nada.

Lee [privacy.es.md](privacy.es.md) una vez. Es corto.

## Pasos

**1. Descarga los archivos.**
Abre https://github.com/joselblas/jobops-kit, pulsa **Code**, luego **Download ZIP** y descomprime.
Deberías ver una carpeta con `README.md`, `skills`, `app` y `playbooks` dentro.

**2. Crea tu carpeta privada.**
Crea una carpeta vacía llamada `jobops-private` en Documentos, fuera de la carpeta descomprimida.
Deberías ver una carpeta vacía. Tus datos reales vivirán aquí y en ningún otro sitio.

**3. Añade las habilidades.**
En Claude abre **Ajustes, Habilidades**. Añade estas cinco desde la carpeta `skills`: `jobops-start`, `jobops-screen`, `jobops-craft`, `jobops-apply`, `jobops-review`. Cada una es una carpeta con un archivo `SKILL.md`. Si Claude pide un zip, comprime antes la carpeta.
Deberías ver cinco habilidades de JobOps activadas.

**4. Crea un Proyecto.**
Crea un Proyecto llamado "Búsqueda de trabajo". En sus instrucciones pega: `Use the JobOps skills for job search tasks.`
Deberías ver un Proyecto vacío.

**5. Escribe Start.**
Abre un chat dentro del Proyecto. Adjunta tu CV si lo tienes. Escribe: `Start`.
Claude te explica cómo funciona, te pregunta qué quieres dejar fuera y luego te hace preguntas de una en una. Te enseña cada dato antes de guardarlo. Deja en blanco lo que no sepas. Un hueco es seguro, una suposición no.
Al final deberías recibir tres archivos: `career-context.md`, `profile.yml` y `tracker.csv`.

**6. Guarda los tres archivos en `jobops-private`.**
Deberías ver tres archivos en la carpeta.

**7. Sube esos mismos tres archivos al Proyecto.**
Claude no puede ver tu carpeta, así que esta es la forma de que recuerde tus datos en el siguiente chat.
Deberías ver los tres archivos en la lista de archivos del Proyecto.

**8. Haz tu primera búsqueda.**
En un chat nuevo del Proyecto escribe: `Scout today's listings and run the gates.`
Deberías recibir una nota corta: ofertas nuevas con puntuación, los filtros comprobados en la página de la empresa con cita literal como prueba, y una lista de ofertas descartadas con el motivo de cada una.

**9. Abre el panel.**
Abre `app/index.html` de la carpeta descomprimida en Chrome o Edge. Pulsa **Connect folder** y elige `jobops-private`.
Deberías ver tu propia búsqueda en el resumen. Los cambios se guardan directamente en tu archivo.

Puedes parar tras el paso 8 y usar solo el asistente, o abrir solo el panel del paso 9 con tu propio `tracker.csv`.

## Las reglas que sigue el asistente

Nunca envía una candidatura, ni un mensaje, ni crea una cuenta. El último botón lo pulsas tú, siempre. Nunca se inventa nada sobre ti. Mira `AGENTS.md`.

## Tu ritmo semanal

| Cuándo | Qué hacer |
|---|---|
| Cada día que busques | Pide al Proyecto que explore. Elige ofertas. Revisa cada CV adaptado antes de rellenar nada |
| Después de cada candidatura | **Log an update** en el panel |
| Cuando lleguen respuestas | **Log an update**, o pasa el barrido de correo y acepta las propuestas en **Proposed updates** |
| Tras tres semanas sin respuesta | **Follow-ups**: copia un borrador y envíalo tú |
| Una vez a la semana | **Weekly review**. Cinco minutos |

## Otras formas de usarlo

- **Sin habilidades.** Salta el paso 3. Sube `AGENTS.md` y todo `playbooks/` al Proyecto, luego escribe `Start`. Claude sigue `playbooks/start.md`.
- **Con Claude Code.** Pon los tres archivos en la carpeta del repo (están en `.gitignore`) y ejecuta `claude` ahí. Lee `AGENTS.md` solo y usa los playbooks y los scripts directamente. Tus archivos se quedan en disco, pero el texto que Claude lee sigue yendo a Claude.
- **Solo el panel.** Abre la demo en https://joselblas.github.io/jobops-kit/app/ o abre `app/index.html`. Añade tus ofertas a mano. No hace falta cuenta de Claude.

## Si algo no sale bien

| Ves | Prueba |
|---|---|
| Claude no se ofrece a empezar | Comprueba que `jobops-start` está activada en Ajustes, Habilidades. O escribe: `Use the jobops-start skill` |
| El panel enseña datos de ejemplo | Aún no has conectado tu carpeta. Pulsa **Connect folder** |
| **Connect folder** no funciona | Tu navegador no puede guardar en una carpeta. Usa Chrome o Edge, o pulsa **Load tracker.csv** y luego **Download CSV** para guardar |
| El asistente se inventa un dato | No debería. Corrígelo en el chat, actualiza `career-context.md` y súbelo de nuevo |
| Los resultados ignoran tus filtros | Comprueba que `profile.yml` está en el Proyecto y no tiene marcadores sin rellenar |
| Una oferta decía remoto y no lo es | Es lo esperado. Los filtros se comprueban en la página de la empresa. Díselo al asistente y anota el motivo |

## Mantén tus datos privados

No subas nunca a un repositorio `career-context.md`, `profile.yml`, `tracker.csv`, `cv/` ni `logs/`. Están en `.gitignore`. Ejecuta `python3 scripts/privacy_check.py` antes de publicar un fork. Mira [lessons-learned.md](lessons-learned.md).
