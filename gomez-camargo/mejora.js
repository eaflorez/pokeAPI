// Selección de elementos
const tituloCard = document.getElementById("tituloCard");
const namePokemon = document.getElementById("nombre_pokemon");
const imgPokemon = document.getElementById("img");

const idPokemon = document.getElementById("idPokemon");
const pesoPokemon = document.getElementById("pesoPokemon");
const alturaPokemon = document.getElementById("alturaPokemon");
const habilidadesPokemon = document.getElementById("habilidadesPokemon");

const inputBuscarNombre = document.getElementById("inputBuscarNombre");
const btnBuscarNombre = document.getElementById("btnBuscarNombre");

const inputBuscarID = document.getElementById("inputBuscarID");
const btnBuscarID = document.getElementById("btnBuscarID");

// Función principal
const obtenerPokemon = async (busqueda) => {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado");

        const datos = await respuesta.json();

        // Actualizar la card
        tituloCard.textContent = "¡Pokémon Encontrado!";
        namePokemon.textContent = datos.name;
        imgPokemon.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;

        // Datos extras
        idPokemon.textContent = datos.id;
        pesoPokemon.textContent = datos.weight / 10 + " kg";  // convertir a kg
        alturaPokemon.textContent = datos.height / 10 + " m"; // convertir a metros

        // Habilidades (lista separada por comas)
        habilidadesPokemon.textContent = datos.abilities
            .map(hab => hab.ability.name)
            .join(", ");

    } catch (error) {
        tituloCard.textContent = "Error";
        namePokemon.textContent = "";
        imgPokemon.src = "";
        idPokemon.textContent = "";
        pesoPokemon.textContent = "";
        alturaPokemon.textContent = "";
        habilidadesPokemon.textContent = "";
        console.error(error);
    }
};

// Al inicio: mostrar Pikachu
obtenerPokemon("pikachu");

// Eventos
btnBuscarNombre.addEventListener("click", () => {
    if (inputBuscarNombre.value.trim()) {
        obtenerPokemon(inputBuscarNombre.value.trim());
    }
});

btnBuscarID.addEventListener("click", () => {
    if (inputBuscarID.value.trim()) {
        obtenerPokemon(inputBuscarID.value.trim());
    }
});
