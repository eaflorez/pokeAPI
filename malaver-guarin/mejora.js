const $ = (id) => document.getElementById(id);

const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $('result_name');  
const imagenResultadoEl = $('result_img');
const inputBuscar = $('inputPokemon');
const botonBuscar = $('btnBuscar');
const mensajeEstadoEl = $('statusMessage'); 

const obtenerDatosPokemon = async (nombre) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado. Verificar el nombre.");
  }
  return respuesta.json();
};

const mostrarPokemonEnTarjeta = (datos) => {
  tituloTarjetaEl.textContent = '¡Pokémon Encontrado!';
  nombreResultadoEl.textContent = datos.name;
  imagenResultadoEl.src = datos.sprites.other.dream_world.front_default || datos.sprites.other['official-artwork'].front_default || datos.sprites.front_default;
  imagenResultadoEl.alt = `imagen de ${datos.name} '`;
  tarjetaPokemonEl.style.display = 'block';
  
};

const actualizarEstadoUI=(cargando, mensaje = "") =>{
  mensajeEstadoEl.textContent = mensaje;
  botonBuscar.disabled = cargando;

  if (cargando) {
    tituloTarjetaEl.textContent = "buscando....";
    nombreResultadoEl.textContent = "cargando...";
    imagenResultadoEl.src = "";
    nombreResultadoEl.classList.add('loading');
    tarjetaPokemonEl.style.display = "block";
  } else {
    nombreResultadoEl.classList.remove('loading');
  }
};

const cargarPokemonPorDefecto=async()=> {
  actualizarEstadoUI(true);

  try {
    const datos = await obtenerDatosPokemon('pikachu');
    mostrarPokemonEnTarjeta(datos);
    tituloTarjetaEl.textContent = "Pokemon inicial";
  } catch (error) {
    tituloTarjetaEl.textContent = "Error carga";
    nombreResultadoEl.textContent = "No se pudo cargar el pokemon";
  } finally {
    nombreResultadoEl.classList.remove('loading');
    botonBuscar.disabled = false;
  }
};

const buscarPokemon = async () => {
  const nombre = inputBuscar.value.trim();
  if (!nombre) {
    mensajeEstadoEl.textContent = 'Ingresa un nombre válido';
    return;
  }
  if (/^\d+$/.test(nombre)) {
    mensajeEstadoEl.textContent = 'Use la búsqueda por ID en la versión práctica';
    return;
  }
  actualizarEstadoUI(true);
  tituloTarjetaEl.textContent="busqued por id no permitida";

  try {
    const datos = await obtenerDatosPokemon(nombre);
    mostrarPokemonEnTarjeta(datos);
    actualizarEstadoUI(false);
    inputBuscar.value = "";
  } catch (error) {
    tituloTarjetaEl.textContent = 'Pokémon no encontrado';
    nombreResultadoEl.textContent = 'No encontrado';
    imagenResultadoEl.src = '';
    actualizarEstadoUI(false, error.message);
  }
};



document.addEventListener('DOMContentLoaded', () => {
  cargarPokemonPorDefecto();
  botonBuscar.addEventListener("click", buscarPokemon);
  inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
      buscarPokemon();
    }
  });
});
