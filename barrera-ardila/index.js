// Seleccionamos los elementos del DOM
const namePokemon = document.getElementById("nombre_pokemon");
const imgPokemon = document.getElementById("img");

// Función asíncrona para consumir la API
async function peticionAPI() {
    try {
        const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
        const datosPokemon = await respuesta.json();

        // Mostramos en consola para pruebas
        console.log(datosPokemon);

        // Actualizamos la UI
        namePokemon.textContent = datosPokemon.name.toUpperCase();
        imgPokemon.src = datosPokemon.sprites.other["dream_world"].front_default;
    } catch (error) {
        console.error("Error al obtener el Pokémon", error);
    }
}

peticionAPI();
