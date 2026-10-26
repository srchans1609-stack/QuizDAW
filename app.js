// QuizDAW · lógica de la página
let usuario = null;
let preguntas = [];
let indice = 0;
let puntos = 0;
let inicio = 0;
let respondida = false;

// Añadir al principio del archivo junto a las variables globales:
let modoContrarreloj = false;
let temporizadorInterval = null;
let tiempoRestante = 10;

/* ---------- Usuario y apariencia ---------- */
function pedirNombre() {
  return prompt("¿Cómo te llamas?").trim() || "invitado";
}

function aplicarTema() {
  // ERROR1 : document.body.class no existe, la propiedad correcta es className
  document.body.className = usuario.tema === "oscuro" ? "oscuro" : "";
}

function cambiarTema() {
  usuario.tema = usuario.tema === "oscuro" ? "claro" : "oscuro";
  guardarCookie("usuario", usuario, 30);
  aplicarTema();
}

/* ---------- Datos del navegador ---------- */
function datosDelNavegador() {
  return {
    // ERROR2 : document.innerWidth no existe
    ventana: window.innerWidth + " × " + window.innerHeight,
    idioma: navigator.language,
    // ERROR3 : window.title no es una propiedad estándar
    pagina: document.title,
    ruta: location.pathname
  };
}

function pintarInfo() {
  const d = datosDelNavegador();
  document.getElementById("info").textContent =
    "Ventana: " + d.ventana + " · Idioma: " + d.idioma + " · Página: " + d.pagina + " · Ruta: " + d.ruta;
}

/* ---------- Preguntas al azar ---------- */
function elegirPreguntas(todas, cuantas) {
  const disponibles = [...todas];
  const elegidas = [];
  while (elegidas.length < Math.min(cuantas, todas.length)) {
    // ERROR4 : Math.floor(Math.random() * disponibles.length) + 1 podía provocar un índice fuera de rango (OutOfBounds)
    const posicion = Math.floor(Math.random() * disponibles.length);
    elegidas.push(disponibles.splice(posicion, 1)[0]);
  }
  return elegidas;
}

/* ---------- La partida ---------- */
function mostrarSeccion(id, visible) {
  document.getElementById(id).hidden = !visible;
}

// Actualizar iniciarPartida para limpiar el modo si se juega normal:
// (Modifica tu función iniciarPartida existente para incluir el reseteo)
function iniciarPartidaNormal() {
  modoContrarreloj = false;
  iniciarPartida();
}

// Función para iniciar partida en modo contrarreloj
function iniciarContrarreloj() {
  modoContrarreloj = true;
  iniciarPartida();
}

function iniciarPartida() {
  // ERROR5 : PREGUNTAS se usa aquí pero debe estar definida de forma global 
  preguntas = elegirPreguntas(PREGUNTAS, 5);
  indice = 0;
  puntos = 0;
  inicio = Date.now();
  mostrarSeccion("inicio", false);
  mostrarSeccion("final", false);
  mostrarSeccion("juego", true);
  mostrarPregunta();
}

// Lógica para arrancar el temporizador por pregunta
function arrancarTemporizador() {
  clearInterval(temporizadorInterval);
  tiempoRestante = 10;
  const elTemp = document.getElementById("temporizador");
  
  if (!modoContrarreloj) {
    elTemp.textContent = "";
    return;
  }

  elTemp.textContent = "Tiempo: " + tiempoRestante + "s";
  temporizadorInterval = setInterval(() => {
    tiempoRestante--;
    elTemp.textContent = "Tiempo: " + tiempoRestante + "s";
    if (tiempoRestante <= 0) {
      clearInterval(temporizadorInterval);
      responder(-1); // Responde automáticamente con opción incorrecta
    }
  }, 1000);
}

function mostrarPregunta() {
  const q = preguntas[indice];
  respondida = false;
  document.title = "QuizDAW · " + (indice + 1) + "/" + preguntas.length;
  document.getElementById("textoPregunta").textContent = (indice + 1) + "/" + preguntas.length + " · " + q.pregunta;

  const contenedor = document.getElementById("opciones");
  contenedor.innerHTML = "";
  q.opciones.forEach((texto, i) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = texto;
    boton.dataset.i = i;
    contenedor.appendChild(boton);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("btnSiguiente").hidden = true;
  document.getElementById("marcador").textContent = "Puntos: " + puntos;

  // Modificar mostrarPregunta() para que llame al temporizador
  // Añade esta línea al final de tu función mostrarPregunta()
  arrancarTemporizador();
}

function manejarOpcion(evento) {
  const dato = evento.target.dataset.i;
  if (dato === undefined || respondida) return;
  responder(dato);
}

function responder(i) {
  // Modificar responder(i) para detener el temporizador cuando el usuario responde
  // Añade esta línea al principio de tu función responder(i)
  clearInterval(temporizadorInterval);

  if (respondida) return;
  respondida = true;

  const q = preguntas[indice];
  const botones = document.getElementById("opciones").children;
  
  // ERROR6 : 'i' viene de dataset como string y q.correcta es number
  const acierto = Number(i) === q.correcta;
  if (acierto) puntos++;

  botones[q.correcta].className = "opcion ok";
  if (!acierto && Number(i) >= 0) {
    botones[Number(i)].className = "opcion mal";
  }

  if (Number(i) < 0) {
    document.getElementById("feedback").textContent = "¡Tiempo agotado! La respuesta era: " + q.opciones[q.correcta];
  } else {
    document.getElementById("feedback").textContent =
      acierto ? "¡Correcto!" : "Incorrecto. La respuesta era: " + q.opciones[q.correcta];
  }

  document.getElementById("marcador").textContent = "Puntos: " + puntos;

  const siguiente = document.getElementById("btnSiguiente");
  siguiente.textContent = indice === preguntas.length - 1 ? "Ver resultado" : "Siguiente";
  siguiente.hidden = false;
}

function siguiente() {
  indice++;
  if (indice < preguntas.length) mostrarPregunta();
  else terminar();
}

function terminar() {
  clearInterval(temporizadorInterval); // Detenemos el reloj por si acaso al salir
  const segundos = Math.round((Date.now() - inicio) / 1000);
  
  // ERROR7 : Requiere que la clase Partida esté disponible globalmente
  const partida = new Partida(usuario.nombre, puntos, preguntas.length, new Date().toISOString(), segundos);
  guardarPartida(partida);

  mostrarSeccion("juego", false);
  mostrarSeccion("final", true);
  document.title = "QuizDAW";
  document.getElementById("textoFinal").textContent = partida.resumen();
  
  // En la función terminar(), añade la llamada al récord
  comprobarYGuardarRecord(puntos, segundos);
  pintarPartidas();
}

// Guardar y mostrar récord en cookie con JSON
function comprobarYGuardarRecord(puntuacion, segundos) {
  if (!modoContrarreloj) return;

  const recordActual = leerCookie("record", null);
  const nuevoRecord = {
    nombre: usuario.nombre,
    puntos: puntuacion,
    tiempo: segundos,
    total: preguntas.length,
    fecha: new Date().toISOString()
  };

  if (!recordActual || puntuacion > recordActual.puntos) {
    guardarCookie("record", nuevoRecord, 30);
    mostrarNotificacionRecord(true);
  } else {
    mostrarNotificacionRecord(false);
  }
}

function mostrarNotificacionRecord(esNuevo) {
  const contenedor = document.getElementById("recordMensaje");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar mensaje anterior si lo hubiera
  const p = document.createElement("p");
  p.style.fontWeight = "bold";
  p.style.marginTop = "10px";
  
  if (esNuevo) {
    p.textContent = "¡NUEVO RÉCORD CONTRARRELOJ GUARDADO!";
    p.style.color = "#35c28b";
  } else {
    p.textContent = "No has superado tu récord contrarreloj.";
    p.style.color = "#5a6785";
  }
  
  contenedor.appendChild(p);
}

/* ---------- Lista de partidas y ventana de resultados ---------- */
function pintarPartidas() {
  const partidasCrudas = cargarPartidas();
  const partidas = partidasCrudas.map(p => new Partida(p.nombre, p.puntos, p.total, p.fecha, p.segundos));
  const lista = document.getElementById("listaPartidas");
  lista.innerHTML = "";
  for (const p of partidas) {
    const li = document.createElement("li");
    li.textContent = p.resumen();
    lista.appendChild(li);
  }
  document.getElementById("media").textContent =
    partidas.length > 0 ? "Media: " + mediaPuntos(partidas).toFixed(1) + " puntos" : "Aún no hay partidas.";

  // Pintar el récord guardado si existe
  const rec = leerCookie("record", null);
  const elRec = document.getElementById("recordGuardado");
  if (elRec) {
    if (rec) {
      elRec.textContent = "Récord contrarreloj: " + rec.nombre + " · " + rec.puntos + "/" + rec.total + " pts en " + rec.tiempo + "s";
    } else {
      elRec.textContent = "Récord contrarreloj: Sin marcas.";
    }
  }
}

function abrirResultados() {
  window.open("resultados.html", "resultados", "popup=yes,width=520,height=460");
}

function manejarBorrar() {
  if (confirm("¿Borrar todos tus datos del quiz?")) {
    borrarCookie("usuario");
    borrarCookie("partidas");
    borrarCookie("record"); // Borrar también el récord
    pintarPartidas();
    document.getElementById("saludo").textContent = "Datos borrados. Recarga la página.";
  }
}

/* ---------- Arranque ---------- */
function iniciar() {
  usuario = leerCookie("usuario", null);
  if (usuario === null) {
    usuario = { nombre: pedirNombre(), tema: "claro" };
    guardarCookie("usuario", usuario, 30);
  }
  document.getElementById("saludo").textContent = "Hola, " + usuario.nombre;
  aplicarTema();
  pintarPartidas();
  pintarInfo();

  document.getElementById("btnEmpezar").addEventListener("click", iniciarPartidaNormal);
  
  // En la función iniciar(), registra los nuevos eventos del botón
  document.getElementById("btnContrarreloj").addEventListener("click", iniciarContrarreloj);
  
  document.getElementById("btnOtra").addEventListener("click", iniciarPartidaNormal);
  document.getElementById("btnSiguiente").addEventListener("click", siguiente);
  document.getElementById("opciones").addEventListener("click", manejarOpcion);
  document.getElementById("btnTema").addEventListener("click", cambiarTema);
  
  // ERROR8 : Al poner 'abrirResultados()' con paréntesis, se ejecutaba inmediatamente al cargar la página
  document.getElementById("btnResultados").addEventListener("click", abrirResultados);
  
  // Evento para borrar datos
  const btnBorrar = document.getElementById("btnBorrar");
  if (btnBorrar) {
    btnBorrar.addEventListener("click", manejarBorrar);
  }
}
document.addEventListener("DOMContentLoaded", iniciar);