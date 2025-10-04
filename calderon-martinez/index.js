// helper
const $ = id => document.getElementById(id);

// elementos
const searchNameEl = $('searchName');
const btnSearchName = $('btnSearchName');
const searchIdEl = $('searchId');
const btnSearchId = $('btnSearchId');
const statusEl = $('status');
const imgEl = $('pokemonImg');
const nameEl = $('pokemonName');
const idEl = $('pokemonId');
const heightEl = $('pokemonHeight');
const weightEl = $('pokemonWeight');
const abilitiesEl = $('pokemonAbilities');

// obtiene datos de la PokeAPI por nombre o id
async function obtenerDatosPokemon(query){
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error('Pokémon no encontrado');
  const datos = await respuesta.json();
  return datos;
}

function actualizarEstadoUI(cargando){
  btnSearchName.disabled = cargando;
  btnSearchId.disabled = cargando;
  searchNameEl.disabled = cargando;
  searchIdEl.disabled = cargando;
  statusEl.textContent = cargando ? 'Buscando...' : '';
}

// elegir mejor imagen disponible
function seleccionarImagen(data){
  return data.sprites?.other?.dream_world?.front_default
    || data.sprites?.other?.['official-artwork']?.front_default
    || data.sprites?.front_default
    || '';
}

// muestra en la tarjeta: ID, peso, altura, habilidades
function mostrarPokemonEnTarjeta(data){
  const nombre = data.name ? (data.name.charAt(0).toUpperCase() + data.name.slice(1)) : '—';
  nameEl.textContent = nombre;

  const imagen = seleccionarImagen(data);
  if(imagen){
    imgEl.src = imagen;
    imgEl.alt = nombre;
  } else {
    imgEl.src = '';
    imgEl.alt = 'Sin imagen';
  }

  idEl.innerHTML = `<strong>ID:</strong> ${data.id}`;

  // PokeAPI: height en decímetros, weight en hectogramos
  const altura_m = (data.height / 10).toFixed(2);
  heightEl.innerHTML = `<strong>Altura:</strong> ${data.height} dm (${altura_m} m)`;

  const peso_kg = (data.weight / 10).toFixed(2);
  weightEl.innerHTML = `<strong>Peso:</strong> ${data.weight} hg (${peso_kg} kg)`;

  // habilidades
  abilitiesEl.innerHTML = '';
  data.abilities.forEach(item => {
    const li = document.createElement('li');
    const nombreHab = item.ability?.name || 'desconocida';
    li.textContent = `${nombreHab}${item.is_hidden ? ' (oculta)' : ''}`;
    abilitiesEl.appendChild(li);
  });

  statusEl.textContent = '';
}

// buscar por nombre
async function buscarPorNombre(){
  const q = searchNameEl.value.trim().toLowerCase();
  if(!q){ statusEl.textContent = 'Escribe un nombre.'; return; }
  if(!isNaN(q)){ statusEl.textContent = 'Ingresa un nombre, no un número.'; return; }
  try{
    actualizarEstadoUI(true);
    const datos = await obtenerDatosPokemon(q);
    mostrarPokemonEnTarjeta(datos);
  } catch(err){
    statusEl.textContent = 'Pokémon no encontrado.';
    console.error(err);
  } finally { actualizarEstadoUI(false); }
}

// buscar por ID
async function buscarPorId(){
  const q = searchIdEl.value.trim();
  if(!q){ statusEl.textContent = 'Escribe un ID.'; return; }
  if(isNaN(q) || Number(q) <= 0){ statusEl.textContent = 'ID inválido.'; return; }
  try{
    actualizarEstadoUI(true);
    const datos = await obtenerDatosPokemon(q);
    mostrarPokemonEnTarjeta(datos);
  } catch(err){
    statusEl.textContent = 'Pokémon no encontrado.';
    console.error(err);
  } finally { actualizarEstadoUI(false); }
}

// listeners
document.addEventListener('DOMContentLoaded', () => {
  btnSearchName.addEventListener('click', buscarPorNombre);
  searchNameEl.addEventListener('keydown', e => { if(e.key === 'Enter') buscarPorNombre(); });

  btnSearchId.addEventListener('click', buscarPorId);
  searchIdEl.addEventListener('keydown', e => { if(e.key === 'Enter') buscarPorId(); });

  // carga por defecto (pikachu)
  (async () => {
    actualizarEstadoUI(true);
    try {
      const datos = await obtenerDatosPokemon('pikachu');
      mostrarPokemonEnTarjeta(datos);
    } catch(err) {
      statusEl.textContent = 'No se pudo cargar Pikachu por defecto.';
      console.error(err);
    } finally {
      actualizarEstadoUI(false);
    }
  })();
});
