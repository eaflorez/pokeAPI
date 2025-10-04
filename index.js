// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id);

// Tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

// Info adicional
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

// --- 2. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (query) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado. Verifique el nombre o ID.");
    }

    return respuesta.json();
};

// --- 3. MOSTRAR DATOS EN LA TARJETA ---
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;
    imagenResultadoEl.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;
    tarjetaPokemonEl.style.display = "block";

    // Nuevos datos
    idResultadoEl.textContent = datos.id;
    pesoResultadoEl.textContent = `${datos.weight / 10} kg`;
    alturaResultadoEl.textContent = `${datos.height / 10} m`;

    // Habilidades
    habilidadesResultadoEl.innerHTML = "";
    datos.abilities.forEach(hab => {
        const li = document.createElement("li");
        li.textContent = hab.ability.name;
        habilidadesResultadoEl.appendChild(li);
    });
};

// --- 4. ESTADO DE LA UI ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando;
    botonBuscarId.disabled = cargando;

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        idResultadoEl.textContent = "";
        pesoResultadoEl.textContent = "";
        alturaResultadoEl.textContent = "";
        habilidadesResultadoEl.innerHTML = "";
        tarjetaPokemonEl.style.display = "block";
    }
};

// --- 5. CARGA INICIAL ---
const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true);

    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)";
    } catch {
        tituloTarjetaEl.textContent = "Error de Carga";
        nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";
    } finally {
        actualizarEstadoUI(false);
    }
};

// --- 6. BÚSQUEDA POR NOMBRE ---
const buscarPokemon = async () => {
    const nombre = inputBuscar.value.trim();
    if (!nombre) {
        mensajeEstadoEl.textContent = "Debe escribir un nombre.";
        return;
    }

    actualizarEstadoUI(true, "Buscando Pokémon...");

    try {
        const datos = await obtenerDatosPokemon(nombre);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
        inputBuscar.value = "";
    } catch (error) {
        tituloTarjetaEl.textContent = "Pokémon No Encontrado";
        mensajeEstadoEl.textContent = error.message;
        actualizarEstadoUI(false);
    }
};

// --- 7. BÚSQUEDA POR ID ---
const buscarPokemonPorId = async () => {
    const id = inputBuscarId.value.trim();
    if (!id) {
        mensajeEstadoEl.textContent = "Debe escribir un ID.";
        return;
    }

    actualizarEstadoUI(true, "Buscando Pokémon por ID...");

    try {
        const datos = await obtenerDatosPokemon(id);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
        inputBuscarId.value = "";
    } catch (error) {
        tituloTarjetaEl.textContent = "Pokémon No Encontrado";
        mensajeEstadoEl.textContent = error.message;
        actualizarEstadoUI(false);
    }
};

// --- 8. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto();

    botonBuscar.addEventListener("click", buscarPokemon);
    botonBuscarId.addEventListener("click", buscarPokemonPorId);

    inputBuscar.addEventListener("keypress", (e) => e.key === 'Enter' && buscarPokemon());
    inputBuscarId.addEventListener("keypress", (e) => e.key === 'Enter' && buscarPokemonPorId());
});
