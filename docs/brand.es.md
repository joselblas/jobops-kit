# Marca fAInd

La versión en vivo, con descargas, está en [design/brand/](https://joselblas.github.io/jobops-kit/design/brand/) (en inglés).

## La idea

Find a job. Keep your head. La IA está escrita dentro de la palabra, sin hacer ruido, y no es el titular. Lo más fuerte del producto es la privacidad, el contexto en texto plano y los números honestos; la IA sirve a eso.

## El nombre

- Se dice "find". Se escribe **fAInd**, con A e I mayúsculas.
- Una mayúscula en medio de una palabra la leen letra a letra algunos lectores de pantalla. Por eso el logotipo lleva el texto "find" para tecnologías de apoyo. En texto plano, donde no se puede, añade qué es la primera vez: "fAInd, el kit abierto de búsqueda de empleo".
- El repositorio (`jobops-kit`), los nombres de archivo y las habilidades (`jobops-start` y las demás) conservan su nombre técnico, así que nada de lo ya instalado se rompe.
- Los títulos de página no pueden llevar texto oculto, así que usan el nombre tal como se escribe.

### Riesgo del nombre

Una búsqueda en la web el 13 de noviembre de 2026 encontró otros productos con el mismo nombre o muy parecido: FAIND (una app de IA que conecta personas con intereses parecidos, 2024), Faind (un asistente de compras con IA), Faind (búsqueda profesional y emparejamiento de freelancers, noviembre de 2025) y una empresa con la grafía exacta fAInd que hace una plataforma de sensores con IA para etiquetas RFID (2024). No he comprobado dominios, nombres en redes sociales ni el registro de marcas de la UE (EUIPO).

Para un proyecto abierto de portfolio el riesgo es bajo. Para algo comercial, o si quieres posicionarte por tu propio nombre, es un problema real. Dos mitigaciones: escríbelo siempre con su descripción la primera vez ("el kit abierto de búsqueda de empleo") y mantén el nombre en un solo sitio para poder cambiarlo. En el código el logotipo es un único fragmento SVG y el nombre aparece en unos pocos títulos de página, así que renombrar es un trabajo corto.

## Logotipo

Una marca redonda y el nombre, dibujados como curvas para que se vean igual en todas partes. La IA va en el color de acento. La I lleva serifas a propósito: en una sans normal, una I mayúscula parece una l minúscula y el nombre se lee "fAlnd".

- Usa los archivos suministrados en `design/brand/assets/`. Versión clara sobre claro, oscura sobre oscuro.
- Espacio libre: tres veces la altura del punto interior de la marca. Ancho mínimo 96 px para el logotipo, 16 px para la marca sola.
- No lo reescribas, estires, contornees, le pongas sombras ni lo recolorees. No pongas la IA dorada sobre fondo claro.

## Color

| Nombre | Valor | Uso |
|--------|-------|-----|
| Bruma | `#E1EBF0` | Superficie clara |
| Teal | `#A9CDD4` | Rellenos suaves, la marca sobre oscuro |
| Acero | `#477A91` | La marca y la IA sobre claro |
| Acero profundo | `#2E5C72` | Botones y enlaces sobre claro |
| Tinta | `#17313E` | Texto sobre claro |
| Dorado | `#D6AA58` | La IA sobre oscuro, el punto, el color de acción en oscuro |
| Noche | `#0F2029` | Superficie oscura |

Contraste medido: dorado sobre blanco es 2,15 a 1, así que nunca se usa para texto pequeño sobre claro. Dorado sobre noche es 7,74 a 1. Acero profundo sobre blanco es 7,27 a 1. En el [design system](design-system.es.md) están todos los pares.

## Voz

Humor seco y columna estoica. Di el número, qué significa y una frase que valga la pena guardar. Nunca "no te preocupes".

- Suena a fAInd: "A rejection is mail. Not a verdict." "26 applications is a small sample. Treat every comparison as a hint, not a result."
- No suena a: "Don't worry, the right role is out there!" "Supercharge your career with AI."
- Palabras sencillas, frases cortas, sin exageraciones. Escribe para alguien que lee inglés como segunda lengua.

## Textos listos

Cada uno es cierto hoy. Ojo con las dos capas de privacidad: el panel y tus archivos son locales, y lo que le das a Claude lo procesa Claude según los ajustes de tu cuenta. Mira [privacidad](privacy.es.md).

- **Lema:** Find a job. Keep your head.
- **Una línea:** fAInd es un kit abierto de búsqueda de empleo. Lleva un registro honesto, muestra tus probabilidades reales y mantiene tus archivos en tu ordenador.
- **Descripción corta:** fAInd te ayuda a llevar una búsqueda de empleo tranquila y honesta con Claude. Todo es texto plano, el panel funciona en tu navegador y tus archivos siguen siendo tuyos.
- **Bio (LinkedIn, X, GitHub):** Kit abierto de búsqueda de empleo para Claude. Números honestos, contexto en texto plano, tus archivos en tu ordenador. Hecho por un diseñador UX durante una búsqueda real.
- **Descripción del repositorio:** fAInd: a calm, honest job search kit for Claude. Plain-text context, local dashboard, nothing uploaded by the dashboard.

## Recursos

En `design/brand/assets/`: tres logotipos con la marca (claro, oscuro, tinta profunda), dos sin ella, la marca, un favicon que sigue el tema del sistema, un avatar de 512 px, una tarjeta para compartir de 1200 por 630 y un banner de LinkedIn de 1584 por 396.
