function pintarResultados() {
  const partidasCrudas = cargarPartidas();
  const partidas = partidasCrudas.map(p => new Partida(p.nombre, p.puntos, p.total, p.fecha, p.segundos));
  
  // ERROR1 : La propiedad original de la clase Partida se llama 'segundos', no 'tiempo'
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";
  for (const p of partidas) {
    const fila = document.createElement("tr");
    const textos = [p.nombre, p.puntos + "/" + p.total, p.porcentaje() + " %", formatearFecha(p.fecha)];
    for (const texto of textos) {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    }
    tabla.appendChild(fila);
  }
  document.getElementById("mediaRes").textContent =
    partidas.length > 0 ? "Media: " + mediaPuntos(partidas).toFixed(1) + " puntos" : "Aún no hay partidas.";
}

// FALTABA ESTA LÍNEA: Es obligatoria para que la función se dispare al abrir resultados.html
document.addEventListener("DOMContentLoaded", pintarResultados);