// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper corta

// Variables de la única tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const mensajeEstadoEl = $("statusMessage");

// --- 2. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (nombre) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado. Verifique el nombre."); // Tira error si no encuentra
  }

  return respuesta.json(); // Devuelve el JSON
};

/**
 * Pinta el nombre y la imagen en la única tarjeta.
 */
const mostrarPokemonEnTarjeta = (datos) => {
  tituloTarjetaEl.textContent = "¡Pokémon Encontrado!"; // Título genérico al encontrar
  nombreResultadoEl.textContent = datos.name;
  imagenResultadoEl.src =
    datos.sprites.other.dream_world.front_default ||
    datos.sprites.front_default; // Imagen de alta calidad, si no existe usa la estándar
  imagenResultadoEl.alt = `Imagen de ${datos.name}`;
  tarjetaPokemonEl.style.display = "block";
};

// --- 3. UTILIDAD PARA EL ESTADO (Carga y Errores) ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
  mensajeEstadoEl.textContent = mensaje;
  botonBuscar.disabled = cargando; // Deshabilita el botón

  if (cargando) {
    tituloTarjetaEl.textContent = "Buscando...";
    nombreResultadoEl.textContent = "Cargando...";
    imagenResultadoEl.src = "";
    nombreResultadoEl.classList.add("loading"); // Aplica animación
    tarjetaPokemonEl.style.display = "block";
  } else {
    nombreResultadoEl.classList.remove("loading"); // Quita animación
    // La tarjeta se mantiene visible.
  }
};

// --- 4. CARGA INICIAL (Pikachu) ---
const cargarPokemonPorDefecto = async () => {
  actualizarEstadoUI(true);

  try {
    const datos = await obtenerDatosPokemon("pikachu");
    mostrarPokemonEnTarjeta(datos);
    tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)"; // Sobrescribe el título genérico
  } catch (error) {
    tituloTarjetaEl.textContent = "Error de Carga";
    nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";
  } finally {
    nombreResultadoEl.classList.remove("loading");
    botonBuscar.disabled = false;
  }
};

// --- 5. LÓGICA PRINCIPAL DE BÚSQUEDA (Solo por Nombre) ---
const buscarPokemon = async () => {
  const nombre = inputBuscar.value.trim(); // Limpia el input

  if (!nombre) {
    mensajeEstadoEl.textContent = "Debe escribir un nombre para buscar.";
    return; // Para la función si está vacío
  }

  // VALIDACIÓN: Bloquea si es un número (es decir, un ID).
  if (/^\d+$/.test(nombre)) {
    mensajeEstadoEl.textContent =
      "Búsqueda por ID no permitida. Use el nombre del Pokémon.";
    return;
  }

  actualizarEstadoUI(true); // Muestra carga
  tituloTarjetaEl.textContent = "Buscando Pokémon...";

  try {
    const datos = await obtenerDatosPokemon(nombre); // Llama a la API
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `${datos.name} encontrado!`);
    inputBuscar.value = ""; // Limpia el input
  } catch (error) {
    tituloTarjetaEl.textContent = "Pokémon No Encontrado";
    nombreResultadoEl.textContent = "No encontrado";
    imagenResultadoEl.src =
      "https://i.pinimg.com/159x/63/63/02/636302159cf1df99b3a6f3ef69f4c3b1.jpg"; // Imagen de error
    actualizarEstadoUI(false, error.message);
  }
};

// --- 6. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  cargarPokemonPorDefecto(); // Carga Pikachu al iniciar

  botonBuscar.addEventListener("click", buscarPokemon); // Click en el botón

  inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarPokemon(); // Enter en el input
    }
  });
});
