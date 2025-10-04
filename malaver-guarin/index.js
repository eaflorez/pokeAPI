const namePokemon = document.getElementById("nombre_pokemon");

const imgPokemon = document.getElementById("img");

const peticionAPI = async()=>{

    const peticionGET=await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");

    const datosPokemon = await peticionGET.json();

    console.log(datosPokemon.sprites.other.dream_world.front_default);

  

    const imagenPikachu=datosPokemon.sprites.other.dream_world.front_default;
    imgPokemon.src=imagenPikachu;
    const nombrePikachu=datosPokemon.name;
    namePokemon.textContent=nombrePikachu;



}

peticionAPI();