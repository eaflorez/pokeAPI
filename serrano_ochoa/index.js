// Selecciona el elemento donde irá el nombre
const namePokemon = document.getElementById("nombre_pokemon");

// Selecciona el elemento donde se mostrará el Pokémon
const imgPokemon = document.getElementById("img");

const peticionAPI = async () => {
  try {
    // Hace la petición a la API de Pikachu
    const peticionGET = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

    // Convierte la respuesta en JSON
    const datosPokemon = await peticionGET.json();

    // 🔹 Extraemos nombre y sprite (imagen)
    const nombre = datosPokemon.name;
    const imagen = datosPokemon.sprites.other.dream_world.front_default;

    // Mostramos en la card del HTML
    namePokemon.textContent = nombre.toUpperCase();
    imgPokemon.src = imagen;
    imgPokemon.alt = nombre;

    // También mostramos todo el objeto en consola para pruebas
    console.log(datosPokemon);
  } catch (error) {
    console.error("Error al obtener el Pokémon:", error);
  }
};

// Ejecuta la función
peticionAPI();
