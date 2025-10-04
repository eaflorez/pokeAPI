// Selecciona el elemento donde irá el nombre
const namePokemon = document.getElementById("nombre_pokemon");

// Selecciona la imagen donde se mostrará el Pokémon
const imgPokemon = document.getElementById("img");

const peticionAPI = async () => { // Función para pedir datos a la API

    // Hace la petición a la API de Pikachu
    const peticionGET = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

    // Convierte la respuesta en JSON
    const datosPokemon = await peticionGET.json();

    // Muestra en consola la URL de la imagen
console.log(datosPokemon.sprites.other.dream_world.front_default);

const imagenPikachu = datosPokemon.sprites.other.dream_world.front_default;  // Guarda la imagen de Pikachu
imgPokemon.src = imagenPikachu;  // Pone la imagen en el <img>

const nombrePikachu = datosPokemon.name;  // Guarda el nombre del Pokémon
namePokemon.textContent = nombrePikachu;  // Pone el nombre en el HTML

}


// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id);

// Variables de la tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");
const idResultadoEl = $("result_id");
const pesoResultadoEl = $("result_weight");
const alturaResultadoEl = $("result_height");
const habilidadesResultadoEl = $("result_abilities");

// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const inputBuscarId = $("inputPokemonId");
const botonBuscarId = $("btnBuscarId");
const mensajeEstadoEl = $("statusMessage");


// --- 2. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (parametro) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${parametro}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado. Verifique el nombre o ID.");
    }
    return respuesta.json();
};


// --- 3. FUNCIÓN PARA MOSTRAR EN LA TARJETA ---
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!";
    nombreResultadoEl.textContent = datos.name;

    // Imagen
    imagenResultadoEl.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;

    // Datos extra
    idResultadoEl.textContent = datos.id;
    pesoResultadoEl.textContent = `${datos.weight / 10} kg`;   // hectogramos -> kg
    alturaResultadoEl.textContent = `${datos.height / 10} m`; // decímetros -> metros

    // Lista de habilidades
    habilidadesResultadoEl.innerHTML = "";
    datos.abilities.forEach(hab => {
        const li = document.createElement("li");
        li.textContent = hab.ability.name;
        habilidadesResultadoEl.appendChild(li);
    });

    tarjetaPokemonEl.style.display = "block";
};


// --- 4. EVENTOS ---
botonBuscar.addEventListener("click", async () => {
    try {
        mensajeEstadoEl.textContent = "Buscando...";
        const datos = await obtenerDatosPokemon(inputBuscar.value);
        mostrarPokemonEnTarjeta(datos);
        mensajeEstadoEl.textContent = "";
    } catch (error) {
        mensajeEstadoEl.textContent = error.message;
    }
});

botonBuscarId.addEventListener("click", async () => {
    try {
        mensajeEstadoEl.textContent = "Buscando...";
        const datos = await obtenerDatosPokemon(inputBuscarId.value);
        mostrarPokemonEnTarjeta(datos);
        mensajeEstadoEl.textContent = "";
    } catch (error) {
        mensajeEstadoEl.textContent = error.message;
    }
});
