# TAREA 10: Gore v2, mas intenso y mejor ejecutado (Copilot)

Revisaste el trabajo de la tarea 09 en `src/components/fx/*`, `global.css`, `HeroArt.astro` e `index.astro`. Lo revise en pantalla (escritorio 1440 y movil 390) y el resultado es demasiado timido: el usuario pidio "mas gore, con efectos interesantes adaptados al juego, pero que se vea profesional". Corrige TODO lo siguiente, manteniendo las reglas de calidad de la tarea 09 (vector, sin imagenes nuevas, `prefers-reduced-motion`, contraste AA, sin scroll horizontal, sangre y heridas ESTILIZADAS, nada realista).

## Defectos concretos observados
1. **Hero (escritorio)**: se ve una costura: el arte empieza hacia x=500 con un fondo distinto y a la izquierda queda un bloque plano mas claro. El arte debe ocupar TODO el ancho del hero con degradado continuo, sin bordes visibles.
2. **Hero (movil 390)**: el tercio superior esta vacio y casi negro; el reloj queda tapado por los botones. Reorganiza: arte visible arriba (luna roja, ganchos, reloj), titular debajo, botones sin tapar el reloj.
3. **Ganchos y cadenas**: se ven como alambres huecos en gris; dales cuerpo: eslabones rellenos con volumen, oxido (`--rust`), brillo rojo en la punta del gancho, y que algunos lleven una silueta colgando (bulto envuelto, estilizado, sin rostro ni detalle anatomico) con gotas cayendo.
4. **"Garras" (`ClawSlash`)**: parecen rayitas rojas sueltas, sin intencion. Rehaz: 3 cortes paralelos con borde irregular (formas de path, no lineas), mas anchos en el centro y afilados en las puntas, con borde interior oscuro y relieve; se "abren" con una animacion de corte de 350 ms y dejan la herida con un brillo humedo. Usalas tras la palabra COMPETITIVO, en el banner "Nuevo: Terrifier" (una sola marca grande, no seis dispersas) y como esquina de tarjetas destacadas.
5. **Salpicaduras (`Splatter`)**: casi invisibles tras los contadores. Subelas a opacidad 25-40 %, con gotas satelite visibles y mancha principal irregular, en `--gore`/`--blood`; que cada contador tenga la suya con semilla distinta.
6. **Goteo (`BloodDrip`)**: demasiado pequeno y uniforme. Gotas de 3 a 5 tamanos, con gota que cuelga (forma de lagrima), alguna cae y deja marca; en el borde inferior del hero y en los titulos de seccion un charco/borde de sangre ondulado de 14 a 26 px.
7. **Titular del hero**: haz que gotee: las letras de COMPETITIVO con 2-3 hilos de sangre que bajan desde el borde inferior de las letras (SVG superpuesto) y un leve brillo humedo. Legibilidad intacta.
8. **Panel "Nuevo: Terrifier"**: los 6 trazos rojos dispersos estorban. Sustituyelos por una marca de garra grande y bien hecha en una esquina, un borde de espinas (`ThornBorder`) mas legible y una salpicadura bajo la fecha.
9. **Resto del sitio**: el gore casi no existe fuera de la portada. Anade, via `global.css` y las clases compartidas (`.card`, `.stat`, `SectionHead`, `.btn`, `.chip`, `Footer`): charco ondulado bajo cada `SectionHead` (a nivel de H2, no del bloque), esquina rasgada con marca de sangre en `.card:hover`, huella o salpicadura muy sutil (<8 %) en el fondo del `body` por tramos, borde inferior del Footer con goteo, `.btn` primario con efecto de herida (corte diagonal con brillo) al hover y `.stat strong` con una sombra roja sutil. Mantén el contraste.
10. **Fondo**: aumenta la atmosfera: niebla roja baja (degradado) en la parte inferior de la ventana, viñeta mas marcada en esquinas, y un parpadeo de luz mas perceptible pero seguro (maximo 2 pulsos suaves cada 14 s, nunca estroboscopico).

## Alcance (igual que la tarea 09, mas lo indicado)
`src/styles/global.css`, `src/layouts/Base.astro`, `src/scripts/motion.js`, `src/components/{Nav,Footer,HeroArt,SectionHead,StatBar,TierBadge,PerkCard,Chip,Portrait,PerkIcon,MapThumb}.astro`, `src/components/fx/*` (modificar y crear), `src/pages/index.astro`, `src/pages/404.astro`. No edites otras paginas. Cada archivo `.astro` debe empezar con `---` de apertura de frontmatter SOLO si tiene frontmatter, y cerrarlo con `---`; si no tiene frontmatter no pongas `---`.

## Criterios de aceptacion
- A simple vista: la portada se siente como un trial de Dead by Daylight: niebla, luna, ganchos con cadenas oxidadas, sangre que gotea y marcas de garras bien dibujadas. Aun asi el titular, los botones y los numeros se leen perfecto.
- No hay costuras, cajas visibles ni elementos cortados en 360, 390, 768, 1440 y 1920 px de ancho.
- Con `prefers-reduced-motion: reduce` todo queda estatico y visible.
- Peso extra de CSS+SVG inline < 60 KB; maximo 30 elementos animados simultaneos.
