# TAREA 09: Pasada de diseno "terror gore" estilizado (Copilot)

Eres un director de arte frontend senior. El sitio ya funciona y tiene una base oscura tipo esports (ver `_common.md` y `src/styles/global.css`). El usuario lo quiere MAS gore, con efectos interesantes adaptados al universo de Dead by Daylight, pero que se vea profesional, legible y de calidad de estudio, no recargado ni barato. Estilo de referencia: la identidad visual del juego (ganchos, cadenas, sangre, garras, la Entidad, niebla, luces parpadeantes, oxido industrial), llevada con criterio de diseno editorial. Sangre y heridas ESTILIZADAS en vector (gotas, salpicaduras, rasguños); nada de imagenes realistas de violencia ni de cuerpos.

## Alcance (solo estos archivos; cualquier otra pagina hereda por clases y tokens)
`src/styles/global.css`, `src/layouts/Base.astro`, `src/scripts/motion.js`, `src/components/{Nav,Footer,HeroArt,SectionHead,StatBar,TierBadge,PerkCard,Chip,Portrait,PerkIcon,MapThumb}.astro`, `src/pages/index.astro`, `src/pages/404.astro`, y componentes NUEVOS en `src/components/fx/`.
NO edites paginas de otras secciones (killers, mapas, builds, reloj, competitivo, callouts, perks, survivors): consiguen el nuevo look al usar las mismas clases (`.card`, `.display`, `.btn`, `.chip`, `.stat`...), asi que mantén esos nombres de clase y sus contratos.

## Direccion
1. **Paleta**: anade tokens `--gore:#7a0a12`, `--gore-deep:#3d0409`, `--rust:#8a4b2a`, `--ember:#ff6a3d`. Mantiene `--blood`, `--amber`, `--bone`. Manchas de oxido/sangre seca en fondos (muy sutiles, 4-8 % de opacidad) con SVG inline `feTurbulence` + `feDisplacementMap`, sin imagenes externas.
2. **Efectos globales** (CSS/SVG, ligeros): viñeta oscura en bordes con respiracion lenta; parpadeo ocasional de luz roja (flicker irregular, no estroboscopico, maximo 3 parpadeos por ciclo largo); grano; niebla baja animada.
3. **Componentes `src/components/fx/`** (todos con `aria-hidden="true"` y `pointer-events:none` salvo que se indique):
   - `BloodDrip.astro`: borde superior/inferior de seccion con goteo; las gotas se alargan y caen con animaciones CSS escalonadas (3 tamanos), colores `--blood`/`--gore`.
   - `ClawSlash.astro`: tres garras diagonales que se "cortan" al revelarse (clip-path animado) y quedan como marca; para titulos y banners.
   - `ChainHook.astro`: cadena con gancho que cuelga de una esquina y se balancea suavemente (transform-origin en el anclaje); variante pequena para tarjetas.
   - `Splatter.astro`: salpicadura vectorial generada con semilla (props `seed`, `size`, `tone`), con gotas satelite; usala como decoracion tras numeros grandes.
   - `ThornBorder.astro`: borde de espinas/punzones inspirado en la Entidad para recuadros destacados.
   - `Embers.astro`: 14 a 20 brasas/ceniza flotando (CSS puro) para el hero.
4. **Hero y portada** (`HeroArt.astro`, `index.astro`): reescribe el hero para que tenga mas impacto: luna enrojecida entre niebla, ganchos con cadenas, silueta de generador y reloj con arco de sangre; gotas de sangre que caen sobre el titular "APRENDE DBD COMPETITIVO" con la ClawSlash revelandose tras la palabra COMPETITIVO; contadores con `Splatter` detras. En las tarjetas de seccion anade las dos NUEVAS: **Callouts** (`/callouts/`, "El mapa como un reloj") y **4v1 competitivo** (`/competitivo/4v1/`, "La partida normal, con reglas"), con el mismo patron que las demas. Mantén todo el contenido y enlaces actuales.
5. **Componentes base**: `.card` con esquinas "rasgadas" (clip-path poligonal), borde fino que se enciende en `--blood` al hover y una marca de garra que se dibuja en la esquina; `SectionHead` con subrayado que gotea (usa `BloodDrip` pequeno) y numeracion mono; `StatBar` con relleno tipo liquido sangre (gradiente `--gore` a `--blood-2`) con menisco animado; `TierBadge` S con pulso rojo y chispa, A naranja, etc.; `Nav` con subrayado activo en forma de arañazo; `Footer` con cadena y gancho, y salpicadura sutil. Botones `.btn` primarios con efecto "corte" diagonal al hover. Foco visible siempre (`outline: 2px solid var(--amber)`).
6. **Movimiento** (`motion.js`): anade (a) revelado con "salpicadura" opcional `data-reveal="splash"`, (b) parpadeo de luz controlado, (c) parallax suave del hero, (d) transicion de entrada de pagina tipo corte (una franja roja que barre en 400 ms y desaparece; solo con JS y respetando reduced-motion). Todo con `transform`/`opacity`, 60 fps, sin layout thrashing.

## Reglas de calidad
- `prefers-reduced-motion: reduce`: sin goteo, sin parpadeo, sin barrido; estado final estatico y visible.
- Contraste AA en todo texto; los efectos nunca cubren texto ni bajan su legibilidad. El contenido es visible si el JS falla.
- Presupuesto: sin imagenes nuevas; el peso extra de CSS+SVG inline < 40 KB; no mas de 30 elementos animados simultaneos en pantalla.
- Mobile 360 px sin scroll horizontal (los efectos usan `overflow: clip` en sus contenedores).
- Cohesion: un solo lenguaje visual (sangre, oxido, cadenas, garras) usado con criterio: pocos efectos grandes, muchos detalles pequenos.
