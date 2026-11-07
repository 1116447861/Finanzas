const formulario = document.getElementById("formulario-ingreso");

const campoConcepto = document.getElementById("concepto");
const campoMonto = document.getElementById("monto");
const campoFecha = document.getElementById("fecha");
const formularioGasto = document.getElementById("formulario-gasto");

const campoConceptoGasto = document.getElementById("concepto-gasto");
const campoMontoGasto = document.getElementById("monto-gasto");
const campoFechaGasto = document.getElementById("fecha-gasto");
const campoCategoriaGasto = document.getElementById("categoria-gasto");
const campoOrigenGasto = document.getElementById("origen-gasto");

const formularioAhorro = document.getElementById("formulario-ahorro");
const campoConceptoAhorro = document.getElementById("concepto-ahorro");
const campoMontoAhorro = document.getElementById("monto-ahorro");
const campoFechaAhorro = document.getElementById("fecha-ahorro");
const listaAhorros = document.getElementById("lista-ahorros");

// Elementos del vasito de monedas
const formularioMonedas = document.getElementById("formulario-monedas");
const campoMontoMonedas = document.getElementById("monto-monedas");
const campoFechaMonedas = document.getElementById("fecha-monedas");
const listaMonedas = document.getElementById("lista-monedas");
const totalMonedasHTML = document.getElementById("total-monedas");

const listaGastos = document.getElementById("lista-gastos");
const tarjetas = document.querySelectorAll(".tarjeta");
const filtroMes = document.getElementById("filtro-mes");
const filtroAnio = document.getElementById("filtro-anio");
const listaIngresos = document.getElementById("lista-ingresos");

const filtroMesIngresos = document.getElementById("filtro-mes-ingresos");
const filtroAnioIngresos = document.getElementById("filtro-anio-ingresos");
const totalIngresosMesHTML = document.getElementById("total-ingresos-mes");

// Cargar los movimientos guardados en el navegador
let ingresos = JSON.parse(localStorage.getItem("misIngresos")) || [];
let gastos = JSON.parse(localStorage.getItem("misGastos")) || [];
let ahorros = JSON.parse(localStorage.getItem("misAhorros")) || [];
let monedas = JSON.parse(localStorage.getItem("misMonedas")) || [];

function formatoDinero(valor) {
    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

// Calcular el total de ingresos registrados
function calcularIngresos() {
    return ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
}
function calcularGastos() {
    return gastos.reduce((total, gasto) => total + gasto.monto, 0);
}

function calcularIngresosMesActual() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const anio = String(hoy.getFullYear());

    return ingresos.reduce(function(total, ingreso) {
        if (
            ingreso.fecha.substring(0, 4) === anio &&
            ingreso.fecha.substring(5, 7) === mes
        ) {
            return total + ingreso.monto;
        }

        return total;
    }, 0);
}

function calcularGastosMesActual() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const anio = String(hoy.getFullYear());

    return gastos.reduce(function(total, gasto) {
        if (
            gasto.fecha.substring(0, 4) === anio &&
            gasto.fecha.substring(5, 7) === mes
        ) {
            return total + gasto.monto;
        }

        return total;
    }, 0);
}

function calcularGastosDesdeDisponible() {
    return gastos.reduce((total, gasto) => {
        if (gasto.origen === "ahorros") {
            return total;
        }

        return total + gasto.monto;
    }, 0);
}

function calcularAhorros() {
    return ahorros.reduce((total, ahorro) => {
        if (ahorro.tipo === "retiro") {
            return total - Math.abs(ahorro.monto);
        }

        return total + ahorro.monto;
    }, 0);
}

// Calcular el total acumulado en el vasito
function calcularTotalMonedas() {
    return monedas.reduce(function(total, moneda) {
        return total + moneda.monto;
    }, 0);
}

// Mostrar el total acumulado en pantalla
function actualizarTotalMonedas() {
    totalMonedasHTML.textContent =
        formatoDinero(calcularTotalMonedas());
}

// Mostrar el historial de monedas
function mostrarHistorialMonedas() {
    listaMonedas.innerHTML = "";

document.getElementById("cantidad-movimientos-monedas").textContent =
    monedas.length;

    if (monedas.length === 0) {
        listaMonedas.textContent =
            "Todavía no has agregado monedas.";
        return;
    }

    monedas.forEach(function(moneda) {
        const movimiento = document.createElement("div");

        const valor = document.createElement("p");
        valor.textContent =
            "Valor agregado: " + formatoDinero(moneda.monto);

        const fecha = document.createElement("p");
        fecha.textContent = "Fecha: " + moneda.fecha;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.type = "button";

        botonEliminar.addEventListener("click", function() {
            const confirmar = confirm(
                "¿Quieres eliminar este registro de monedas?"
            );

            if (confirmar) {
                monedas = monedas.filter(function(item) {
                    return item !== moneda;
                });

                localStorage.setItem(
                    "misMonedas",
                    JSON.stringify(monedas)
                );

                actualizarTotalMonedas();
                mostrarHistorialMonedas();
                actualizarResumen();
            }
        });

        movimiento.appendChild(valor);
        movimiento.appendChild(fecha);
        movimiento.appendChild(botonEliminar);

        listaMonedas.appendChild(movimiento);
    });
}

function actualizarResumenAhorrosMes() {
    const mesSeleccionado = filtroMes.value.padStart(2, "0");
    const anioSeleccionado = filtroAnio.value;

    const ahorrosDelMes = ahorros.filter(function(ahorro) {
        return (
            ahorro.fecha.substring(0, 4) === anioSeleccionado &&
            ahorro.fecha.substring(5, 7) === mesSeleccionado
        );
    });

    const depositos = ahorrosDelMes.reduce(function(total, ahorro) {
        if (ahorro.tipo === "retiro") {
            return total;
        }

        return total + ahorro.monto;
    }, 0);

    const retiros = ahorrosDelMes.reduce(function(total, ahorro) {
        if (ahorro.tipo === "retiro") {
            return total + Math.abs(ahorro.monto);
        }

        return total;
    }, 0);

    document.getElementById("total-depositos-mes").textContent =
        formatoDinero(depositos);

    document.getElementById("total-retiros-mes").textContent =
        formatoDinero(retiros);

    document.getElementById("balance-ahorros-mes").textContent =
        formatoDinero(depositos - retiros);
}

function mostrarHistorialAhorros() {
    listaAhorros.innerHTML = "";

    if (ahorros.length === 0) {
        listaAhorros.textContent =
            "Todavía no tienes ahorros registrados.";
        return;
    }

    ahorros.forEach(function(ahorro) {
        const movimiento = document.createElement("div");
        movimiento.className = "movimiento-ahorro";

        const concepto = document.createElement("p");
        concepto.textContent = ahorro.concepto;

        const fecha = document.createElement("p");
        fecha.textContent = "Fecha: " + ahorro.fecha;

        const valor = document.createElement("p");

        if (ahorro.tipo === "retiro") {
            valor.textContent =
                "Retiro: " + formatoDinero(Math.abs(ahorro.monto));
        } else {
            valor.textContent =
                "Ahorro: " + formatoDinero(ahorro.monto);
        }

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.type = "button";

        botonEliminar.addEventListener("click", function() {
            const confirmar = confirm(
                "¿Quieres eliminar este registro de ahorro?"
            );

            if (confirmar) {
                ahorros = ahorros.filter(function(item) {
                    return item !== ahorro;
                });

                localStorage.setItem(
                    "misAhorros",
                    JSON.stringify(ahorros)
                );

                mostrarHistorialAhorros();
                actualizarResumen();
                actualizarResumenAhorrosMes();
            }
        });

        movimiento.appendChild(concepto);
        movimiento.appendChild(fecha);
        movimiento.appendChild(valor);
        movimiento.appendChild(botonEliminar);

        listaAhorros.appendChild(movimiento);
    });
}
    
function calcularGastosDelMes() {
    const mesSeleccionado = filtroMes.value.padStart(2, "0");
    const anioSeleccionado = filtroAnio.value;

    const gastosDelMes = gastos.filter(function(gasto) {
        return (
            gasto.fecha.substring(0, 4) === anioSeleccionado &&
            gasto.fecha.substring(5, 7) === mesSeleccionado
        );
    });

    return gastosDelMes.reduce(function(total, gasto) {
        return total + gasto.monto;
    }, 0);
}
function actualizarGastosPorCategoria() {
    const contenedor = document.getElementById("lista-gastos-categorias");

    const mesSeleccionado = filtroMes.value.padStart(2, "0");
    const anioSeleccionado = filtroAnio.value;

    const gastosDelMes = gastos.filter(function(gasto) {
        return (
            gasto.fecha.substring(0, 4) === anioSeleccionado &&
            gasto.fecha.substring(5, 7) === mesSeleccionado
        );
    });

    const categorias = [
        "Personales",
        "Alimentación",
        "Transporte",
        "Horus",
        "Servicios",
        "Otros"
    ];

    contenedor.innerHTML = "";

    categorias.forEach(function(categoria) {
        const gastosCategoria = gastosDelMes.filter(function(gasto) {
            return gasto.categoria === categoria;
        });

        const totalCategoria = gastosCategoria.reduce(function(total, gasto) {
            return total + gasto.monto;
        }, 0);

        const tarjeta = document.createElement("div");
        tarjeta.className = "categoria-gastos";

        // Encabezado de la categoría
        const titulo = document.createElement("h4");
        titulo.textContent =
            categoria + ": " + formatoDinero(totalCategoria);

        // Botón para abrir y cerrar los movimientos
        const botonAbrir = document.createElement("button");
        botonAbrir.textContent = "Ver movimientos ▼";
        botonAbrir.type = "button";

        botonAbrir.style.margin = "0";
        botonAbrir.style.backgroundColor = "#e8f5ee";
        botonAbrir.style.color = "#236747";

        titulo.appendChild(botonAbrir);
        tarjeta.appendChild(titulo);

        // Contenedor de los movimientos, oculto inicialmente
        const listaMovimientos = document.createElement("div");
        listaMovimientos.style.display = "none";

        botonAbrir.addEventListener("click", function() {
            if (listaMovimientos.style.display === "none") {
                listaMovimientos.style.display = "block";
                botonAbrir.textContent = "Ocultar movimientos ▲";
            } else {
                listaMovimientos.style.display = "none";
                botonAbrir.textContent = "Ver movimientos ▼";
            }
        });

        if (gastosCategoria.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No hay gastos en esta categoría.";
            listaMovimientos.appendChild(mensaje);
        }

        gastosCategoria.forEach(function(gasto) {
            const movimiento = document.createElement("div");
            movimiento.className = "movimiento-gasto";

            const informacion = document.createElement("div");

            const concepto = document.createElement("strong");
            concepto.textContent = gasto.concepto;

            const fecha = document.createElement("p");
            fecha.textContent = gasto.fecha;

            const valor = document.createElement("p");
            valor.textContent = formatoDinero(gasto.monto);

            informacion.appendChild(concepto);
            informacion.appendChild(fecha);
            informacion.appendChild(valor);

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";

            botonEliminar.addEventListener("click", function() {
                const confirmar = confirm("¿Quieres eliminar este gasto?");

                if (confirmar) {
                    gastos = gastos.filter(function(item) {
                        return item !== gasto;
                    });

                    localStorage.setItem(
                        "misGastos",
                        JSON.stringify(gastos)
                    );

                    actualizarResumen();
                    mostrarHistorialGastos();
                    actualizarGastosPorCategoria();
                }
            });

            movimiento.appendChild(informacion);
            movimiento.appendChild(botonEliminar);

            listaMovimientos.appendChild(movimiento);
        });

        tarjeta.appendChild(listaMovimientos);
        contenedor.appendChild(tarjeta);
    });
}
function configurarFiltrosGastos() {
    const anioActual = new Date().getFullYear();

    const aniosRegistrados = [
        ...gastos.map(gasto => Number(gasto.fecha.substring(0, 4))),
        ...ahorros.map(ahorro => Number(ahorro.fecha.substring(0, 4)))
    ].filter(anio => Number.isFinite(anio) && anio > 0);

    const anioInicial = Math.min(
        anioActual - 5,
        ...aniosRegistrados
    );

    const anioFinal = Math.max(
        anioActual + 5,
        ...aniosRegistrados
    );

    filtroAnio.innerHTML = "";

    for (let anio = anioInicial; anio <= anioFinal; anio++) {
        const opcion = document.createElement("option");

        opcion.value = String(anio);
        opcion.textContent = anio;

        filtroAnio.appendChild(opcion);
    }

    filtroMes.value = String(new Date().getMonth() + 1);
    filtroAnio.value = String(anioActual);
}

function configurarFiltrosIngresos() {
    const anioActual = new Date().getFullYear();

    const aniosRegistrados = ingresos
        .map(ingreso => Number(ingreso.fecha.substring(0, 4)))
        .filter(anio => Number.isFinite(anio) && anio > 0);

    const anioInicial = Math.min(
        anioActual - 5,
        ...aniosRegistrados
    );

    const anioFinal = Math.max(
        anioActual + 5,
        ...aniosRegistrados
    );

    filtroAnioIngresos.innerHTML = "";

    for (let anio = anioInicial; anio <= anioFinal; anio++) {
        const opcion = document.createElement("option");

        opcion.value = String(anio);
        opcion.textContent = anio;

        filtroAnioIngresos.appendChild(opcion);
    }

    filtroMesIngresos.value = String(new Date().getMonth() + 1);
    filtroAnioIngresos.value = String(anioActual);
}

// Actualizar las tarjetas

function actualizarResumen() {
    // Calcular los ingresos y gastos del mes actual
    const ingresosMes = calcularIngresosMesActual();
    const gastosMes = calcularGastosMesActual();

    // Calcular los valores acumulados
    const totalIngresos = calcularIngresos();
    const gastosDisponibles = calcularGastosDesdeDisponible();
    const totalAhorros = calcularAhorros() + calcularTotalMonedas();

    // Calcular el saldo disponible
    const saldoDisponible =
        totalIngresos - gastosDisponibles - totalAhorros;

    // Actualizar la tarjeta de saldo disponible
    document.getElementById("total-saldo").textContent =
        formatoDinero(saldoDisponible);

    // Actualizar el detalle del saldo
    document.getElementById("detalle-saldo").textContent =
        formatoDinero(saldoDisponible);

    // Actualizar la tarjeta de ingresos del mes
    document.getElementById("total-ingresos").textContent =
        formatoDinero(ingresosMes);

    // Actualizar la tarjeta de gastos del mes
    document.getElementById("total-gastos").textContent =
        formatoDinero(gastosMes);

    // Actualizar la tarjeta de ahorros
    document.getElementById("total-ahorros").textContent =
        formatoDinero(totalAhorros);

        // Actualizar el detalle de ingresos, gastos y ahorros
document.getElementById("detalle-ingresos").textContent =
    formatoDinero(totalIngresos);

document.getElementById("detalle-gastos").textContent =
    formatoDinero(calcularGastos());

document.getElementById("detalle-ahorros").textContent =
    formatoDinero(totalAhorros);
}

function mostrarHistorial() {
    listaIngresos.innerHTML = "";

    const mesSeleccionado = filtroMesIngresos.value.padStart(2, "0");
    const anioSeleccionado = filtroAnioIngresos.value;

    const ingresosFiltrados = ingresos.filter(function(ingreso) {
        return (
            ingreso.fecha.substring(0, 4) === anioSeleccionado &&
            ingreso.fecha.substring(5, 7) === mesSeleccionado
        );
    });

    document.getElementById("cantidad-movimientos-ingresos").textContent = ingresosFiltrados.length;

    let totalMes = 0;

    ingresosFiltrados.forEach(function(ingreso) {
        const fila = document.createElement("tr");

        const celdaFecha = document.createElement("td");
        celdaFecha.textContent = ingreso.fecha;

        const celdaConcepto = document.createElement("td");
        celdaConcepto.textContent = ingreso.concepto;

        const celdaMonto = document.createElement("td");
        celdaMonto.textContent = formatoDinero(ingreso.monto);

        const celdaAccion = document.createElement("td");
        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function() {
            const confirmar = confirm("¿Quieres eliminar este ingreso?");

            if (confirmar) {
                ingresos = ingresos.filter(function(item) {
                    return item !== ingreso;
                });

                localStorage.setItem("misIngresos", JSON.stringify(ingresos));

                actualizarResumen();
                mostrarHistorial();
            }
        });

        celdaAccion.appendChild(botonEliminar);

        fila.appendChild(celdaFecha);
        fila.appendChild(celdaConcepto);
        fila.appendChild(celdaMonto);
        fila.appendChild(celdaAccion);

        listaIngresos.appendChild(fila);

        totalMes += Number(ingreso.monto);
    });

    totalIngresosMesHTML.textContent = formatoDinero(totalMes);
}

function mostrarHistorialGastos() {
    const totalMensual = calcularGastosDelMes();

    document.getElementById("total-gastos-mes").textContent =
        formatoDinero(totalMensual);

    const mesSeleccionado = filtroMes.value.padStart(2, "0");
    const anioSeleccionado = filtroAnio.value;

    const gastosFiltrados = gastos.filter(function(gasto) {
        return (
            gasto.fecha.substring(0, 4) === anioSeleccionado &&
            gasto.fecha.substring(5, 7) === mesSeleccionado
        );
    });

    document.getElementById("cantidad-movimientos-gastos").textContent =
        gastosFiltrados.length;

    actualizarGastosPorCategoria();
}

filtroMes.addEventListener("change", function() {
    mostrarHistorialGastos();
    actualizarGastosPorCategoria();
    actualizarResumenAhorrosMes();
});

filtroAnio.addEventListener("change", function() {
    mostrarHistorialGastos();
    actualizarGastosPorCategoria();
    actualizarResumenAhorrosMes();
});

filtroMesIngresos.addEventListener("change", function() {
    mostrarHistorial();
});

filtroAnioIngresos.addEventListener("change", function() {
    mostrarHistorial();
});

// Registrar un ingreso
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const concepto = campoConcepto.value.trim();
    const monto = Number(campoMonto.value);
    const fecha = campoFecha.value;

    if (
        concepto === "" ||
        fecha === "" ||
        !Number.isFinite(monto) ||
        monto <= 0
    ) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const nuevoIngreso = {
        concepto: concepto,
        monto: monto,
        fecha: fecha
    };

    ingresos.push(nuevoIngreso);

    // Guardar los ingresos en el navegador
    localStorage.setItem("misIngresos", JSON.stringify(ingresos));

    actualizarResumen();
    mostrarHistorial();

    alert(
        "¡Ingreso guardado correctamente!\n\n" +
        "Concepto: " + concepto + "\n" +
        "Valor: " + formatoDinero(monto) + "\n" +
        "Fecha: " + fecha
    );

    formulario.reset();
});

formularioGasto.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const concepto = campoConceptoGasto.value.trim();
    const monto = Number(campoMontoGasto.value);
    const fecha = campoFechaGasto.value;
    const categoria = campoCategoriaGasto.value;
    const origen = campoOrigenGasto.value;

    if (
        concepto === "" ||
        categoria === "" ||
        fecha === "" ||
        origen === "" ||
        !Number.isFinite(monto) ||
        monto <= 0
    ) {
        alert("Por favor, completa todos los campos del gasto.");
        return;
    }

    if (origen === "ahorros" && calcularAhorros() < monto) {
        alert("No tienes suficientes ahorros para pagar este gasto.");
        return;
    }

    gastos.push({
        concepto: concepto,
        categoria: categoria,
        monto: monto,
        fecha: fecha,
        origen: origen
    });

    localStorage.setItem("misGastos", JSON.stringify(gastos));

    if (origen === "ahorros") {
        ahorros.push({
            concepto: "Gasto: " + concepto,
            monto: -monto,
            fecha: fecha,
            tipo: "retiro"
        });

        localStorage.setItem("misAhorros", JSON.stringify(ahorros));
        mostrarHistorialAhorros();
    }

    actualizarResumen();
    mostrarHistorialGastos();
    actualizarGastosPorCategoria();

    alert("¡Gasto registrado correctamente!");

    formularioGasto.reset();
});

formularioAhorro.addEventListener("submit", function(event) {
    event.preventDefault();

    const concepto = campoConceptoAhorro.value.trim();
    const monto = Number(campoMontoAhorro.value);
    const fecha = campoFechaAhorro.value;

    const nuevoAhorro = {
        concepto: concepto,
        monto: monto,
        fecha: fecha,
        tipo: "deposito"
    };

    ahorros.push(nuevoAhorro);

    localStorage.setItem("misAhorros", JSON.stringify(ahorros));

    actualizarResumen();
    mostrarHistorialAhorros();

    formularioAhorro.reset();

    alert("¡Ahorro guardado correctamente!");
});

// Registrar monedas en el vasito
formularioMonedas.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const monto = Number(campoMontoMonedas.value);
    const fecha = campoFechaMonedas.value;

    if (
        fecha === "" ||
        !Number.isFinite(monto) ||
        monto <= 0
    ) {
        alert("Ingresa un valor válido y selecciona la fecha.");
        return;
    }

    const nuevaMoneda = {
        monto: monto,
        fecha: fecha
    };

    monedas.push(nuevaMoneda);

    localStorage.setItem(
        "misMonedas",
        JSON.stringify(monedas)
    );

    actualizarTotalMonedas();
    mostrarHistorialMonedas();
    actualizarResumen();

    formularioMonedas.reset();

    alert("¡Dinero agregado al vasito correctamente!");
});

// Mostrar los valores guardados al abrir la página
configurarFiltrosGastos();
configurarFiltrosIngresos();

actualizarResumen();
mostrarHistorial();
mostrarHistorialGastos();
actualizarGastosPorCategoria();
mostrarHistorialAhorros();
actualizarResumenAhorrosMes();
actualizarTotalMonedas();
mostrarHistorialMonedas();

/* =========================================
   NAVEGACIÓN ENTRE LAS CUATRO SECCIONES
========================================= */

const botonSaldo = document.getElementById("boton-saldo");
const botonIngresos = document.getElementById("boton-ingresos");
const botonGastos = document.getElementById("boton-gastos");
const botonAhorros = document.getElementById("boton-ahorros");

const seccionesPantalla = document.querySelectorAll(".seccion-pantalla");

function abrirSeccion(idSeccion) {
    // Ocultar las cuatro tarjetas del inicio
    document.querySelector(".resumen").style.display = "none";
    document.getElementById("encabezado-inicio").style.display = "none";

    // Ocultar todas las secciones
    seccionesPantalla.forEach(function(seccion) {
        seccion.style.display = "none";
    });

    // Mostrar únicamente la sección elegida
    const seccionSeleccionada = document.getElementById(idSeccion);

    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = "block";

        seccionSeleccionada.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

botonSaldo.addEventListener("click", function() {
    abrirSeccion("seccion-saldo");
});

botonIngresos.addEventListener("click", function() {
    abrirSeccion("seccion-ingresos");
});

botonGastos.addEventListener("click", function() {
    abrirSeccion("seccion-gastos-formulario");
});

botonAhorros.addEventListener("click", function() {
    abrirSeccion("seccion-ahorros");
});

function volverAlInicio() {
    seccionesPantalla.forEach(function(seccion) {
        seccion.style.display = "none";
    });

    document.querySelector(".resumen").style.display = "grid";
    document.getElementById("encabezado-inicio").style.display = "block";
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}