// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id);

// Variables de la tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");
const idResultadoEl = $("result_id");
const pesoResultadoEl = $("result_weight");
const alturaResultadoEl = $("result_height");
const habilidadesResultadoEl = $("result_abilities");

// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const inputBuscarID = $("inputPokemonID");
const botonBuscarID = $("btnBuscarID");
const mensajeEstadoEl = $("statusMessage");

// --- 2. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (entrada) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${entrada.toLowerCase()}`;
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado.");
  }
  return respuesta.json();
};

// --- 3. MOSTRAR DATOS EN TARJETA ---
const mostrarPokemonEnTarjeta = (datos) => {
  tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
  nombreResultadoEl.textContent = datos.name;
  imagenResultadoEl.src =
    datos.sprites.other.dream_world.front_default ||
    datos.sprites.front_default;
  imagenResultadoEl.alt = `Imagen de ${datos.name}`;

  // Mostrar más información
  idResultadoEl.textContent = `ID: ${datos.id}`;
  pesoResultadoEl.textContent = `Peso: ${datos.weight / 10} kg`;
  alturaResultadoEl.textContent = `Altura: ${datos.height / 10} m`;

  // Listar habilidades
  habilidadesResultadoEl.innerHTML = "";
  datos.abilities.forEach((hab) => {
    const li = document.createElement("li");
    li.textContent = hab.ability.name;
    habilidadesResultadoEl.appendChild(li);
  });

  tarjetaPokemonEl.style.display = "block";
};

// --- 4. ESTADO UI ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
  mensajeEstadoEl.textContent = mensaje;
  botonBuscar.disabled = cargando;
  botonBuscarID.disabled = cargando;

  if (cargando) {
    tituloTarjetaEl.textContent = "Buscando...";
    nombreResultadoEl.textContent = "Cargando...";
    imagenResultadoEl.src = "";
  }
};

// --- 5. LÓGICA DE BÚSQUEDA ---
const buscarPokemonPorNombre = async () => {
  const nombre = inputBuscar.value.trim();
  if (!nombre) {
    mensajeEstadoEl.textContent = "Debe escribir un nombre.";
    return;
  }

  actualizarEstadoUI(true);
  try {
    const datos = await obtenerDatosPokemon(nombre);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `${datos.name} encontrado!`);
  } catch (error) {
    tituloTarjetaEl.textContent = "No encontrado";
    imagenResultadoEl.src =
      "https://i.pinimg.com/159x/63/63/02/636302159cf1df99b3a6f3ef69f4c3b1.jpg";
    actualizarEstadoUI(false, error.message);
  }
};

const buscarPokemonPorID = async () => {
  const id = inputBuscarID.value.trim();
  if (!id) {
    mensajeEstadoEl.textContent = "Debe escribir un ID.";
    return;
  }

  actualizarEstadoUI(true);
  try {
    const datos = await obtenerDatosPokemon(id);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false, `${datos.name} encontrado!`);
  } catch (error) {
    tituloTarjetaEl.textContent = "No encontrado";
    imagenResultadoEl.src =
      "https://i.pinimg.com/159x/63/63/02/636302159cf1df99b3a6f3ef69f4c3b1.jpg";
    actualizarEstadoUI(false, error.message);
  }
};

// --- 6. CARGA INICIAL ---
const cargarPokemonPorDefecto = async () => {
  try {
    const datos = await obtenerDatosPokemon("pikachu");
    mostrarPokemonEnTarjeta(datos);
    tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
  } catch {
    tituloTarjetaEl.textContent = "Error al cargar Pikachu";
  }
};

// --- 7. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  cargarPokemonPorDefecto();
  botonBuscar.addEventListener("click", buscarPokemonPorNombre);
  botonBuscarID.addEventListener("click", buscarPokemonPorID);
});
