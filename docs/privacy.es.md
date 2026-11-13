# Privacidad y seguridad

Versión en inglés: [privacy.md](privacy.md).

**Resumen.** fAInd tiene dos capas y funcionan de forma distinta. El panel y tus archivos son locales. El asistente es Claude, así que lo que le des lo procesa Claude según los ajustes de tu cuenta. Tú decides qué le das.

## Capa 1: en tu ordenador

| Qué | Dónde vive | Qué sale de tu ordenador |
|---|---|---|
| El panel (`app/`) | Tu navegador, desde un archivo o desde la página de demo | Nada. Sin analítica, sin cuentas, sin fuentes ni scripts de otros sitios |
| `tracker.csv`, `proposals.csv`, `career-vault.md`, `hooks.csv` | La carpeta `jobops-private` que elijas | Nada |
| Los scripts (`scripts/`) | Tu terminal | Solo `liveness.py`, que pregunta a APIs públicas de portales de empleo si una oferta sigue abierta |
| Ajustes del panel (tema, idioma, tu nombre para los borradores de seguimiento, marcas en Proof) | El almacenamiento local de tu navegador, en este ordenador | Nada |
| El permiso de carpeta | Tu navegador, en este ordenador | Nada |

Cómo lo comprobamos: cargamos nueve páginas del panel y registramos todas las peticiones de red. Hubo cuatro, todas a archivos del propio panel. El código no tiene `fetch`, ni `XMLHttpRequest`, ni beacons. Puedes repetirlo: abre la página, abre las herramientas de desarrollo del navegador, elige **Network**, recarga y mira la lista.

Una salvedad. Si abres la demo en `joselblas.github.io`, la propia página se carga desde GitHub, como cualquier web. Tu tracker nunca se envía allí. Para evitar incluso eso, descarga el repo y abre `app/index.html`.

## Capa 2: el asistente

El asistente es Claude, dentro de tu cuenta de Claude. Lo que escribes, los archivos que adjuntas a un chat y los que subes a un Proyecto llegan a los servidores de Anthropic para que Claude pueda leerlos. Cómo se conservan, y si pueden usarse para mejorar Claude, depende del tipo de cuenta y de tus ajustes de privacidad.

Haz esto una vez:

1. En Claude, abre **Ajustes y luego Privacidad**.
2. Lee el ajuste **Help improve Claude** y elige lo que prefieras.
3. Aprende a borrar un chat o un archivo del Proyecto cuando termines.

Anthropic lo explica aquí: https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings. Las políticas cambian, así que lee la página actual y no te fíes de un resumen, tampoco de este.

### Lo que ve el asistente

Solo lo que le das: tu CV, los datos que confirmas en la entrevista, tus reglas de búsqueda, tu tracker si lo subes, y las ofertas que lee en la web. No ve el resto de tu ordenador. No llega a tu carpeta privada a menos que adjuntes un archivo.

### Qué dejar fuera

No lo necesitas para una buena búsqueda, así que déjalo fuera:

- Números de documentos de identidad, datos bancarios, información de salud.
- Detalles de un proyecto bajo NDA. Escribe el método y tu papel, no el cliente ni las cifras.
- Teléfonos y correos privados de tus referencias. Con el nombre y el cargo basta.
- Historial salarial. Escribe el rango que quieres, no lo que cobraste.

`jobops-start` te pregunta al principio qué dejar fuera y respeta tu respuesta.

## Los límites del propio asistente

Son reglas de `AGENTS.md`, no suposiciones sobre su comportamiento:

- Nunca envía una candidatura, ni un mensaje, ni crea una cuenta. El botón lo pulsas tú.
- Nunca escribe una contraseña.
- Nunca se inventa un dato sobre ti. Si falta, queda en blanco o te pregunta.
- Anota qué comprobó, con la prueba, para que veas cómo decidió.

## Si quieres la configuración más local

- Usa solo el panel, con tu propio `tracker.csv`. No se envía nada a ningún sitio.
- Usa solo los scripts. Igual.
- Usa Claude Code con tus archivos en disco. Los archivos se quedan en tu ordenador, pero las partes que Claude lee se envían a Claude para procesarlas.

No hay manera de usar un asistente de IA sin enviarle el texto con el que trabaja. fAInd lo reduce al mínimo y te dice dónde está la línea.

## Antes de publicar un fork

Ejecuta `python3 scripts/privacy_check.py`. Mantén tus archivos reales fuera del repo (`.gitignore` cubre las rutas habituales) y revisa `git status` y el historial antes de cada push. La lista de comprobación está en [lessons-learned.md](lessons-learned.md).
