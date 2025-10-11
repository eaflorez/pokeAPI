// --- 1. SELECCIÓN DE ELEMENTOS ---
const $ = (id) => document.getElementById(id); // Función helper corta

// Variables de la única tarjeta
const tarjetaPokemonEl = $("pokemonCard");
const tituloTarjetaEl = $("cardTitle");
const nombreResultadoEl = $("result_name");
const imagenResultadoEl = $("result_img");
// Variables del buscador
const inputBuscar = $("inputPokemon");
const botonBuscar = $("btnBuscar");
const inputBuscarId = $("inputPokemonId");
const botonBuscarId = $("btnBuscarId");
const mensajeEstadoEl = $("statusMessage");

// Variables de detalles del Pokémon
const detallesPokemonEl = $("pokemonDetails");
const resultadoIdEl = $("result_id");
const resultadoPesoEl = $("result_weight");
const resultadoAlturaEl = $("result_height");
const resultadoHabilidadesEl = $("result_abilities");

// --- 2. FUNCIONES DE FORMATEO DE DATOS ---
const formatearPeso = (peso) => {
    return `${(peso / 10).toFixed(1)} kg`; // PokeAPI returns weight in hectograms
};

const formatearAltura = (altura) => {
    return `${(altura / 10).toFixed(1)} m`; // PokeAPI returns height in decimeters
};

const formatearHabilidades = (habilidades) => {
    return habilidades.map(habilidad => ({
        nombre: habilidad.ability.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        esOculta: habilidad.is_hidden
    }));
};

// --- 3. FUNCIONES DE PROMESA Y API ---
const obtenerDatosPokemon = async (nombre) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("Pokémon no encontrado. Verifique el nombre."); // Tira error si no encuentra
    }

    return respuesta.json(); // Devuelve el JSON
};

/**
 * Pinta el nombre, imagen y detalles completos en la única tarjeta.
 */
const mostrarPokemonEnTarjeta = (datos) => {
    tituloTarjetaEl.textContent = "¡Pokémon Encontrado!"; // Título genérico al encontrar
    // Formatear el nombre con la primera letra en mayúscula
    nombreResultadoEl.textContent = datos.name.charAt(0).toUpperCase() + datos.name.slice(1);
    imagenResultadoEl.src = datos.sprites.other.dream_world.front_default || datos.sprites.front_default;
    imagenResultadoEl.alt = `Imagen de ${datos.name}`;

    // Mostrar detalles adicionales
    resultadoIdEl.textContent = datos.id;
    resultadoPesoEl.textContent = formatearPeso(datos.weight);
    resultadoAlturaEl.textContent = formatearAltura(datos.height);

    // Mostrar habilidades
    const habilidadesFormateadas = formatearHabilidades(datos.abilities);
    resultadoHabilidadesEl.innerHTML = '';
    habilidadesFormateadas.forEach(habilidad => {
        const li = document.createElement('li');
        li.textContent = habilidad.nombre;
        if (habilidad.esOculta) {
            li.classList.add('hidden-ability');
            li.title = 'Habilidad oculta';
        }
        resultadoHabilidadesEl.appendChild(li);
    });

    tarjetaPokemonEl.style.display = 'block';
};

// --- 4. UTILIDAD PARA EL ESTADO (Carga y Errores) ---
const actualizarEstadoUI = (cargando, mensaje = "") => {
    mensajeEstadoEl.textContent = mensaje;
    botonBuscar.disabled = cargando; // Deshabilita ambos botones
    botonBuscarId.disabled = cargando;

    if (cargando) {
        tituloTarjetaEl.textContent = "Buscando...";
        nombreResultadoEl.textContent = "Cargando...";
        imagenResultadoEl.src = "";
        // Limpiar detalles durante la carga
        resultadoIdEl.textContent = "";
        resultadoPesoEl.textContent = "";
        resultadoAlturaEl.textContent = "";
        resultadoHabilidadesEl.innerHTML = "";
        nombreResultadoEl.classList.add('loading'); // Aplica animación
        tarjetaPokemonEl.style.display = 'block';
    } else {
        nombreResultadoEl.classList.remove('loading'); // Quita animación
        // La tarjeta se mantiene visible.
    }
};

// --- 4. CARGA INICIAL (Pikachu) ---
const cargarPokemonPorDefecto = async () => {
    actualizarEstadoUI(true);

    try {
        const datos = await obtenerDatosPokemon("pikachu");
        mostrarPokemonEnTarjeta(datos);
        tituloTarjetaEl.textContent = "Pokémon Inicial (Pikachu)"; // Sobrescribe el título genérico
    } catch (error) {
        tituloTarjetaEl.textContent = "Error de Carga";
        nombreResultadoEl.textContent = "No se pudo cargar el Pokémon inicial.";
    } finally {
        nombreResultadoEl.classList.remove('loading');
        botonBuscar.disabled = false;
        botonBuscarId.disabled = false;
    }
};
// --- 5. FUNCIONES DE VALIDACIÓN ---
const validarIdPokemon = (id) => {
    const numero = parseInt(id);
    return !isNaN(numero) && numero >= 1 && numero <= 1010;
};

// --- 6. LÓGICA DE BÚSQUEDA POR ID ---
const buscarPokemonPorId = async () => {
    const id = inputBuscarId.value.trim();
    if (!validarBusquedaSimultanea()) return;
    if (!id) {
        mostrarMensajeError('id', "Debe escribir un ID para buscar.");
        return;
    }
    if (!validarIdPokemon(id)) {
        mostrarMensajeError('id', "ID no válido. Use un número entre 1 y 1010.");
        return;
    }
    // Limpiar campo de nombre
    inputBuscar.value = "";
    actualizarEstadoUI(true);
    tituloTarjetaEl.textContent = "Buscando Pokémon...";
    try {
        const datos = await obtenerDatosPokemon(id);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
        inputBuscarId.value = "";
        mensajeEstadoEl.textContent = "";
    } catch (error) {
        mostrarMensajeError('id', error.message);
    }
};

// --- 7. LÓGICA PRINCIPAL DE BÚSQUEDA (Solo por Nombre) ---
const buscarPokemon = async () => {
    const nombre = inputBuscar.value.trim();
    if (!validarBusquedaSimultanea()) return;
    if (!nombre) {
        mostrarMensajeError('name', "Debe escribir un nombre para buscar.");
        return;
    }
    // Limpiar campo de ID
    inputBuscarId.value = "";
    actualizarEstadoUI(true);
    tituloTarjetaEl.textContent = "Buscando Pokémon...";
    try {
        const datos = await obtenerDatosPokemon(nombre);
        mostrarPokemonEnTarjeta(datos);
        actualizarEstadoUI(false, `¡${datos.name} encontrado!`);
        inputBuscar.value = "";
        mensajeEstadoEl.textContent = "";
    } catch (error) {
        mostrarMensajeError('name', error.message);
    }
};

// --- 8. MANEJO DE ERRORES Y UTILIDADES ---
const manejarErrorBusqueda = (tipoBusqueda) => {
    const mensajesError = {
        'name': 'Pokémon no encontrado. Verifique el nombre.',
        'id': 'ID de Pokémon no válido. Use un número entre 1 y 1010.'
    };
    return mensajesError[tipoBusqueda] || 'Error desconocido en la búsqueda.';
};

const mostrarMensajeError = (tipo, mensajePersonalizado = null) => {
    tituloTarjetaEl.textContent = tipo === 'id' ? 'Pokémon No Encontrado' : 'Pokémon No Encontrado';
    nombreResultadoEl.textContent = 'No encontrado';
    imagenResultadoEl.src = 'https://via.placeholder.com/200x200/cccccc/666666?text=404';
    actualizarEstadoUI(false, mensajePersonalizado || manejarErrorBusqueda(tipo));
};

const validarBusquedaSimultanea = () => {
    const tieneNombre = inputBuscar.value.trim() !== '';
    const tieneId = inputBuscarId.value.trim() !== '';
    if (tieneNombre && tieneId) {
        mensajeEstadoEl.textContent = "Use solo un método de búsqueda a la vez.";
        return false;
    }
    return true;
};

// --- 9. EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
    cargarPokemonPorDefecto(); // Carga Pikachu al iniciar
});

botonBuscar.addEventListener("click", buscarPokemon); // Click en el botón
botonBuscarId.addEventListener("click", buscarPokemonPorId); // Click en el botón de ID

inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        buscarPokemon(); // Enter en el input
    }
});

inputBuscarId.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        buscarPokemonPorId(); // Enter en el input de ID
    }
});