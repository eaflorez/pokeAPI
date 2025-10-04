// 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper corta
// Para commit
// Variables de la tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");

// NUEVOS elementos para info extra
const idResultadoEl = $("result_id");
const pesoResultadoEl = $("result_weight");
const alturaResultadoEl = $("result_height");
const habilidadesResultadoEl = $("result_abilities");

// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const inputBuscarID = $("inputPokemonID");
const botonBuscarID = $("btnBuscarID");
const mensajeEstadoEl = $("statusMessage");

// 2: FUNCIONES DE PROMESA Y API
const obtenerDatosPokemon = async (query) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado. Verifique el nombre o ID.");
    }
    return respuesta.json();
};

/*
* Pinta el nombre, imagen y datos extra en la tarjeta.
*/
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;
    imagenResultadoEl.src =
        datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;
    tarjetaPokemonEl.style.display = "block";

    // Mostrar datos extra
    idResultadoEl.textContent = datos.id;
    pesoResultadoEl.textContent = (datos.weight / 10).toFixed(1); // convertir a kg
    alturaResultadoEl.textContent = (datos.height / 10).toFixed(1); // convertir a m

    // Lista de habilidades
    habilidadesResultadoEl.innerHTML = "";
    datos.abilities.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h.ability.name;
        habilidadesResultadoEl.appendChild(li);
    });
};

//--- 3. UTILIDAD PARA EL ESTADO (Carga y Errores)
const actualizarEstadoUI = (cargando, mensaje = "") => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando;
    botonBuscarID.disabled = cargando;

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        tarjetaPokemonEl.style.display = "block";
    } else {
        // Se mantiene visible
    }
};

//--- 4. CARGA INICIAL (Pikachu)
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
        botonBuscar.disabled = false;
        botonBuscarID.disabled = false;
    }
};

//--- 5. BÚSQUEDA POR NOMBRE ---
const buscarPokemon = async () => {
    const nombre = inputBuscar.value.trim();
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
        tituloTarjetaEl.textContent = "Pokémon No Encontrado";
        nombreResultadoEl.textContent = "No encontrado";
        imagenResultadoEl.src = "https://via.placeholder.com/150x150?text=404";
        actualizarEstadoUI(false, error.message);
    }
};

//--- 6. BÚSQUEDA POR ID ---
const buscarPokemonPorID = async () => {
    const id = inputBuscarID.value.trim();
    if (!id) {
        mensajeEstadoEl.textContent = "Debe escribir un ID.";
        return;
    }

    actualizarEstadoUI(true);
    try {
        const datos = await obtenerDatosPokemon(id);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `Pokémon con ID ${id} encontrado!`);
        inputBuscarID.value = "";
    } catch (error) {
        tituloTarjetaEl.textContent = "Pokémon No Encontrado";
        nombreResultadoEl.textContent = "No encontrado";
        imagenResultadoEl.src = "https://via.placeholder.com/150x150?text=404";
        actualizarEstadoUI(false, error.message);
    }
};

//--- 7. EVENTOS ---
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto();
    botonBuscar.addEventListener("click", buscarPokemon);
    botonBuscarID.addEventListener("click", buscarPokemonPorID);

    inputBuscar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarPokemon();
    });
    inputBuscarID.addEventListener("keypress", (e) => {
        if (e.key === "Enter") buscarPokemonPorID();
    });
});
