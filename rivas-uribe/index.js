// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper corta

// Variables de la única tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

// Variables para datos adicionales
const pokemonIDEl = $("pokemonID");
const pokemonHeightEl = $("pokemonHeight");
const pokemonWeightEl = $("pokemonWeight");
const pokemonAbilitiesEl = $("pokemonAbilities");

// Variables del buscador por nombre
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");

// Variables del buscador por ID
const inputBuscarID = $("inputPokemonID");
const botonBuscarID = $("btnBuscarID");

const mensajeEstadoEl = $("statusMessage");

// Mapa de colores por tipo Pokémon
const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// --- 2. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (nombreOId) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${nombreOId.toString().toLowerCase()}`;

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado. Verifique el nombre o ID."); // Tira error si no encuentra
  }

  return respuesta.json(); // Devuelve el JSON
};

/**
 * Pinta el nombre, imagen y datos extra en la única tarjeta.
 * Además cambia el color de fondo según tipo principal.
 */
const mostrarPokemonEnTarjeta = (datos) => {
  tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
  nombreResultadoEl.textContent = datos.name;
  imagenResultadoEl.src =
    datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
  imagenResultadoEl.alt = `Imagen de ${datos.name}`;

  // Mostrar datos adicionales
  pokemonIDEl.textContent = datos.id;
  pokemonHeightEl.textContent = `${datos.height / 10} m`; // Altura en metros (altura está en decímetros)
  pokemonWeightEl.textContent = `${datos.weight / 10} kg`; // Peso en kg (peso está en hectogramos)

  // Limpia habilidades previas
  pokemonAbilitiesEl.innerHTML = "";
  datos.abilities.forEach((habilidadObj) => {
    const li = document.createElement("li");
    li.textContent = habilidadObj.ability.name;
    pokemonAbilitiesEl.appendChild(li);
  });

  // Cambiar color de fondo de la tarjeta según tipo principal
  const tipoPrincipal = datos.types[0].type.name;
  tarjetaPokemonEl.style.backgroundColor = typeColors[tipoPrincipal] || "#777";

  tarjetaPokemonEl.style.display = "block";
};

// --- 3. UTILIDAD PARA EL ESTADO (Carga y Errores) ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
  mensajeEstadoEl.textContent = mensaje;

  // Deshabilita ambos botones durante la carga
  botonBuscar.disabled = cargando;
  botonBuscarID.disabled = cargando;

  if (cargando) {
    tituloTarjetaEl.textContent = "Buscando...";
    nombreResultadoEl.textContent = "Cargando...";
    imagenResultadoEl.src = "";
    nombreResultadoEl.classList.add("loading"); // Aplica animación

    // Limpia datos adicionales mientras carga
    pokemonIDEl.textContent = "";
    pokemonHeightEl.textContent = "";
    pokemonWeightEl.textContent = "";
    pokemonAbilitiesEl.innerHTML = "";

    tarjetaPokemonEl.style.display = "block";
  } else {
    nombreResultadoEl.classList.remove("loading"); // Quita animación
  }
};

// --- 4. CARGA INICIAL (Pikachu) ---
const cargarPokemonPorDefecto = async () => {
  actualizarEstadoUI(true);

  try {
    const datos = await obtenerDatosPokemon("pikachu");
    mostrarPokemonEnTarjeta(datos);
    tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
  } catch (error) {
    tituloTarjetaEl.textContent = "Error de Carga";
    nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";

    // Limpia datos adicionales
    pokemonIDEl.textContent = "";
    pokemonHeightEl.textContent = "";
    pokemonWeightEl.textContent = "";
    pokemonAbilitiesEl.innerHTML = "";
  } finally {
    nombreResultadoEl.classList.remove("loading");
    botonBuscar.disabled = false;
    botonBuscarID.disabled = false;
  }
};

// --- 5. LÓGICA PRINCIPAL DE BÚSQUEDA POR NOMBRE ---
const buscarPokemon = async () => {
  const nombre = inputBuscar.value.trim();

  if (!nombre) {
    mensajeEstadoEl.textContent = "Debe escribir un nombre para buscar.";
    return;
  }

  if (/^\d+$/.test(nombre)) {
    mensajeEstadoEl.textContent =
      "Búsqueda por ID no permitida en este campo. Use el campo de búsqueda por ID.";
    return;
  }

  actualizarEstadoUI(true);
  tituloTarjetaEl.textContent = "Buscando Pokémon...";

  try {
    const datos = await obtenerDatosPokemon(nombre);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `${datos.name} encontrado!`);
    inputBuscar.value = "";
  } catch (error) {
    tituloTarjetaEl.textContent = "Pokémon No Encontrado";
    nombreResultadoEl.textContent = "No encontrado";
    mensajeEstadoEl.textContent = error.message;

    // Limpia datos adicionales
    pokemonIDEl.textContent = "";
    pokemonHeightEl.textContent = "";
    pokemonWeightEl.textContent = "";
    pokemonAbilitiesEl.innerHTML = "";

    actualizarEstadoUI(false, error.message);
  }
};

// --- 6. LÓGICA DE BÚSQUEDA POR ID ---
const buscarPokemonPorID = async () => {
  const id = inputBuscarID.value.trim();

  if (!id) {
    mensajeEstadoEl.textContent = "Debe escribir un ID para buscar.";
    return;
  }

  if (!/^\d+$/.test(id)) {
    mensajeEstadoEl.textContent = "El ID debe ser un número válido.";
    return;
  }

  actualizarEstadoUI(true);
  tituloTarjetaEl.textContent = "Buscando Pokémon por ID...";

  try {
    const datos = await obtenerDatosPokemon(id);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `Pokémon con ID ${id} encontrado!`);
    inputBuscarID.value = "";
  } catch (error) {
    tituloTarjetaEl.textContent = "Pokémon No Encontrado";
    nombreResultadoEl.textContent = "No encontrado";
    mensajeEstadoEl.textContent = error.message;

    // Limpia datos adicionales
    pokemonIDEl.textContent = "";
    pokemonHeightEl.textContent = "";
    pokemonWeightEl.textContent = "";
    pokemonAbilitiesEl.innerHTML = "";

    actualizarEstadoUI(false, error.message);
  }
};

// --- 7. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  cargarPokemonPorDefecto();

  botonBuscar.addEventListener("click", buscarPokemon);
  inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarPokemon();
    }
  });

  botonBuscarID.addEventListener("click", buscarPokemonPorID);
  inputBuscarID.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      buscarPokemonPorID();
    }
  });
});
