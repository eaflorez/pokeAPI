//Selecciona el elemento donde irá el nombre
const namePokemon = document.getElementById('nombre_pokemon');
//Selecciona el elemento donde irá la imagen
const imgPokemon = document.getElementById('img');

const peticionAPI = async () => {

    //Hace la petición a la API de Pikachu
    const peticionGET = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

    //Convierte la respuesta en un objeto JSON
    const datosPokemon = await peticionGET.json();

    //Muestra en consola la URL de la imagen
    console.log(datosPokemon.sprites.other["official-artwork"].front_default);

    const imagenPicachu = datosPokemon.sprites.other["official-artwork"].front_default;
    imgPokemon.src = imagenPicachu;

    const nombrePicachu = datosPokemon.name;
    namePokemon.textContent = nombrePicachu;

}

//Ejecuta la función

peticionAPI();