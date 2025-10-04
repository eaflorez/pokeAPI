// Función helper $
const $ = (id) => document.getElementById(id);

// Variables de elementos
const resultNameEl = $("result_name");
const resultImgEl = $("result_img");
const inputPokemonEl = $("inputPokemon");
const btnBuscarEl = $("btnBuscar");
const cardTitleEl = $("cardTitle");
const statusMessageEl = $("statusMessage");

// Obtener datos de la API
async function obtenerDatosPokemon(nombre) {
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Pokémon no encontrado");
  return resp.json();
}

// Mostrar datos en la tarjeta
function mostrarPokemonEnTarjeta(datos) {
  cardTitleEl.textContent = "¡Pokémon Encontrado!";
  resultNameEl.textContent = datos.name.toUpperCase();
  resultImgEl.src =
    datos.sprites.other?.dream_world?.front_default ||
    datos.sprites.other?.["official-artwork"]?.front_default ||
    datos.sprites.front_default;
  resultImgEl.alt = datos.name;
}

// Actualizar estado UI
function actualizarEstadoUI(cargando = false) {
  btnBuscarEl.disabled = cargando;
  inputPokemonEl.disabled = cargando;
  if (cargando) {
    cardTitleEl.textContent = "Buscando...";
    resultNameEl.textContent = "";
    resultImgEl.removeAttribute("src");
    statusMessageEl.textContent = "Cargando...";
  } else {
    statusMessageEl.textContent = "";
  }
}

// Buscar Pokémon
async function buscarPokemon() {
  const valor = inputPokemonEl.value.trim();
  if (!valor) {
    statusMessageEl.textContent = "Debe escribir un nombre para buscar.";
    return;
  }
  try {
    actualizarEstadoUI(true);
    const datos = await obtenerDatosPokemon(valor);
    mostrarPokemonEnTarjeta(datos);
  } catch (error) {
    cardTitleEl.textContent = "No encontrado";
    resultNameEl.textContent = "—";
    resultImgEl.removeAttribute("src");
    statusMessageEl.textContent = "Pokémon no encontrado.";
  } finally {
    actualizarEstadoUI(false);
  }
}

// Eventos
btnBuscarEl.addEventListener("click", buscarPokemon);
inputPokemonEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarPokemon();
});

// Cargar Pikachu por defecto
document.addEventListener("DOMContentLoaded", async () => {
  try {
    actualizarEstadoUI(true);
    const datos = await obtenerDatosPokemon("pikachu");
    mostrarPokemonEnTarjeta(datos);
  } catch (e) {
    console.error(e);
  } finally {
    actualizarEstadoUI(false);
  }
});
