// Helper para seleccionar por ID
const $ = (id) => document.getElementById(id);

const nombreResultadoEl = $("nombreResultado");
const imagenResultadoEl = $("imagenResultado");
const inputBuscar = $("inputBuscar");
const botonBuscar = $("botonBuscar");
const resultCard = $("resultCard");

async function obtenerDatosPokemon(nombre) {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado");
    return await respuesta.json();
}

function mostrarPokemonEnTarjeta(datosPokemon) {
    nombreResultadoEl.textContent = datosPokemon.name.toUpperCase();
    imagenResultadoEl.src = datosPokemon.sprites.other["dream_world"].front_default
        || datosPokemon.sprites.front_default;
}

async function buscarPokemon() {
    const nombre = inputBuscar.value.trim();
    if (!nombre) return;

    try {
        nombreResultadoEl.textContent = "Buscando...";
        imagenResultadoEl.src = "";
        const datos = await obtenerDatosPokemon(nombre);
        mostrarPokemonEnTarjeta(datos);
    } catch (error) {
        nombreResultadoEl.textContent = "No encontrado";
        imagenResultadoEl.src = "";
    }
}

// Eventos
botonBuscar.addEventListener("click", buscarPokemon);
inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarPokemon();
});

// Cargar un Pokémon por defecto
buscarPokemon("pikachu");
