# TAREA 08: Mapas claros, con reloj de callouts (OpenCode). Skills: design-taste-frontend

Contexto ampliado: ademas de `_common.md`, usa `src/data/callouts.json`. El componente `src/components/callouts/ClockOverlay.astro` (creado por otro agente; props `mainAt`, `interactive`, `showMain`, `showShack`, `highlight`) ya existe: importalo sin modificarlo.

Problema a resolver: la imagen que tenemos de cada mapa (`map.icon`) es un CONTORNO oficial del wiki (forma y dimensiones en tiles), no una vista desde arriba. Los layouts reales vistos desde arriba con el reloj aplicado son obra de artistas de la comunidad (Lethia/Hens y DBD Vault) y NO podemos alojarlos: hay que enlazarlos con claridad y dar al usuario una forma util de entender cada mapa dentro del sitio.

## Archivos a editar/crear (solo estos)
1. `src/pages/mapas/[slug].astro` (editar):
   - Muestra el contorno oficial grande con el titulo "Contorno oficial: forma y tamano" y un pie que explica que no es una vista desde arriba del layout.
   - Al lado, un `ClockOverlay` con las 12 y el 6 marcados, y debajo un bloque "Como llamar este mapa": si `map.landmark` existe, "El edificio principal ({landmark}) se toma como las 12"; si es null, "Este mapa no tiene un edificio principal claro: acuerden antes cual es el 12". Explica que el shack suele quedar cerca de las 6 y que, al generarse al azar, hay que confirmarlo al cargar.
   - Bloque "Layout real desde arriba" con dos botones (a `layouts.hens` y `layouts.vault` de `callouts.json`, `target="_blank" rel="noopener noreferrer"`), el texto `layouts.aviso`, y la indicacion de buscar el mapa por el nombre del reino.
   - Mantiene todo lo existente (numeros, variaciones, pool 1v1, anterior/siguiente).
   - Un recuadro con consejos de lectura de tamano: compara su `areaM2` con el promedio y la mediana de todos los mapas (calculalos de `maps.json`, ignora nulos) y dilo en una frase ("X % mas grande que el promedio").
2. `src/components/MapThumb.astro` NO se toca. Para los mapas sin imagen crea `src/components/mapas/MapSchematic.astro` (props `map`): esquema SVG con una cuadricula de tiles proporcional a `sizeTiles` (lado = raiz de las tiles, redondeado), con etiqueta "Esquema sin imagen oficial" y los numeros del reloj en el borde. Usalo como reserva en `[slug].astro` y en `MapCard.astro` cuando `map.icon` sea null.
3. `src/pages/mapas/index.astro` (editar): en la cabecera anade una franja "Aprende a llamar los mapas" con un enlace destacado a `/callouts/` y una explicacion de una linea del reloj; en cada tarjeta del pool 1v1 muestra un mini `ClockOverlay` (no interactivo) como decoracion. No cambies filtros ni ordenamiento.
4. `src/components/mapas/MapCard.astro` (editar): usar `MapSchematic` como reserva.

## Criterios
- Sin datos inventados; todo desde `maps.json` y `callouts.json`.
- 47 paginas siguen generandose; mobile 360 px sin overflow; `alt` descriptivos.
