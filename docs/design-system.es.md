# Design system

Los tokens y componentes detrás del panel de fAInd. La versión en vivo está en [design/system/](https://joselblas.github.io/jobops-kit/design/system/) (en inglés). Usa la hoja de estilos real (`app/style.css`), así que la página y el producto no pueden separarse.

## Principios

1. **Calma antes que urgencia.** Una búsqueda de empleo ya es estresante. Nada de alarmas rojas, rachas ni cuentas atrás. La precaución es ámbar y siempre dice por qué.
2. **Números honestos.** Una muestra pequeña se etiqueta como pequeña. Un número nunca aparece sin su etiqueta.
3. **El texto lleva el significado.** El color, la forma y la posición solo añaden énfasis. Cada estado tiene palabras, así que sobrevive al modo de colores forzados y al daltonismo.
4. **Funciona con teclado.** Cada control es un botón, enlace o campo real, con foco visible y un área de 40 px.

## Tokens

Todos los tokens son propiedades CSS en `:root`, con un conjunto oscuro bajo `[data-theme="dark"]`.

| Grupo | Tokens |
|-------|--------|
| Superficies | `--surface`, `--surface-raised`, `--surface-sunken` |
| Texto | `--ink`, `--ink-muted`, `--ink-faint` |
| Acción y estado | `--accent`, `--accent-soft`, `--calm`, `--calm-soft`, `--closed`, `--closed-soft`, `--caution`, `--caution-soft` |
| Líneas | `--line`, `--line-strong` |
| Espacio | `--s-1` a `--s-8` (4, 8, 12, 16, 24, 32, 48, 64 px) |
| Tipografía | `--t-xs` 12, `--t-sm` 13, `--t-base` 15, `--t-md` 18, `--t-lg` 28, más los tamaños fluidos de h1 y KPI |
| Forma | `--r-sm` 12, `--r-md` 22, `--r-lg` 28, `--r-pill` |
| Elevación | `--shadow` (tarjetas), `--shadow-pop` (menús) |
| Movimiento | `--dur-1` 120 ms, `--dur-2` 250 ms, `--ease` |
| Áreas táctiles | `--target` 40 px |

La paleta es bruma, teal, acero y dorado (ver [marca](brand.es.md)). En el tema claro el color de acción es un acero profundo, `#2E5C72`. En el oscuro es dorado, `#D6AA58`, con texto oscuro encima. El dorado nunca se usa para texto pequeño sobre fondo claro, porque ahí solo llega a 2,15 a 1.

Los tokens de escala (espacio, tipografía, movimiento) son nuevos. Las reglas existentes los adoptan poco a poco, así que algunos valores antiguos siguen siendo números literales.

### Contraste

Los pares de texto necesitan 4,5 a 1 y los bordes de controles 3 a 1. La página de diseño calcula cada par en vivo en los dos temas. Hoy todos pasan; el par de texto más bajo es 5,06 a 1 (texto terciario sobre el fondo de página, tema claro) y el borde más bajo es 3,44 a 1.

## Componentes

| Componente | Clase | Para qué |
|------------|-------|----------|
| Botón | `.btn`, `.ghost`, `.sm`, `.caution` | Un botón relleno por vista, el resto fantasma. Precaución solo para acciones que pierden datos. |
| Etiqueta | `.tag`, `.accent`, `.closed`, `.calm`, `.caution` | Un estado con texto. |
| Chip y control segmentado | `.chip`, `.seg` | Filtrar una lista o cambiar de modo. Usa `aria-pressed`. |
| Campo | `.field`, `.input`, `.hint`, `.err` | Etiqueta arriba, ayuda y error debajo. Enlázalos con `aria-describedby`. |
| Aviso | `.callout`, `.info`, `.calm`, `.caution` | Una nota corta dentro de una página. |
| Tarjeta y KPI | `.card`, `.kpi` | Agrupar una idea. Un número siempre lleva etiqueta. |
| Fila de lista de control | `.chk` | Un paso con un estado y una acción. |
| Menú Más | `details.more` | Una acción principal y el resto guardado. |
| Estado vacío | `.proof-empty`, `.empty` | Decir qué falta y qué hacer ahora. |

Cada componente tiene su marcado, cuándo usarlo y sus notas de accesibilidad en la página de diseño.

## Reglas para componentes nuevos

- Empieza por un elemento nativo. Añade ARIA solo para el estado (`aria-pressed`, `aria-invalid`, `aria-describedby`).
- Da palabras a cada estado, no solo color.
- Comprueba los dos temas y los colores forzados. Ejecuta `python3 scripts/a11y_audit.py` antes de hacer commit.
- Añade el componente a la página de diseño con su marcado y su nota de accesibilidad.
