# TAREA 06: Callouts con el reloj del mapa (Copilot)

Contexto ampliado: ademas de `_common.md`, usa `src/data/callouts.json` (sistema de reloj verificado: el mapa es la cara de un reloj; el edificio principal = 12; numeros en sentido horario; shack cerca del 6; modificadores Mid, Top-Mid, Bottom-Mid, [N] Mid, [N] Edge, Deep [N]; ejemplos de llamadas). Los componentes compartidos ya existen (`Base`, `SectionHead`, `Chip`, `MapThumb`...); importalos sin modificarlos. La Nav ya tiene el enlace `/callouts/` (clave `active="callouts"`).

## Archivos a crear (solo estos)
1. `src/components/callouts/ClockOverlay.astro`: SVG reutilizable (viewBox 0 0 400 400) con el reloj de callouts. Props: `mainAt?` (angulo en grados, por defecto 0 = arriba), `interactive?` (bool), `showMain?`, `showShack?`, `highlight?` (numero 1-12). Dibuja: cuadro del mapa, aro exterior con los 12 numeros (12 arriba, sentido horario), 12 sectores (rebanadas) tenues, anillos "mid" y "edge" concentricos con etiquetas, un icono de main building en 12 (rectangulo grande) y de shack en 6 (rectangulo chico), y la zona central "Mid". En modo `interactive`, cada sector es un `<path>` con `tabindex="0"`, `role="button"`, `aria-label="Sector N"`, hover/focus resaltan con sangre `--blood` y disparan el evento personalizado `callout:select` con `{n, ring}` (ring: "edge" | "deep" | "mid" | "centro"). Estilo del reloj: fino, esports, con animacion sutil de la manecilla (CSS) y trazo `.draw`.
2. `src/pages/callouts/index.astro` (`active="callouts"`), con componentes adicionales en `src/components/callouts/` si los necesitas:
   - Hero: "Habla el idioma del mapa" + explicacion de 2 lineas + `ClockOverlay` grande animado (la manecilla gira lentamente y se detiene en un sector con una llamada de ejemplo como "Killer en 4").
   - **La regla** (`regla.puntos`) en una lista numerada con un diagrama lateral. Incluye un recuadro "Convenciones" (aclara que algunos equipos usan otro punto como 12 y que lo importante es acordarlo).
   - **Modificadores** (`modificadores`) como tarjetas con mini-diagrama SVG de cada una (por ejemplo dibujar un punto en "3 mid", "9 edge", "deep 3").
   - **Entrenador interactivo**: modo 1 "Lee la llamada": se muestra una llamada en texto (por ejemplo "gen en 7 edge", sorteada) y el usuario hace clic en el sector del reloj donde cree que esta; muestra acierto/error con animacion y lleva racha y precision. Modo 2 "Haz la llamada": se marca un punto aleatorio en el mapa (sector + anillo) y el usuario elige la llamada correcta entre 3 opciones. Debe funcionar con teclado y tener `aria-live`. Guarda mejor racha en `localStorage`.
   - **Ejemplos** (`ejemplos`) en burbujas de chat estilo comunicaciones de equipo (en ingles y su traduccion).
   - **Capas de una llamada** (`capas`).
   - **Layouts reales de cada mapa**: bloque que explica (usa `layouts.aviso`) que los layouts con el reloj aplicado son trabajo de la comunidad, con dos botones grandes a `layouts.hens` y `layouts.vault` (abren en pestana nueva, `rel="noopener noreferrer"`) y la lista de fuentes (`fuentes`).
   - Enlace a `/mapas/` y a `/competitivo/`.
   - `data-reveal` en secciones; todo respeta `prefers-reduced-motion`.

## Criterios
- Sin dependencias nuevas; GSAP y Lenis ya disponibles.
- El entrenador es correcto: el sector 12 esta arriba, el 3 a la derecha, el 6 abajo, el 9 a la izquierda.
- Mobile 360 px sin scroll horizontal.
