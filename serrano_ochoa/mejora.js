// Buscar Pokémon por nombre
const inputNombre = document.getElementById("nombrePokemon");
const btnBuscar = document.getElementById("buscarPokemon");
const nombreResultado = document.getElementById("nombreResultado");
const imgResultado = document.getElementById("imgResultado");

async function obtenerPokemon(valor) {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado");
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    throw error;
  }
}

btnBuscar?.addEventListener("click", async () => {
  const nombre = inputNombre.value.trim().toLowerCase();
  if (!nombre) return;

  try {
    const datos = await obtenerPokemon(nombre);
    nombreResultado.textContent = datos.name.toUpperCase();
    imgResultado.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imgResultado.alt = datos.name;
  } catch (err) {
    nombreResultado.textContent = err.message;
    imgResultado.src = "";
  }
});
// Funciones para mostrar resultados detallados
function mostrarEnTarjeta(datos) {
  document.getElementById("resNombre").textContent = datos.name.toUpperCase();
  document.getElementById("resImg").src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
  document.getElementById("resImg").alt = datos.name;
  document.getElementById("resID").textContent = datos.id;
  document.getElementById("resPeso").textContent = datos.weight;
  document.getElementById("resAltura").textContent = datos.height;
  document.getElementById("resHabilidades").textContent = datos.abilities.map(a => a.ability.name).join(", ");
}

function limpiarTarjeta(mensaje = "") {
  document.getElementById("resNombre").textContent = mensaje;
  document.getElementById("resImg").src = "";
  document.getElementById("resID").textContent = "";
  document.getElementById("resPeso").textContent = "";
  document.getElementById("resAltura").textContent = "";
  document.getElementById("resHabilidades").textContent = "";
}

// Event listeners para búsqueda por nombre e ID
document.getElementById("btnNombre")?.addEventListener("click", async () => {
  const nombre = document.getElementById("buscarNombre").value.trim().toLowerCase();
  if (!nombre) return;
  try {
    const datos = await obtenerPokemon(nombre);
    mostrarEnTarjeta(datos);
  } catch (err) {
    limpiarTarjeta(err.message);
  }
});

document.getElementById("btnID")?.addEventListener("click", async () => {
  const id = document.getElementById("buscarID").value.trim();
  if (!id) return;
  try {
    const datos = await obtenerPokemon(id);
    mostrarEnTarjeta(datos);
  } catch (err) {
    limpiarTarjeta(err.message);
  }
});
