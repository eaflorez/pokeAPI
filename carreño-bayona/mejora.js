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
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${criterio.toString().toLowerCase()}`;
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado.");
        return await respuesta.json();
    } catch (error) {
        throw error;
    }
};

// Muestra el Pokémon en la tarjeta
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;
    imagenResultadoEl.src =
        datos.sprites.other.dream_world.front_default ||
        datos.sprites.front_default ||
        "";
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;
    tarjetaPokemonEl.style.display = "block";

    pokemonIdEl.textContent = `ID: ${datos.id}`;
    pokemonPesoEl.textContent = `Peso: ${datos.weight / 10} kg`;
    pokemonAlturaEl.textContent = `Altura: ${datos.height / 10} m`;

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

// Función común para búsqueda
const buscarPokemon = async (criterio, tipo) => {
    if (!criterio.trim()) {
        mensajeEstadoEl.textContent = `Debe escribir un ${tipo} para buscar.`;
        return;
    }

    actualizarEstadoUI(true);

    try {
        const datos = await obtenerDatosPokemon(criterio);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${tipo === "nombre" ? datos.name : "Pokémon con ID " + datos.id} encontrado!`);
        if (tipo === "nombre") inputBuscar.value = "";
        if (tipo === "ID") inputID.value = "";
    } catch (error) {
        mostrarError(error.message);
    }
};

// Manejo de errores
const mostrarError = (mensaje) => {
    tituloTarjetaEl.textContent = "No encontrado";
    nombreResultadoEl.textContent = "";
    imagenResultadoEl.src = "https://placehold.co/150x150/d63031/ffffff?text=404";
    pokemonIdEl.textContent = "";
    pokemonPesoEl.textContent = "";
    pokemonAlturaEl.textContent = "";
    pokemonHabilidadesEl.innerHTML = "";
    actualizarEstadoUI(false, mensaje);
};

// Carga inicial
const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
    } catch {
        mostrarError("Error al cargar Pokémon inicial");
    } finally {
        actualizarEstadoUI(false);
    }
};

// EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto();

    botonBuscar.addEventListener("click", () => buscarPokemon(inputBuscar.value, "nombre"));
    botonBuscarID.addEventListener("click", () => buscarPokemon(inputID.value, "ID"));

    inputBuscar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarPokemon(inputBuscar.value, "nombre");
    });

    inputID.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarPokemon(inputID.value, "ID");
    });
});
