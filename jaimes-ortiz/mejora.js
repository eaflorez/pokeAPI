// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id);

// Tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");
const idResultadoEl = $("result_id");
const pesoResultadoEl = $("result_weight");
const alturaResultadoEl = $("result_height");
const habilidadesResultadoEl = $("result_abilities");

// Buscadores
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const inputBuscarId = $("inputPokemonId");
const botonBuscarId = $("btnBuscarId");
const mensajeEstadoEl = $("statusMessage");

// --- 2. FUNCIÓN API ---
const obtenerDatosPokemon = async (query) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) throw new Error("Pokémon no encontrado. Verifique el dato.");
    return respuesta.json();
};

// --- 3. MOSTRAR DATOS ---
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;
    imagenResultadoEl.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;

    // Datos extra
    idResultadoEl.textContent = datos.id;
    pesoResultadoEl.textContent = datos.weight / 10;   // API da en hectogramos → kg
    alturaResultadoEl.textContent = datos.height / 10; // API da en decímetros → m

    // Habilidades
    habilidadesResultadoEl.innerHTML = "";
    datos.abilities.forEach(hab => {
        const li = document.createElement("li");
        li.textContent = hab.ability.name;
        habilidadesResultadoEl.appendChild(li);
    });

    tarjetaPokemonEl.style.display = "block";
};

// --- 4. ESTADO ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando;
    botonBuscarId.disabled = cargando;

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        habilidadesResultadoEl.innerHTML = "";
        tarjetaPokemonEl.style.display = "block";
    }
};

// --- 5. FUNCIONES DE BÚSQUEDA ---
const buscarPorNombre = async () => {
    const nombre = inputBuscar.value.trim().toLowerCase();
    if (!nombre) {
        mensajeEstadoEl.textContent = "Debe escribir un nombre.";
        return;
    }
    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon(nombre);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `${datos.name} encontrado!`);
        inputBuscar.value = "";
    } catch (error) {
        actualizarEstadoUI(false, error.message);
    }
};

const buscarPorId = async () => {
    const id = inputBuscarId.value.trim();
    if (!id) {
        mensajeEstadoEl.textContent = "Debe escribir un ID.";
        return;
    }
    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon(id);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `Pokémon con ID ${id} encontrado!`);
        inputBuscarId.value = "";
    } catch (error) {
        actualizarEstadoUI(false, error.message);
    }
};

// --- 6. CARGA INICIAL ---
const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
    } catch {
        tituloTarjetaEl.textContent = "Error de Carga";
    } finally {
        actualizarEstadoUI(false);
    }
};

// --- 7. EVENTOS ---
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto();
    botonBuscar.addEventListener("click", buscarPorNombre);
    botonBuscarId.addEventListener("click", buscarPorId);
});
