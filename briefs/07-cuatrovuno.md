# TAREA 07: Pagina 4v1 competitivo / ranked (OpenCode). Skills: design-taste-frontend

Contexto ampliado: ademas de `_common.md`, usa `src/data/balance-4v1.json` (sistema de balance del 4v1 competitivo: compensacion por tiers, reglas universales, victoria por tier, ecosistema de ligas, pasos), `src/data/comp-rules.json` y `src/data/killers.json`. Los componentes compartidos ya existen; importalos sin modificarlos.

## Archivos a crear (solo estos)
1. `src/pages/competitivo/4v1.astro` (`active="competitivo"`):
   - Hero: "4v1 competitivo: la partida normal, con reglas" + `queEs`. Aviso visible con `aviso` ("cada liga define sus listas").
   - **La compensacion**: seccion `logica` con un diagrama SVG tipo balanza/escala (hecho por ti): a la izquierda restricciones del killer, a la derecha libertad de los survivors, con indicador que se inclina segun un slider de tier (S, A, B, C, D). Al mover el slider (JS vanilla + GSAP) se actualizan las dos columnas con los textos de `ejemploEscala` para ese tier (si falta un tier en el JSON, interpola con texto generico "restricciones intermedias"). Nombra los killers de ejemplo y enlazalos a `/killers/<slug>/` buscando en `killers.json` por nombre.
   - **Reglas universales** (`reglasUniversales`) como 4 tarjetas con icono SVG propio.
   - **Verificador de equipo** (herramienta): 4 filas de survivor, cada una con un buscador de personaje (`survivors.json`) y hasta 4 perks (autocompletado sobre `perks.json` del bando survivor). Avisa en vivo: personajes repetidos, perk repetido entre dos survivors (regla "un perk por equipo"), perks baneados en el formato 1v1 de `comp-rules.json` (`perksSurvivorBaneados`, con la aclaracion de que esa lista es del 1v1) y cuantos perks de agotamiento (`tags` con `Exhausted`) lleva cada uno. Debe ser accesible por teclado y con `aria-live`.
   - **Quien gana** (`victoria`) con la escalera de tiers S-D y las condiciones (desde `comp-rules.json` `condicionesVictoria4v1`).
   - **Ecosistema** (`ecosistema` + `ecosistemaAviso`): tarjetas de las ligas/herramientas. Si trae `url`, enlazala con `rel="noopener noreferrer"`. NO inventes invitaciones ni enlaces de Discord.
   - **Como empezar** (`pasos`): 5 pasos numerados con enlaces a `/callouts/`, `/mapas/`, `/competitivo/` y `/builds/`.
2. `src/components/competitivo/BalanceScale.astro` y `TeamChecker.astro` (los dos modulos anteriores).
3. Enlace de ida y vuelta: NO edites `competitivo/index.astro` (otro agente lo mantiene): enlaza solo desde tu pagina hacia `/competitivo/`.

## Criterios
- Ningun dato inventado: todo sale de los JSON. Texto en espanol.
- Mobile 360 px sin overflow; teclado y `prefers-reduced-motion` respetados.
