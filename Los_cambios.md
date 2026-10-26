# Explicación de los cambios realizados

## 1. Corrección del prefijo en las cookies
* **Problema:** Las partidas no se guardaban correctamente porque las funciones de lectura buscaban la cookie empleando un prefijo específico (`quiz_`), pero la función encargada de guardarla la creaba directamente sin incluir dicho prefijo.
* **Solución:** Se añadió la constante `PREFIJO` dentro de la función de guardado (`guardarCookie`) para que el nombre coincida de forma exacta con el que busca el sistema al leerla.

## 2. Reinstanciación de objetos con la clase Partida
* **Problema:** Al recuperar el array de partidas desde la cookie mediante `JSON.parse()`, los datos se convertían en objetos planos genéricos que perdían los métodos de la clase `Partida` (como `.resumen()`), provocando errores al intentar ejecutarlos.
* **Solución:** Se implementó un método `.map()` en la función de pintado para transformar cada objeto plano recuperado en una instancia oficial de la clase `Partida`, permitiendo usar sus métodos con normalidad.