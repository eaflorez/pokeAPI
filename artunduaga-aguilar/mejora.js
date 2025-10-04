// Utilidad para seleccionar elementos por ID
const $ = (id) => document.getElementById(id);

// ELEMENTOS PRINCIPALES
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");

const inputID = $("inputID");
const botonBuscarID = $("btnBuscarID");

const mensajeEstadoEl = $("statusMessage");

// ELEMENTOS DE INFO EXTRA
const pokemonIdEl = $("pokemon_id");
const pokemonPesoEl = $("pokemon_peso");
const pokemonAlturaEl = $("pokemon_altura");
const pokemonHabilidadesEl = $("pokemon_habilidades");

// FUNCIÓN API GENERAL
const obtenerDatosPokemon = async (criterio) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${criterio.toLowerCase()}`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado.");
    return respuesta.json();
};

// Muestra el Pokémon en la tarjeta
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;
    imagenResultadoEl.src =
        datos.sprites.other.dream_world.front_default ||
        datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;
    tarjetaPokemonEl.style.display = "block";

    // Datos adicionales
    pokemonIdEl.textContent = datos.id;
    pokemonPesoEl.textContent = datos.weight / 10; // la API devuelve en hectogramos
    pokemonAlturaEl.textContent = datos.height / 10; // decímetros a metros

    // Habilidades
    pokemonHabilidadesEl.innerHTML = "";
    datos.abilities.forEach((hab) => {
        const li = document.createElement("li");
        li.textContent = hab.ability.name;
        pokemonHabilidadesEl.appendChild(li);
    });
};

// Estado de carga
const actualizarEstadoUI = (cargando, mensaje = "") => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando;
    botonBuscarID.disabled = cargando;

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        tarjetaPokemonEl.style.display = "block";
    }
};

// Búsqueda por Nombre
const buscarPokemonPorNombre = async () => {
    const nombre = inputBuscar.value.trim();
    if (!nombre) {
        mensajeEstadoEl.textContent = "Debe escribir un nombre para buscar.";
        return;
    }

    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon(nombre);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
        inputBuscar.value = "";
    } catch (error) {
        tituloTarjetaEl.textContent = "No encontrado";
        mensajeEstadoEl.textContent = error.message;
        actualizarEstadoUI(false);
    }
};

// Búsqueda por ID
const buscarPokemonPorID = async () => {
    const id = inputID.value.trim();
    if (!id) {
        mensajeEstadoEl.textContent = "Debe escribir un ID para buscar.";
        return;
    }

    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon(id);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡Pokémon con ID ${id} encontrado!`);
        inputID.value = "";
    } catch (error) {
        tituloTarjetaEl.textContent = "No encontrado";
        mensajeEstadoEl.textContent = error.message;
        actualizarEstadoUI(false);
    }
};

// Carga inicial
const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
    } catch {
        tituloTarjetaEl.textContent = "Error al cargar Pokémon inicial";
    } finally {
        actualizarEstadoUI(false);
    }
};

// EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto();
    botonBuscar.addEventListener("click", buscarPokemonPorNombre);
    botonBuscarID.addEventListener("click", buscarPokemonPorID);

    inputBuscar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarPokemonPorNombre();
    });

    inputID.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarPokemonPorID();
    });
});
