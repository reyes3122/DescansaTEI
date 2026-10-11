// ---------- Navegación ----------
const botones = document.querySelectorAll(".nav-item");
const vistas = document.querySelectorAll(".vista");

botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        const destino = boton.dataset.vista;

        // Quita "activo" de todo
        botones.forEach((b) => b.classList.remove("activo"));
        vistas.forEach((v) => v.classList.remove("activa"));

        // Activa el botón y la vista que corresponde
        boton.classList.add("activo");
        document.getElementById(`vista-${destino}`).classList.add("activa");

        window.scrollTo(0, 0); // vuelve arriba al cambiar de pantalla
    });
});

// ---------- Registro: horas de sueño ----------
const SUENO_MIN = 0;
const SUENO_MAX = 24;
const SUENO_PASO = 0.5;

let horasSueno = 7.5;

const valorSueno = document.getElementById("sueno-valor");
const botonMenos = document.getElementById("sueno-menos");
const botonMas = document.getElementById("sueno-mas");

function renderSueno() {
    // toLocaleString con "es" muestra la coma decimal: 7,5
    valorSueno.textContent = horasSueno.toLocaleString("es", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });

    // Desactiva los botones al llegar a los límites
    botonMenos.disabled = horasSueno <= SUENO_MIN;
    botonMas.disabled = horasSueno >= SUENO_MAX;
}

// ---------- Registro: nivel de energía (automático) ----------
// Convierte horas de sueño en un nivel de energía (1 a 5)
function energiaSegunSueno(horas) {
    if (horas < 4) return 1;
    if (horas < 6) return 2;
    if (horas < 7) return 3;
    if (horas < 9) return 4;
    return 5;
}

let nivelEnergia = energiaSegunSueno(horasSueno); // con 7,5 h empieza en nivel 4

const opcionesEnergia = document.querySelectorAll(".energia-opcion");

function renderEnergia() {
    opcionesEnergia.forEach((opcion) => {
        const activo = Number(opcion.dataset.nivel) === nivelEnergia;
        opcion.classList.toggle("seleccionado", activo);
    });
}

// ---------- Estadísticas ----------
const statPromedio = document.getElementById("stat-promedio");
const statTendencia = document.getElementById("stat-tendencia");
const statIcono = document.getElementById("stat-tendencia-icono");
const statTarjetaTendencia = document.getElementById("stat-tarjeta-tendencia");

// Por ahora es el valor actual; con un historial, aquí calcularías el promedio real
function calcularPromedioSueno() {
    return horasSueno;
}

// Convierte el promedio en una tendencia
function tendenciaSegunSueno(horas) {
    if (horas < 6) return { texto: "Muy bajo", icono: "bi-arrow-down", clase: "tendencia-baja" };
    if (horas <= 9) return { texto: "Estable", icono: "bi-arrow-right", clase: "tendencia-estable" };
    return { texto: "Alto", icono: "bi-arrow-up", clase: "tendencia-alta" };
}

function renderEstadisticas() {
    const promedio = calcularPromedioSueno();
    const tendencia = tendenciaSegunSueno(promedio);

    statPromedio.textContent =
        promedio.toLocaleString("es", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "h";

    statTendencia.textContent = tendencia.texto;
    statIcono.className = `bi ${tendencia.icono}`;

    statTarjetaTendencia.classList.remove("tendencia-baja", "tendencia-estable", "tendencia-alta");
    statTarjetaTendencia.classList.add(tendencia.clase);
}

// ---------- Alertas ----------
const alertaTarjeta = document.getElementById("alerta-sueno");
const alertaIcono = document.getElementById("alerta-icono");
const alertaTitulo = document.getElementById("alerta-titulo");
const alertaMensaje = document.getElementById("alerta-mensaje");

function alertaSegunSueno(horas) {
    if (horas < 6) {
        return {
            clase: "alerta-baja",
            icono: "bi-exclamation-triangle",
            titulo: "Fatiga alta detectada",
            mensaje: "Tus horas de sueño están muy por debajo de lo recomendado y indican un riesgo alto de fatiga. Se recomienda un descanso inmediato y evitar tareas que exijan mucha concentración.",
        };
    }
    if (horas <= 9) {
        return {
            clase: "alerta-estable",
            icono: "bi-check-circle",
            titulo: "Descanso adecuado",
            mensaje: "Tu descanso está dentro de lo esperado. Para mantenerlo, intenta dormir y despertar a la misma hora, y haz una pausa corta cada 50 minutos de estudio o trabajo.",
        };
    }
    return {
        clase: "alerta-alta",
        icono: "bi-stars",
        titulo: "¡Estás muy bien!",
        mensaje: "Dormiste más que suficiente y tu cuerpo lo agradece. Estás en un gran momento para rendir al máximo: sigue así y mantén tus rutinas de descanso.",
    };
}

function renderAlertas() {
    const alerta = alertaSegunSueno(horasSueno);

    alertaTitulo.textContent = alerta.titulo;
    alertaMensaje.textContent = alerta.mensaje;
    alertaIcono.className = `bi ${alerta.icono}`;

    alertaTarjeta.classList.remove("alerta-baja", "alerta-estable", "alerta-alta");
    alertaTarjeta.classList.add(alerta.clase);
}

// ---------- Inicio: medidor de energía ----------
const medidor = document.getElementById("medidor-energia");
const energiaValor = document.getElementById("energia-valor");
const energiaEstado = document.getElementById("energia-estado");
const energiaMensaje = document.getElementById("energia-mensaje");

// Horas de sueño -> porcentaje (escalones de 10%, entre 10% y 100%)
function porcentajeSegunSueno(horas) {
    const pct = Math.round((horas / 9) * 10) * 10;
    return Math.min(100, Math.max(10, pct));
}

function medidorSegunSueno(horas) {
    if (horas < 6) {
        return {
            clase: "medidor-baja",
            estado: "Bajo",
            mensaje: "Tu energía está baja por falta de descanso. Haz pausas frecuentes y procura dormir más esta noche.",
        };
    }
    if (horas <= 9) {
        return {
            clase: "medidor-estable",
            estado: "Estable",
            mensaje: "Tu nivel de energía está adecuado. Mantén el ritmo y recuerda tomar pausas cortas.",
        };
    }
    return {
        clase: "medidor-alta",
        estado: "Óptimo",
        mensaje: "Tu energía está al máximo. Aprovecha este buen momento y mantén tus rutinas de descanso.",
    };
}

function renderMedidor() {
    const pct = porcentajeSegunSueno(horasSueno);
    const info = medidorSegunSueno(horasSueno);

    medidor.style.setProperty("--porcentaje", pct);
    medidor.setAttribute("aria-label", `Nivel de energía: ${pct}%, ${info.estado.toLowerCase()}`);
    medidor.classList.remove("medidor-baja", "medidor-estable", "medidor-alta");
    medidor.classList.add(info.clase);

    energiaValor.textContent = `${pct}%`;
    energiaEstado.textContent = info.estado;
    energiaMensaje.textContent = info.mensaje;
}

// ---------- Cambio de horas de sueño (conecta sueño con energía, estadísticas, alertas y medidor) ----------
function cambiarSueno(delta) {
    horasSueno = Math.min(SUENO_MAX, Math.max(SUENO_MIN, horasSueno + delta));
    renderSueno();

    nivelEnergia = energiaSegunSueno(horasSueno);
    renderEnergia();

    renderEstadisticas();
    renderAlertas();
    renderMedidor();
}

botonMenos.addEventListener("click", () => cambiarSueno(-SUENO_PASO));
botonMas.addEventListener("click", () => cambiarSueno(SUENO_PASO));

// ---------- Registro: bloques de estudio/trabajo ----------
let bloqueSeleccionado = "3-4"; // el que aparece marcado en tu diseño (usa null si quieres que inicie vacío)

const chips = document.querySelectorAll(".chip");

function renderBloques() {
    chips.forEach((chip) => {
        const activo = chip.dataset.bloque === bloqueSeleccionado;
        chip.classList.toggle("seleccionado", activo);
        chip.setAttribute("aria-checked", activo);
    });
}

chips.forEach((chip) => {
    chip.addEventListener("click", () => {
        // Si vuelves a tocar el que ya está activo, se deselecciona
        bloqueSeleccionado = bloqueSeleccionado === chip.dataset.bloque ? null : chip.dataset.bloque;
        renderBloques();
    });
});

// ---------- Juego: conteo de ovejas ----------
const OVEJAS_MIN = 8;
const OVEJAS_MAX = 15;
const OVEJA_DURACION = 3000; // ms, igual que la animación en el CSS

const juegoOvejas = document.getElementById("juego-ovejas");
const ovejasCampo = document.getElementById("ovejas-campo");
const ovejasValor = document.getElementById("ovejas-valor");
const ultimaOvejas = document.getElementById("ultima-ovejas");

const pantallasOvejas = {
    instrucciones: document.getElementById("ovejas-instrucciones"),
    escena: document.getElementById("ovejas-escena"),
    respuesta: document.getElementById("ovejas-respuesta"),
    resultado: document.getElementById("ovejas-resultado"),
};

let ovejasTotal = 0;      // cuántas pasaron en realidad (el usuario no lo sabe)
let ovejasRespuesta = 0;  // lo que cuenta el usuario
let ovejasTimer = null;

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Muestra solo una pantalla del juego
function mostrarPantallaOvejas(nombre) {
    Object.entries(pantallasOvejas).forEach(([clave, pantalla]) => {
        pantalla.hidden = clave !== nombre;
    });
}

function abrirOvejas() {
    mostrarPantallaOvejas("instrucciones");
    juegoOvejas.hidden = false;
    document.body.style.overflow = "hidden"; // evita que la página de atrás se desplace
}

function cerrarOvejas() {
    clearTimeout(ovejasTimer);
    ovejasCampo.innerHTML = "";
    juegoOvejas.hidden = true;
    document.body.style.overflow = "";
}

// Suelta las ovejas una por una, con pausas aleatorias
function soltarOveja(numero) {
    if (numero >= ovejasTotal) {
        // Espera a que la última termine de cruzar y pasa a la respuesta
        ovejasTimer = setTimeout(mostrarRespuestaOvejas, OVEJA_DURACION + 300);
        return;
    }

    const oveja = document.createElement("span");
    oveja.className = "oveja";
    oveja.textContent = "🐑";
    oveja.setAttribute("aria-hidden", "true");
    oveja.addEventListener("animationend", () => oveja.remove());
    ovejasCampo.appendChild(oveja);

    ovejasTimer = setTimeout(() => soltarOveja(numero + 1), aleatorio(900, 1600));
}

function comenzarOvejas() {
    ovejasTotal = aleatorio(OVEJAS_MIN, OVEJAS_MAX);
    ovejasCampo.innerHTML = "";
    mostrarPantallaOvejas("escena");
    soltarOveja(0);
}

function mostrarRespuestaOvejas() {
    ovejasRespuesta = 0;
    ovejasValor.textContent = ovejasRespuesta;
    mostrarPantallaOvejas("respuesta");
}

function cambiarRespuestaOvejas(delta) {
    ovejasRespuesta = Math.min(30, Math.max(0, ovejasRespuesta + delta));
    ovejasValor.textContent = ovejasRespuesta;
}

// Error de conteo -> resultado
function clasificarOvejas(error) {
    if (error === 0) {
        return {
            texto: "Atención óptima",
            alerta: false,
            mensaje: "¡Contaste todas las ovejas! Tu atención sostenida está en buen estado.",
        };
    }
    if (error <= 2) {
        return {
            texto: "Fatiga leve",
            alerta: true,
            mensaje: "Te equivocaste por poco. Una pausa corta te ayudará a recuperar la concentración.",
        };
    }
    return {
        texto: "Fatiga alta",
        alerta: true,
        mensaje: "Perdiste la cuenta por varias ovejas. Se recomienda descansar antes de seguir con tareas exigentes.",
    };
}

function confirmarOvejas() {
    const error = Math.abs(ovejasRespuesta - ovejasTotal);
    const resultado = clasificarOvejas(error);

    document.getElementById("ovejas-res-titulo").textContent = resultado.texto;
    document.getElementById("ovejas-res-datos").textContent =
        `Pasaron ${ovejasTotal} ovejas y contaste ${ovejasRespuesta}.`;
    document.getElementById("ovejas-res-mensaje").textContent = resultado.mensaje;

    // Actualiza "Última prueba" en la tarjeta
    ultimaOvejas.innerHTML = `${resultado.texto}<span class="punto"></span>`;
    ultimaOvejas.classList.toggle("estado-alerta", resultado.alerta);

    mostrarPantallaOvejas("resultado");
}

document.getElementById("iniciar-ovejas").addEventListener("click", abrirOvejas);
document.getElementById("ovejas-comenzar").addEventListener("click", comenzarOvejas);
document.getElementById("ovejas-menos").addEventListener("click", () => cambiarRespuestaOvejas(-1));
document.getElementById("ovejas-mas").addEventListener("click", () => cambiarRespuestaOvejas(1));
document.getElementById("ovejas-confirmar").addEventListener("click", confirmarOvejas);
document.getElementById("ovejas-cerrar").addEventListener("click", cerrarOvejas);
document.getElementById("ovejas-salir").addEventListener("click", cerrarOvejas);

// Escape también cierra el juego
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !juegoOvejas.hidden) cerrarOvejas();
});

// ---------- Juego: recuerda la secuencia ----------
const SEC_VIDAS = 3;
const SEC_ILUMINA = 600;     // ms que se ilumina cada color
const SEC_PAUSA = 250;       // ms entre colores
const SEC_NIVEL_TOPE = 10;   // el juego termina al completar este nivel
const SEC_TIEMPO = 120;      // segundos máximos de juego (2 min)

const juegoSec = document.getElementById("juego-secuencia");
const secBotones = document.querySelectorAll(".sec-boton");
const secNivelEl = document.getElementById("sec-nivel");
const secVidasEl = document.getElementById("sec-vidas");
const secEstadoEl = document.getElementById("sec-estado");
const ultimaSecuencia = document.getElementById("ultima-secuencia");

const pantallasSec = {
    instrucciones: document.getElementById("sec-instrucciones"),
    juego: document.getElementById("sec-juego"),
    resultado: document.getElementById("sec-resultado"),
};

// Cronómetro: se crea desde JS y se coloca entre "Nivel" y las vidas
const secTiempoEl = document.createElement("span");
secTiempoEl.className = "sec-tiempo";
secTiempoEl.style.fontVariantNumeric = "tabular-nums";
secTiempoEl.setAttribute("aria-hidden", "true");
secVidasEl.parentNode.insertBefore(secTiempoEl, secVidasEl);

// Texto de las instrucciones acorde a las reglas
document.querySelector("#sec-instrucciones .juego-texto").textContent =
    `Verás una serie de colores que se iluminan. Cuando termine, repítela en el mismo orden. ` +
    `Cada nivel agrega un color más. Hay ${SEC_NIVEL_TOPE} niveles, ${SEC_VIDAS} vidas y ` +
    `${Math.round(SEC_TIEMPO / 60)} minutos de tiempo.`;

let secSecuencia = [];
let secPosicion = 0;
let secNivel = 1;
let secNivelMax = 0;
let secVidas = SEC_VIDAS;
let secAciertos = 0;
let secErrores = 0;
let secTiempos = [];
let secInicioTurno = 0;
let secAceptando = false;
let secToken = 0;       // sirve para cancelar el juego si se cierra a la mitad
let secMotivo = "";     // por qué terminó: "vidas", "tope" o "tiempo"
let secTimer = null;
let secFin = 0;

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

function mostrarPantallaSec(nombre) {
    Object.entries(pantallasSec).forEach(([clave, pantalla]) => {
        pantalla.hidden = clave !== nombre;
    });
}

function setBotonesSec(habilitados) {
    secAceptando = habilitados;
    secBotones.forEach((b) => (b.disabled = !habilitados));
}

function iluminarSec(indice, encendido) {
    secBotones[indice].classList.toggle("encendido", encendido);
}

function renderVidasSec() {
    secVidasEl.textContent = Array.from({ length: SEC_VIDAS }, (_, i) => (i < secVidas ? "♥" : "♡")).join(" ");
    secVidasEl.setAttribute("aria-label", `Vidas restantes: ${secVidas}`);
}

// ----- Cronómetro -----
function formatoTiempo(segundos) {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function renderTiempoSec(restante) {
    secTiempoEl.textContent = `⏱ ${formatoTiempo(restante)}`;
}

function detenerTemporizadorSec() {
    clearInterval(secTimer);
    secTimer = null;
}

function iniciarTemporizadorSec() {
    detenerTemporizadorSec();
    secFin = performance.now() + SEC_TIEMPO * 1000;
    renderTiempoSec(SEC_TIEMPO);

    secTimer = setInterval(() => {
        const restante = Math.max(0, Math.ceil((secFin - performance.now()) / 1000));
        renderTiempoSec(restante);
        if (restante <= 0) tiempoAgotadoSec();
    }, 250);
}

async function tiempoAgotadoSec() {
    detenerTemporizadorSec();
    secToken++;                 // cancela la secuencia o el turno en curso
    const token = secToken;
    setBotonesSec(false);
    secBotones.forEach((b) => b.classList.remove("encendido"));
    secEstadoEl.textContent = "¡Se acabó el tiempo!";

    await esperar(1200);
    if (token !== secToken) return;   // si el usuario cerró el juego, no sigas
    secMotivo = "tiempo";
    terminarSecuencia();
}

function abrirSecuencia() {
    mostrarPantallaSec("instrucciones");
    juegoSec.hidden = false;
    document.body.style.overflow = "hidden";
}

function cerrarSecuencia() {
    secToken++;               // cancela cualquier secuencia en curso
    detenerTemporizadorSec();
    setBotonesSec(false);
    secBotones.forEach((b) => b.classList.remove("encendido"));
    juegoSec.hidden = true;
    document.body.style.overflow = "";
}

async function mostrarSecuencia(token) {
    setBotonesSec(false);
    secEstadoEl.textContent = "Mira la secuencia…";
    await esperar(700);

    for (const indice of secSecuencia) {
        if (token !== secToken) return;
        iluminarSec(indice, true);
        await esperar(SEC_ILUMINA);
        iluminarSec(indice, false);
        await esperar(SEC_PAUSA);
    }

    if (token !== secToken) return;
    secPosicion = 0;
    secEstadoEl.textContent = "¡Tu turno!";
    secInicioTurno = performance.now();
    setBotonesSec(true);
}

function comenzarSecuencia() {
    secToken++;
    const token = secToken;

    secSecuencia = [Math.floor(Math.random() * 4)];
    secNivel = 1;
    secNivelMax = 0;
    secVidas = SEC_VIDAS;
    secAciertos = 0;
    secErrores = 0;
    secTiempos = [];
    secMotivo = "";

    secNivelEl.textContent = secNivel;
    renderVidasSec();
    mostrarPantallaSec("juego");
    iniciarTemporizadorSec();
    mostrarSecuencia(token);
}

async function presionarSec(indice) {
    if (!secAceptando) return;

    // Destello corto al tocar
    iluminarSec(indice, true);
    setTimeout(() => iluminarSec(indice, false), 180);

    // Tiempo de respuesta de esta pulsación
    const ahora = performance.now();
    secTiempos.push(ahora - secInicioTurno);
    secInicioTurno = ahora;

    const token = secToken;

    if (indice === secSecuencia[secPosicion]) {
        secAciertos++;
        secPosicion++;

        if (secPosicion === secSecuencia.length) {
            // Nivel completado
            secNivelMax = secNivel;
            setBotonesSec(false);

            // ¿Llegó al nivel tope?
            if (secNivel >= SEC_NIVEL_TOPE) {
                detenerTemporizadorSec();
                secEstadoEl.textContent = "¡Completaste todos los niveles!";
                await esperar(1000);
                if (token !== secToken) return;
                secMotivo = "tope";
                terminarSecuencia();
                return;
            }

            secEstadoEl.textContent = "¡Bien!";
            await esperar(900);
            if (token !== secToken) return;

            secNivel++;
            secNivelEl.textContent = secNivel;
            secSecuencia.push(Math.floor(Math.random() * 4));
            mostrarSecuencia(token);
        }
    } else {
        // Error
        secErrores++;
        secVidas--;
        setBotonesSec(false);
        renderVidasSec();

        if (secVidas === 0) {
            detenerTemporizadorSec();
            secEstadoEl.textContent = "Fin del juego";
            await esperar(900);
            if (token !== secToken) return;
            secMotivo = "vidas";
            terminarSecuencia();
        } else {
            secEstadoEl.textContent = "Ups, repite la secuencia";
            await esperar(1200);
            if (token !== secToken) return;
            mostrarSecuencia(token);
        }
    }
}

function clasificarSecuencia(nivelMax) {
    if (nivelMax >= 7) {
        return { texto: "Memoria óptima", alerta: false, mensaje: "Excelente desempeño: tu atención y memoria inmediata están en buen estado." };
    }
    if (nivelMax >= 4) {
        return { texto: "Fatiga leve", alerta: true, mensaje: "Buen intento, pero hay señales de cansancio. Una pausa corta te ayudará a recuperar la concentración." };
    }
    return { texto: "Fatiga alta", alerta: true, mensaje: "Te costó mantener la secuencia. Se recomienda descansar antes de seguir con tareas exigentes." };
}

function terminarSecuencia() {
    detenerTemporizadorSec();

    const resultado = clasificarSecuencia(secNivelMax);
    const promedio = secTiempos.length
        ? secTiempos.reduce((a, b) => a + b, 0) / secTiempos.length / 1000
        : 0;

    const motivos = {
        vidas: "Terminó porque perdiste las vidas.",
        tope: "Completaste todos los niveles.",
        tiempo: "Terminó porque se acabó el tiempo.",
    };

    document.getElementById("sec-res-titulo").textContent = resultado.texto;
    document.getElementById("sec-res-datos").textContent =
        `${motivos[secMotivo] || ""} Nivel máximo: ${secNivelMax} · Aciertos: ${secAciertos} · Errores: ${secErrores} · ` +
        `Tiempo de respuesta promedio: ${promedio.toLocaleString("es", { maximumFractionDigits: 1 })} s`;
    document.getElementById("sec-res-mensaje").textContent = resultado.mensaje;

    // Actualiza "Última prueba" en la tarjeta de Atención Visual
    ultimaSecuencia.innerHTML = `${resultado.texto}<span class="punto"></span>`;
    ultimaSecuencia.classList.toggle("estado-alerta", resultado.alerta);

    mostrarPantallaSec("resultado");
}

secBotones.forEach((boton) => {
    boton.addEventListener("click", () => presionarSec(Number(boton.dataset.color)));
});

document.getElementById("iniciar-secuencia").addEventListener("click", abrirSecuencia);
document.getElementById("sec-comenzar").addEventListener("click", comenzarSecuencia);
document.getElementById("sec-cerrar").addEventListener("click", cerrarSecuencia);
document.getElementById("sec-salir").addEventListener("click", cerrarSecuencia);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !juegoSec.hidden) cerrarSecuencia();
});

// ---------- Pintar el estado inicial (siempre al final) ----------
renderSueno();
renderBloques();
renderEnergia();
renderEstadisticas();
renderAlertas();
renderMedidor();
setBotonesSec(false);