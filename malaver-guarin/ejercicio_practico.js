const $ = (id) => document.getElementById(id);

// Elementos HTML
const card = $("pokemonCard");
const titulo = $("cardTitle");
const nombreEl = $("result_name");
const imagenEl = $("result_img");
const mensajeEl = $("statusMessage");
const detallesEl = $("pokemonDetails");

const inputNombre = $("inputNombre");
const btnBuscarNombre = $("btnBuscarNombre");
const inputId = $("inputId");
const btnBuscarId = $("btnBuscarId");

// Petición a la API
const obtenerDatosPokemon = async (query) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query.toLowerCase())}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado");
  }
  return await respuesta.json();
};

// Mostrar Pokémon
const mostrarPokemon = (datos) => {
  card.style.display = "block";
  titulo.textContent = "¡Pokémon encontrado!";
  nombreEl.textContent = datos.name.toUpperCase();

  const imagen =
    datos.sprites.other?.dream_world?.front_default ||
    datos.sprites.other?.["official-artwork"]?.front_default ||
    datos.sprites.front_default;

  imagenEl.src = imagen || "";
  imagenEl.alt = `Imagen de ${datos.name}`;

  // Mostrar propiedades
  const habilidades = datos.abilities
    .map((a) => a.ability.name)
    .join(", ");

  detallesEl.innerHTML = `
    <div class="row"><strong>ID:</strong><span>${datos.id}</span></div>
    <div class="row"><strong>Peso:</strong><span>${datos.weight}</span></div>
    <div class="row"><strong>Altura:</strong><span>${datos.height}</span></div>
    <div class="row"><strong>Habilidades:</strong><span>${habilidades}</span></div>
  `;
};

// Actualiza UI al cargar
const estadoCargando = (cargando, mensaje = "") => {
  mensajeEl.textContent = mensaje;
  btnBuscarNombre.disabled = cargando;
  btnBuscarId.disabled = cargando;
  if (cargando) {
    titulo.textContent = "Buscando...";
    nombreEl.textContent = "Cargando...";
    imagenEl.src = "";
    detallesEl.innerHTML = "";
  }
};

// Buscar por nombre
const buscarPorNombre = async () => {
  const nombre = inputNombre.value.trim();
  if (!nombre) {
    mensajeEl.textContent = "Ingrese un nombre válido";
    return;
  }

  estadoCargando(true, "Buscando Pokémon por nombre...");

  try {
    const datos = await obtenerDatosPokemon(nombre);
    mostrarPokemon(datos);
  } catch (e) {
    titulo.textContent = "Error";
    nombreEl.textContent = "No encontrado";
    detallesEl.innerHTML = "";
    imagenEl.src = "";
    mensajeEl.textContent = e.message;
  } finally {
    estadoCargando(false);
  }
};

// Buscar por ID
const buscarPorId = async () => {
  const id = inputId.value.trim();
  if (!/^\d+$/.test(id)) {
    mensajeEl.textContent = "Ingrese un número de ID válido";
    return;
  }

  estadoCargando(true, "Buscando Pokémon por ID...");

  try {
    const datos = await obtenerDatosPokemon(id);
    mostrarPokemon(datos);
  } catch (e) {
    titulo.textContent = "Error";
    nombreEl.textContent = "No encontrado";
    detallesEl.innerHTML = "";
    imagenEl.src = "";
    mensajeEl.textContent = e.message;
  } finally {
    estadoCargando(false);
  }
};

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  // Cargar Pokémon por defecto
  buscarPorNombre('pikachu');

  btnBuscarNombre.addEventListener("click", buscarPorNombre);
  btnBuscarId.addEventListener("click", buscarPorId);

  inputNombre.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarPorNombre();
  });

  inputId.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarPorId();
  });
});
