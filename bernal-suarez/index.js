// Selecciona el elemento donde irá el nombre
const namePokemon = document.getElementById('nombre_pokemon');

// Selecciona la imagen donde irá el pokemón
const imgPokemon = document.getElementById('img');

const peticionAPI = async () => { 
    try {
        // Hace la petición a la API de Pikachu
        const peticionGet = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');

        // Convierte la respuesta en JSON
        const datosPokemon = await peticionGet.json();

        // Extrae datos
        const nombre = datosPokemon.name;
        const imagen = datosPokemon.sprites.other['official-artwork'].front_default;

        // Muestra en la página
        namePokemon.textContent = nombre.toUpperCase();
        imgPokemon.src = imagen;

    } catch (error) {
        console.error('Error:', error);
        namePokemon.textContent = "Error al cargar";
    }
}

// Ejecuta la función
peticionAPI();
