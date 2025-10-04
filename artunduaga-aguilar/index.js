// Selecciona el elemento donde irá el nombre
const namePokemon = document.getElementById("nombre_pokemon");

// Selecciona la imagen donde se mostrará el Pokémon
const imgPokemon = document.getElementById("img");

const peticionAPI = async () => {
  // Función para pedir datos a la API

  // Hace la petición a la API de Pikachu
  const peticionGET = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

  // Convierte la respuesta en JSON
  const datosPokemon = await peticionGET.json();

  // Muestra en consola la URL de la imagen
  console.log(datosPokemon.sprites.other.dream_world.front_default);

  const imagenPicachu = datosPokemon.sprites.other.dream_world.front_default;
  imgPokemon.src = imagenPicachu;

  const nombrePicachu = datosPokemon.name;
  namePokemon.textContent = nombrePicachu;
};

// Ejecuta la función
peticionAPI();

// SELECCIÓN DE ELEMENTOS

const $ = (id) => document.getElementById(id);

const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const mensajeEstadoEl = $("statusMessage");

// FUNCIONES DE PROMESA Y API

const obtenerDatosPokemon = async (nombre) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("Pokémon no encontrado. Verifique el nombre.");
  }
  return respuesta.json();
};

const mostrarPokemonEnTarjeta = (datos) => {
  tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
  nombreResultadoEl.textContent = datos.name;
  imagenResultadoEl.src =
    datos.sprites.other.dream_world.front_default ||
    datos.sprites.front_default;
  imagenResultadoEl.alt = `Imagen de ${datos.name}`;
  tarjetaPokemonEl.style.display = "block";
};

// ESTADO DE CARGA

const actualizarEstadoUI = (cargando, mensaje = "") => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando;

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        nombreResultadoEl.classList.add('loading');
        tarjetaPokemonEl.style.display = 'block';
    } else {
        nombreResultadoEl.classList.remove('loading');
    }
}

// CARGA INCICIAL (Pikachu)

const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true);

    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
    } catch (error) {
        tituloTarjetaEl.textContent = "Error de Carga";
        nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";
    } finally {
        nombreResultadoEl.classList.remove('loading');
        botonBuscar.disabled = false;
    }
}

// LÓGICA DE BÚSQUEDA POR NOMBRE

const buscarPokemon = async () => {
    const nombre = inputBuscar.value.trim();

    if (!nombre) {
        mensajeEstadoEl.textContent = "Debe escribir un nombre para buscar.";
        return;
    }

    // VALIDACIÓN: Bloquea si es un número
    if (/^\d+$/.test(nombre)) {
        mensajeEstadoEl.textContent = "Búsqueda por ID no permitida. Use el nombre del Pokémon";
        return;
    }

    actualizarEstadoUI(true);
    tituloTarjetaEl.textContent = "Buscando Pokémon...";

    try {
        const datos = await obtenerDatosPokemon(nombre);

        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, ` ¡${datos.name} encontrado!`);
        inputBuscar.value = "";
    } catch (error) {
        tituloTarjetaEl.textContent = "Pokémon No Encontrado";
        nombreResultadoEl.textContent = "No encontrado";
        imagenResultadoEl.src = "https://pokeapi.co/media/error.png"
        actualizarEstadoUI(false, error.message);
    }
}

// EVEN LISTENERS

document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto();

    botonBuscar.addEventListener("click", buscarPokemon);

    inputBuscar.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            buscarPokemon();
        }
    })
})



