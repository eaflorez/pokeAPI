// Selección de elementos
const tituloCard = document.getElementById("tituloCard");
const namePokemon = document.getElementById("nombre_pokemon");
const imgPokemon = document.getElementById("img");

// Extras (solo los usa ejercicio_practico.html)
const idPokemon = document.getElementById("idPokemon");
const pesoPokemon = document.getElementById("pesoPokemon");
const alturaPokemon = document.getElementById("alturaPokemon");
const habilidadesPokemon = document.getElementById("habilidadesPokemon");

// Inputs y botones (solo los usa mejora.html y ejercicio_practico.html)
const inputBuscarNombre = document.getElementById("inputBuscarNombre");
const btnBuscarNombre = document.getElementById("btnBuscarNombre");
const inputBuscarID = document.getElementById("inputBuscarID");
const btnBuscarID = document.getElementById("btnBuscarID");

// Función principal
const obtenerPokemon = async (busqueda = "pikachu") => {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado");

        const datos = await respuesta.json();

        // Actualizar datos mínimos (sirve para index.html y mejora.html)
        tituloCard.textContent = "¡Pokémon Encontrado!";
        namePokemon.textContent = datos.name;
        imgPokemon.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;

        // Si existen los campos extras (solo en ejercicio_practico.html)
        if (idPokemon) {
            idPokemon.textContent = datos.id;
            pesoPokemon.textContent = datos.weight / 10 + " kg";
            alturaPokemon.textContent = datos.height / 10 + " m";
            habilidadesPokemon.textContent = datos.abilities
                .map(hab => hab.ability.name)
                .join(", ");
        }

    } catch (error) {
        tituloCard.textContent = "Error";
        namePokemon.textContent = "";
        imgPokemon.src = "";
        if (idPokemon) {
            idPokemon.textContent = "";
            pesoPokemon.textContent = "";
            alturaPokemon.textContent = "";
            habilidadesPokemon.textContent = "";
        }
        console.error(error);
    }
};

// Mostrar Pikachu al inicio
obtenerPokemon("pikachu");

// Eventos (funcionan solo si los elementos existen en el HTML)
if (btnBuscarNombre) {
    btnBuscarNombre.addEventListener("click", () => {
        if (inputBuscarNombre.value.trim()) {
            obtenerPokemon(inputBuscarNombre.value.trim());
        }
    });
}

if (btnBuscarID) {
    btnBuscarID.addEventListener("click", () => {
        if (inputBuscarID.value.trim()) {
            obtenerPokemon(inputBuscarID.value.trim());
        }
    });
}
