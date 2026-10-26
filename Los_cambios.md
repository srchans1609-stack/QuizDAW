# Guion - Punto 1: Explicación de los cambios

Aquí tienes dos formas de explicar los cambios al profesor. Elige la que mejor se adapte a tu forma de hablar.

## Opción 1: Explicación natural y directa

"Profe, te explico dos arreglos importantes que tuve que hacer para que el juego guardara bien las partidas:

1. **El problema con el nombre de las cookies:** Al guardar la cookie de las partidas, no le estaba poniendo el prefijo `quiz_`, pero al intentar leerla el código sí que lo buscaba. Como no se llamaban igual, nunca encontraba los datos. Lo arreglé añadiendo la variable `PREFIJO` en la función de guardar.
2. **El fallo al leer el JSON:** Cuando leía los datos de la cookie, llegaban como objetos planos y perdían las funciones de mi clase `Partida` (como `.resumen()`). Lo solucioné usando `.map()` para coger esos datos y volver a instanciar objetos `Partida` reales, recuperando así sus funciones."

---

## Opción 2: Explicación un poco más técnica

"He solucionado varios errores para que la persistencia de datos funcione correctamente. Destaco estos dos:

1. **Sincronización del prefijo en cookies:** Había un fallo en `cookies.js` donde `guardarCookie` no incluía la constante `PREFIJO` (`quiz_`), haciendo que `leerCookie` devolviera vacío. Lo corregí concatenando el prefijo en el `document.cookie`.
2. **Reinstanciación de objetos JSON:** Al hacer un `JSON.parse` de la cookie, obteníamos objetos genéricos sin los métodos de la clase `Partida`. Para poder imprimir la tabla, tuve que mapear el array resultante pasándole los parámetros al constructor `new Partida(...)` para poder volver a ejecutar `p.resumen()` sin que diese error."