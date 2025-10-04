// --- 1. UTILIDAD PARA SELECCIONAR ELEMENTOS POR ID ---
const $ = (id) => document.getElementById(id);

// --- 2. VARIABLES DE LA INTERFAZ ---
const tarjetaPokemonEl = $('#pokemonCard');
const tituloTarjetaEl = $('#cardTitle');
const nombreResultadoEl = $('#resultName');
const imagenResultadoEl = $('#result_img');
const inputBuscar = $('#inputPokemon');
const botonBuscar = $('#btnBuscar');
const mensajeEstadoEl = $('#statusMessage');

// --- 3. ELEMENTOS EXTRA DE LA TARJETA ---
const idEl = $('#pokemonId');
const pesoEl = $('#pokemonPeso');
const alturaEl = $('#pokemonAltura');
const habilidadesEl = $('#pokemonHabilidades');

// --- 4. VALIDACIÓN DE ENTRADA ---
const validarEntrada = (valor) => {
  const limpio = valor.trim().toLowerCase();
  if (!limpio) return { valido: false, mensaje: "Debe escribir un nombre o ID." };
  if (!/^[a-z0-9]+$/.test(limpio)) return { valido: false, mensaje: "Solo letras o números sin espacios ni símbolos." };
  return { valido: true, entrada: limpio };
};

// --- 5. ACTUALIZAR ESTADO DE LA UI ---
const actualizarEstadoUI = (estado, mensaje = "") => {
  mensajeEstadoEl.textContent = mensaje;
  botonBuscar.disabled = estado === "cargando";

  if (estado === "cargando") {
    tituloTarjetaEl.textContent = "Buscando...";
    nombreResultadoEl.textContent = "Cargando...";
    imagenResultadoEl.src = "";
    tarjetaPokemonEl.classList.add("loading");
    tarjetaPokemonEl.style.display = "block";
  } else {
    tarjetaPokemonEl.classList.remove("loading");
  }
};

// --- 6. OBTENER DATOS DE LA API ---
const obtenerDatosPokemon = async (entrada) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${entrada}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("Pokémon no encontrado. Verifique el nombre o ID.");
  return respuesta.json();
};

// --- 7. MOSTRAR DATOS EN LA TARJETA ---
const mostrarPokemonEnTarjeta = (datos) => {
  tituloTarjetaEl.textContent = `¡${datos.name} encontrado!`;
  nombreResultadoEl.textContent = datos.name;
  imagenResultadoEl.src = datos.sprites?.other?.dream_world?.front_default || datos.sprites?.front_default || "";
  imagenResultadoEl.alt = datos.name;
  tarjetaPokemonEl.style.display = 'block';

  idEl.textContent = `ID: ${datos.id}`;
  pesoEl.textContent = `Peso: ${datos.weight / 10} kg`;
  alturaEl.textContent = `Altura: ${datos.height / 10} m`;

  habilidadesEl.innerHTML = "";
  datos.abilities.forEach(hab => {
    const li = document.createElement("li");
    li.textContent = hab.ability.name;
    habilidadesEl.appendChild(li);
  });
};

// --- 8. CARGAR POKÉMON POR DEFECTO ---
const cargarPokemonPorDefecto = async () => {
  actualizarEstadoUI("cargando", "Cargando Pokémon inicial...");
  try {
    const datos = await obtenerDatosPokemon("pikachu");
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI("exito", "¡Pikachu cargado!");
  } catch (error) {
    tituloTarjetaEl.textContent = "Error al cargar Pokémon inicial";
    mensajeEstadoEl.textContent = error.message;
    actualizarEstadoUI("error", error.message);
  } finally {
    botonBuscar.disabled = false;
  }
};

// --- 9. BÚSQUEDA PRINCIPAL ---
const buscarPokemon = async () => {
  const resultado = validarEntrada(inputBuscar.value);
  if (!resultado.valido) {
    mensajeEstadoEl.textContent = resultado.mensaje;
    return;
  }

  const entrada = resultado.entrada;
  actualizarEstadoUI("cargando", "Buscando Pokémon...");
  tituloTarjetaEl.textContent = "";

  try {
    const datos = await obtenerDatosPokemon(entrada);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI("exito", `¡${datos.name} encontrado!`);
    inputBuscar.value = "";
  } catch (error) {
    console.error("Error:", error);
    mensajeEstadoEl.textContent = "Pokémon No Encontrado";
    actualizarEstadoUI("error", error.message);
  }
};

// --- 10. EVENTOS ---
document.addEventListener("DOMContentLoaded", () => {
  cargarPokemonPorDefecto();
});

botonBuscar.addEventListener("click", buscarPokemon);

inputBuscar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarPokemon();
});
