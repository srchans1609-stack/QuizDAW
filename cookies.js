// Funciones para guardar, leer y borrar cookies con valores JSON.
// Todas las cookies de este proyecto empiezan por "quiz_".
const PREFIJO = "quiz_";

function guardarCookie(nombre, valor, dias) {
  const d = new Date();
  d.setTime(d.getTime() + (dias * 24 * 60 * 60 * 1000));//Error1 : esta mal los segundos
  // ERROR2 : No se estaba añadiendo la variable PREFIJO al guardar, por lo que leerCookie no la encontraba
document.cookie = PREFIJO + nombre + "=" + JSON.stringify(valor) + "; expires=" + d.toUTCString() + "; path=/";
}

function leerCookie(nombre, porDefecto) {
  const clave = PREFIJO + nombre + "=";
  const trozo = document.cookie.split("; ").find(c => c.startsWith(clave));
  if (!trozo) return porDefecto;
  return JSON.parse(trozo.slice(clave.length));
}
//ERRor3 : no esta el path bien hecho
function borrarCookie(nombre) {
  document.cookie = PREFIJO + nombre + "=; max-age=0; path=/";
}