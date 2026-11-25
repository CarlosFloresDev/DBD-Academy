# TAREA 02: Seccion Killers (OpenCode). Skills sugeridas: design-taste-frontend, gsap-core, gsap-scrolltrigger

Lee `_common.md` arriba. Los componentes compartidos de la tarea 01 (`Base`, `Portrait`, `TierBadge`, `PerkCard`, `StatBar`, `Chip`, `SectionHead`) ya existen en `src/components/`: importalos, no los modifiques. Si algun import no existe aun, usa el nombre exacto indicado en `_common.md`.

## Archivos a crear (solo estos)
1. `src/components/killers/KillerCard.astro`: tarjeta del killer (retrato `Portrait`, nombre, `title`, capitulo, velocidad en m/s y %, radio de terror, `TierBadge`). Es un enlace a `/killers/<slug>/`. Lleva `data-name`, `data-tier`, `data-speed`, `data-difficulty`, `data-release` para filtrar. Si el killer es `terrifier`, muestra una cinta "NUEVO" (24 nov 2026).
2. `src/pages/killers/index.astro` (`active="killers"`): titulo + intro (2 lineas), barra de herramientas pegajosa con: buscador por nombre/alias/nombre real, filtro por tier (Todos, S, A, B, C, D, Sin tier) como chips, ordenar por (Nombre, Velocidad, Dificultad, Mas reciente), y un conmutador "Solo licenciados / Solo originales" si el JSON lo permite (si no, omitelo). Contador "Mostrando N de 45". Grid responsive de `KillerCard`. Script `<script>` en cliente (vanilla) que filtra/ordena el DOM, actualiza el contador, usa `history.replaceState` para guardar `?q=&tier=&orden=`, y llama `window.DBD?.refresh?.()` despues de filtrar. Debajo, una seccion "Como leer los tiers" que explica en 5 filas (S a D) la condicion de victoria desde `comp-rules.json` `condicionesVictoria4v1`, aclarando que es el estandar de DBD Arena y no oficial.
3. `src/pages/killers/[slug].astro` con `getStaticPaths` desde `killers.json` (45 paginas). Contenido:
   - Hero: retrato grande, `title`, nombre real, alias, capitulo y fecha, `TierBadge` grande y su `comp.win` ("Condicion de victoria competitiva").
   - "Numeros del killer": rejilla de `.stat` con velocidad (m/s) y `speedPct` %, radio(s) de terror en metros (si hay varios con `label`, muestra todos), altura, dificultad (1-4 como puntos), y velocidades alternativas `altSpeeds` con su etiqueta. `StatBar` comparando la velocidad contra la del survivor (4.0 m/s) y contra el maximo del roster.
   - "Ventaja de velocidad": con `speed - 4.0` calcula cuantos metros por segundo recupera el killer y cuanto tarda en cerrar una distancia de 8, 16 y 32 metros (distancia / diferencia), mostrado como mini tabla en mono con ceros fijos; si la diferencia es <= 0 indica "no recupera distancia en campo abierto". Aclara que es calculo teorico en linea recta.
   - "Poder": nombre del poder (`power`), `powerText` en un bloque con etiqueta "Texto oficial en ingles", y si `powerStats` tiene claves, una tabla clave-valor (convierte camelCase a "Camel Case").
   - "Perks propios": los 3 nombres de `killer.perks` -> busca cada uno en `perks.json` por `name` y muestra `PerkCard`.
   - "En competitivo": si `comp` existe, explica el tier. Si el killer esta en `comp-rules.json` `reglasPorKiller`, muestra su mapa fijo de 1v1, la regla especial y los add-ons baneados, y enlaza a `/mapas/<slug del mapa>/`. Si no esta en el pool 1v1, indicalo. Enlace a `/competitivo/`. Si `comp` es null: "Sin tier comunitario todavia" (killer muy reciente).
   - Enlace "Ver builds para este killer" a `/builds/?killer=<slug>`.
   - Navegacion anterior/siguiente killer (por `id`) al final.
   - Animaciones: revelado por secciones con `data-reveal`, `StatBar` animadas, contadores `data-count` para velocidad.

## Criterios de aceptacion
- 45 paginas generadas sin error; ningun dato inventado; `comp` null manejado en todos los puntos.
- El filtrado funciona sin recargar y es accesible (chips con `aria-pressed`, contador con `aria-live="polite"`).
- Mobile 360 px sin scroll horizontal.
