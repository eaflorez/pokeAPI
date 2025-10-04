// Helper
const $ = (id) => document.getElementById(id);

// Elementos
const nombreEl = $("nombre");
const imagenEl = $("imagen");
const idEl = $("idPokemon");
const pesoEl = $("peso");
const alturaEl = $("altura");
const habilidadesEl = $("habilidades");
const tituloEl = $("titulo");

// Función para obtener datos desde la API
async function obtenerDatosPokemon(query) {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
    if (!respuesta.ok) throw new Error("Pokémon no encontrado");
    
    const datos = await respuesta.json();
    mostrarPokemon(datos);
  } catch (error) {
    tituloEl.textContent = "Error";
    nombreEl.textContent = error.message;
    imagenEl.src = "";
    idEl.textContent = "";
    pesoEl.textContent = "";
    alturaEl.textContent = "";
    habilidadesEl.innerHTML = "";
  }
}

// Traducción de habilidades
async function traducirHabilidad(url) {
  try {
    const res = await fetch(url);
    const datos = await res.json();
    const traduccion = datos.names.find(n => n.language.name === "es");
    return traduccion ? traduccion.name : datos.name;
  } catch {
    return "Desconocida";
  }
}

// Mostrar datos
async function mostrarPokemon(datos) {
  tituloEl.textContent = "¡Pokémon Encontrado!";
  nombreEl.textContent = datos.name.toUpperCase();
  imagenEl.src = datos.sprites.other["dream_world"].front_default || datos.sprites.front_default;
  idEl.textContent = datos.id;
  pesoEl.textContent = datos.weight + " kg";
  alturaEl.textContent = datos.height + " dm";

  // Habilidades en español
  habilidadesEl.innerHTML = "";
  for (let hab of datos.abilities) {
    const nombreTraducido = await traducirHabilidad(hab.ability.url);
    const li = document.createElement("li");
    li.textContent = nombreTraducido;
    habilidadesEl.appendChild(li);
  }
}

// Eventos
$("btnBuscarNombre").addEventListener("click", () => {
  const nombre = $("inputNombre").value.trim();
  if (nombre) obtenerDatosPokemon(nombre);
});

$("btnBuscarId").addEventListener("click", () => {
  const id = $("inputId").value.trim();
  if (id) obtenerDatosPokemon(id);
});

// Pokémon por defecto
window.addEventListener("DOMContentLoaded", () => {
  obtenerDatosPokemon("pikachu");
});
