const $ = (id) => document.getElementById(id);

const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");
const pokemonIdEl = $("pokemon-id");
const pokemonWeightEl = $("pokemon-weight");
const pokemonHeightEl = $("pokemon-height");
const pokemonAbilitiesEl = $("pokemon-abilities");

const inputBuscarNombre = $("inputPokemonNombre");
const botonBuscarNombre = $("btnBuscarNombre");

const inputBuscarId = $("inputPokemonId");
const botonBuscarId = $("btnBuscarId");

const mensajeEstadoEl = $("statusMessage");
let temporizadorMensaje;

const obtenerDatosPokemon = async (identificador) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${identificador.toString().toLowerCase()}`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado. Verifique el nombre o ID.");
    }
    return respuesta.json();
};

const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;
    imagenResultadoEl.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;

    pokemonIdEl.textContent = datos.id;
    pokemonWeightEl.textContent = datos.weight / 10; 
    pokemonHeightEl.textContent = datos.height / 10; 

    pokemonAbilitiesEl.innerHTML = '';
    datos.abilities.forEach(habilidad => {
        const li = document.createElement('li');
        li.textContent = habilidad.ability.name;
        pokemonAbilitiesEl.appendChild(li);
    });

    tarjetaPokemonEl.style.display = 'block';
};

const actualizarEstadoUI = (cargando, mensaje = "") => {
    clearTimeout(temporizadorMensaje);

    mensajeEstadoEl.textContent = mensaje;
    mensajeEstadoEl.style.visibility = mensaje ? 'visible' : 'hidden';

    if (mensaje) {
        temporizadorMensaje = setTimeout(() => {
            mensajeEstadoEl.style.visibility = 'hidden';
        }, 5000);
    }

    botonBuscarNombre.disabled = cargando;
    botonBuscarId.disabled = cargando;

    if (cargando) {
        tarjetaPokemonEl.style.display = 'block';
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "";
        imagenResultadoEl.src = "https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif";
    }
};

const manejarErrorBusqueda = (error) => {
    tarjetaPokemonEl.style.display = 'none';
    actualizarEstadoUI(false, error.message);
};

const buscarPorNombre = async () => {
    const nombre = inputBuscarNombre.value.trim();
    if (!nombre) {
        actualizarEstadoUI(false, "Debe escribir un nombre para buscar.");
        return;
    }
    if (/^\d+$/.test(nombre)) {
        actualizarEstadoUI(false, "La búsqueda por nombre no puede ser un número.");
        return;
    }   

    actualizarEstadoUI(true, "");
    inputBuscarId.value = "";

    try {
        const datos = await obtenerDatosPokemon(nombre);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
    } catch (error) {
        manejarErrorBusqueda(error);
    }
};

const buscarPorId = async () => {
    const id = inputBuscarId.value.trim();
    if (!id) {
        actualizarEstadoUI(false, "Debe escribir un ID para buscar.");
        return;
    }
    if (!/^\d+$/.test(id)) {
        actualizarEstadoUI(false, "El ID debe ser un valor numérico.");
        return;
    }

    actualizarEstadoUI(true, "");
    inputBuscarNombre.value = "";

    try {
        const datos = await obtenerDatosPokemon(id);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
    } catch (error) {
        manejarErrorBusqueda(error);
    }
};


const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true, "Cargando Pokémon inicial...");
    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
        actualizarEstadoUI(false);
    } catch (error) {
        manejarErrorBusqueda(error);
    }
};

document.addEventListener("DOMContentLoaded", cargarPokemonPorDefecto);

botonBuscarNombre.addEventListener("click", buscarPorNombre);
inputBuscarNombre.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        buscarPorNombre();
    }
});

botonBuscarId.addEventListener("click", buscarPorId);
inputBuscarId.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        buscarPorId();
    }
});