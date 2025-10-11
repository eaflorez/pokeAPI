// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper corta

// Variables de la única tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

// NUEVOS ELEMENTOS para detalles
let idResultadoEl = $("result_id");
let pesoResultadoEl = $("result_weight");
let alturaResultadoEl = $("result_height");
let habilidadesResultadoEl = $("result_abilities");

// Si los elementos no existen (por compatibilidad), los creamos dinámicamente
if (!idResultadoEl) {
  idResultadoEl = document.createElement("p");
  idResultadoEl.id = "result_id";
  imagenResultadoEl.parentNode.appendChild(idResultadoEl);
}
if (!pesoResultadoEl) {
  pesoResultadoEl = document.createElement("p");
  pesoResultadoEl.id = "result_weight";
  imagenResultadoEl.parentNode.appendChild(pesoResultadoEl);
}
if (!alturaResultadoEl) {
  alturaResultadoEl = document.createElement("p");
  alturaResultadoEl.id = "result_height";
  imagenResultadoEl.parentNode.appendChild(alturaResultadoEl);
}
if (!habilidadesResultadoEl) {
  habilidadesResultadoEl = document.createElement("p");
  habilidadesResultadoEl.id = "result_abilities";
  imagenResultadoEl.parentNode.appendChild(habilidadesResultadoEl);
}

// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");

// NUEVOS ELEMENTOS para búsqueda por ID
let inputBuscarID = $("inputID");
let botonBuscarID = $("btnBuscarID");

// Si no existen, los creamos dinámicamente (para compatibilidad con mejora.html)
if (!inputBuscarID) {
  inputBuscarID = document.createElement("input");
  inputBuscarID.type = "number";
  inputBuscarID.id = "inputID";
  inputBuscarID.className = "search-input";
  inputBuscarID.placeholder = "ID del Pokémon";
  inputBuscarID.min = "1";
  botonBuscar.parentNode.parentNode.appendChild(inputBuscarID);
}
if (!botonBuscarID) {
  botonBuscarID = document.createElement("button");
  botonBuscarID.id = "btnBuscarID";
  botonBuscarID.className = "search-button";
  botonBuscarID.textContent = "Buscar por ID";
  inputBuscarID.parentNode.appendChild(botonBuscarID);
}

const mensajeEstadoEl = $("statusMessage");

// --- 2. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (valor) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${valor.toString().toLowerCase()}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado. Verifique el nombre o ID.");
  }

  return respuesta.json();
};

/**
 * Pinta el nombre, imagen y detalles en la tarjeta.
 */
const mostrarPokemonEnTarjeta = (datos) => {
  // Nombre + ID
  nombreResultadoEl.textContent = `${capitalize(datos.name)} (#${datos.id})`;
  // Imagen
  imagenResultadoEl.src =
    datos.sprites.other["official-artwork"].front_default ||
    datos.sprites.front_default;
  imagenResultadoEl.alt = `Imagen de ${datos.name}`;
  // ID
  idResultadoEl.textContent = ""; // Ya está en el nombre
  // Peso (en kg)
  // Peso
pesoResultadoEl.innerHTML = `<strong>Peso:</strong> ${(datos.weight / 10).toFixed(1)} kg`;

// Altura
alturaResultadoEl.innerHTML = `<strong>Altura:</strong> ${(datos.height / 10).toFixed(2)} m`;

// Habilidades
habilidadesResultadoEl.innerHTML = "<strong>Habilidades:</strong>";

const listaHabilidades = document.createElement("ul");

// Recorremos todas las habilidades del Pokémon
datos.abilities.forEach((habilidad) => {
  const li = document.createElement("li");
  li.textContent = capitalize(habilidad.ability.name) + (habilidad.is_hidden ? " (Oculta)" : "");
  listaHabilidades.appendChild(li);
});

// Añadimos la lista dentro del contenedor
habilidadesResultadoEl.appendChild(listaHabilidades);


  

  tarjetaPokemonEl.style.display = "block";
  tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- 3. UTILIDAD PARA EL ESTADO (Carga y Errores) ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
  mensajeEstadoEl.textContent = mensaje;
  botonBuscar.disabled = cargando;
  botonBuscarID.disabled = cargando;

  if (cargando) {
    tituloTarjetaEl.textContent = "Buscando...";
    nombreResultadoEl.textContent = "Cargando...";
    imagenResultadoEl.src = "";
    pesoResultadoEl.textContent = "";
    alturaResultadoEl.textContent = "";
    habilidadesResultadoEl.innerHTML = "";
    nombreResultadoEl.classList.add("loading");
    tarjetaPokemonEl.style.display = "block";
  } else {
    nombreResultadoEl.classList.remove("loading");
  }
};

// --- 4. CARGA INICIAL (Pikachu) ---
const cargarPokemonPorDefecto = async () => {
  actualizarEstadoUI(true);

  try {
    const datos = await obtenerDatosPokemon("pikachu");
    mostrarPokemonEnTarjeta(datos);
    tituloTarjetaEl.textContent = "Pokémon Inicial";
  } catch (error) {
    tituloTarjetaEl.textContent = "Error de Carga";
    nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";
    imagenResultadoEl.src = "";
    pesoResultadoEl.textContent = "";
    alturaResultadoEl.textContent = "";
    habilidadesResultadoEl.innerHTML = "";
  } finally {
    nombreResultadoEl.classList.remove("loading");
    botonBuscar.disabled = false;
    botonBuscarID.disabled = false;
  }
};

// --- 5. LÓGICA PRINCIPAL DE BÚSQUEDA (Nombre o ID) ---
const buscarPokemonPorNombre = async () => {
  const nombre = inputBuscar.value.trim();

  if (!nombre) {
    mensajeEstadoEl.textContent = "Debe escribir un nombre para buscar.";
    return;
  }

  // Bloquea si es un número
  if (/^\d+$/.test(nombre)) {
    mensajeEstadoEl.textContent =
      "Para buscar por ID, use el campo de ID y el botón correspondiente.";
    return;
  }

  actualizarEstadoUI(true);
  tituloTarjetaEl.textContent = "Buscando Pokémon...";

  try {
    const datos = await obtenerDatosPokemon(nombre);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `¡${capitalize(datos.name)} encontrado!`);
    inputBuscar.value = "";
  } catch (error) {
    mostrarErrorBusqueda(error);
  }
};

const buscarPokemonPorID = async () => {
  const id = inputBuscarID.value.trim();

  if (!id) {
    mensajeEstadoEl.textContent = "Debe escribir un ID para buscar.";
    return;
  }

  if (!/^\d+$/.test(id) || parseInt(id) < 1) {
    mensajeEstadoEl.textContent = "El ID debe ser un número positivo.";
    return;
  }

  actualizarEstadoUI(true);
  tituloTarjetaEl.textContent = "Buscando Pokémon...";

  try {
    const datos = await obtenerDatosPokemon(id);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `¡${capitalize(datos.name)} encontrado!`);
    inputBuscarID.value = "";
  } catch (error) {
    mostrarErrorBusqueda(error);
  }
};

function mostrarErrorBusqueda(error) {
  tituloTarjetaEl.textContent = "Pokémon No Encontrado";
  nombreResultadoEl.textContent = "No encontrado";
  imagenResultadoEl.src = "https://via.placeholder.com/150x150?text=404";
  pesoResultadoEl.textContent = "";
  alturaResultadoEl.textContent = "";
  habilidadesResultadoEl.innerHTML = "";
  actualizarEstadoUI(false, error.message);
}

// --- 6. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  cargarPokemonPorDefecto();

  botonBuscar.addEventListener("click", buscarPokemonPorNombre);

  inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarPokemonPorNombre();
    }
  });

  botonBuscarID.addEventListener("click", buscarPokemonPorID);

  inputBuscarID.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarPokemonPorID();
    }
  });
});
