# TAREA 03: Mapas, Survivors y Perks (OpenCode). Skills sugeridas: design-taste-frontend, gsap-core

Lee `_common.md` arriba. Componentes compartidos de la tarea 01 ya existen: importalos sin modificarlos.

## Archivos a crear (solo estos)
### Mapas
1. `src/pages/mapas/index.astro` (`active="mapas"`): intro, buscador, filtro por reino (chips desde `realms.json`) y orden por tamano. Agrupa los mapas por reino con encabezado (nombre del reino, ubicacion, color `realm.color` como filete). Cada mapa: `MapThumb`, nombre, tamano en tiles y m2 (`areaM2` con separador de miles es-PE), `StatBar` de area relativa al mayor, etiqueta "Pool 1v1" si `comp` existe. Bloque destacado "Pool competitivo 1v1" arriba, con los 6 mapas de `comp.killers1v1` y sus killers (enlaces a `/killers/<slug>/`). Aclara que el pool viene de DBD Arena (no oficial). Seccion "Mas pequenos vs mas grandes": top 5 de cada extremo con barras animadas. Mapa nuevo "Hartshorne Mall" con cinta NUEVO.
2. `src/pages/mapas/[slug].astro` (`getStaticPaths`, 47 paginas): hero con `MapThumb` grande, reino, parche de lanzamiento, punto de referencia (`landmark`), "Numeros del mapa": tamano en tiles de 8x8 m, area en m2, lado equivalente en metros (raiz del area), y conversion a tiempo de recorrido: cuanto tarda un survivor (4.0 m/s) y un killer (4.6 m/s) en cruzar el lado equivalente. Si hay `variations`, tabla con parche/tiles y marca 2v8; si hay `floors`, tabla por piso. Si `sizeTiles` es null muestra "Tamano no publicado". Si `comp`, cuadro "Mapa competitivo 1v1" con los killers que lo usan y enlace a `/competitivo/`. Anterior/siguiente.
3. `src/components/mapas/MapCard.astro`.

### Survivors
4. `src/pages/survivors/index.astro` (`active="survivors"`): grid de 55 survivors (retrato, nombre, rol, capitulo), buscador, filtro por genero y orden; Sienna Shaw con cinta NUEVO.
5. `src/pages/survivors/[slug].astro` (55 paginas): retrato grande, nombre, `role`, origen, actor/actriz, capitulo y fecha, sus 3 perks propios con `PerkCard`, y un bloque "Perks propios en competitivo" que marca los que estan en `comp-rules.json` `perksSurvivorBaneados` con etiqueta "Baneado en 1v1 (DBD Arena)". Anterior/siguiente.
6. `src/components/survivors/SurvivorCard.astro`.

### Perks
7. `src/pages/perks/index.astro` (`active="perks"`): biblioteca de 342 perks con buscador, pestanas Killer/Survivor/Todos, filtro por etiqueta (`tags`, tomadas de los datos y ordenadas por frecuencia), y filtro "Ocultar baneados en 1v1". Cada perk usa `PerkCard` compacto en grid; los baneados (listas en `comp-rules.json`, compara por nombre ignorando mayusculas y la variante "Hex: Blood Favor"/"Hex: Blood Favour") muestran un chip "Baneado 1v1". Render por lotes: monta todos en HTML estatico y filtra por JS con `hidden`; contador `aria-live`. Cada perk con ancla `#<slug>`.

## Criterios de aceptacion
- 47 + 55 paginas generadas sin errores, null/fallbacks manejados (mapas sin imagen, perks sin icono).
- Filtros accesibles y rapidos (342 elementos sin lag), mobile 360 px sin overflow.
- Ningun numero inventado.
