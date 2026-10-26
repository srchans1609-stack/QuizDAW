// Una partida jugada: quién, cuántos puntos, cuándo y cuánto tardó
class Partida {
  constructor(nombre, puntos, total, fecha, segundos) {
    this.nombre = nombre;
    this.puntos = puntos;
    this.total = total;
    this.fecha = fecha;          
    this.segundos = segundos;
  }

  porcentaje() {
    return Math.round(this.puntos / this.total * 100);
  }

  resumen() {
    return this.nombre + ": " + this.puntos + "/" + this.total + " (" + this.porcentaje() + " %) · " +
            formatearFecha(this.fecha) + " · " + this.segundos + " s";
  }
}

function formatearFecha(textoISO) {
  const f = new Date(textoISO);
  // ERROR1: getMonth() devuelve de 0 a 11
  // ERROR2: getYear() devuelve los años desde 1900
  return f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
}


function cargarPartidas() {
  const datos = leerCookie("partidas", []);
  return datos;
}

function guardarPartida(partida) {
  const partidas = cargarPartidas();
  partidas.unshift(partida);
  guardarCookie("partidas", partidas.slice(0, 5), 30);
}

function mediaPuntos(partidas) {
  if (partidas.length === 0) return 0;
  // ERROR3: En el reduce falta indicar el valor inicial (0) al final.
  return partidas.reduce((suma, p) => suma + p.puntos, 0) / partidas.length;
}

