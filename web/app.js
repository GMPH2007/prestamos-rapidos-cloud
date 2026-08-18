/**
 * ============================================================================
 * PRESTAFAST MÓVIL - SISTEMA TRANSACCIONAL FINTECH EN LA NUBE
 * Amortización Francesa, Modo Claro/Oscuro y Sincronización AWS RDS
 * ============================================================================
 */

// 1. Constantes Financieras
const TASA_MENSUAL = 0.02; // 2.0% TEM (Tasa Efectiva Mensual)

// 2. Estado de la Operación
let operacion = {
    monto: 5000,
    plazo: 12,
    cuota: 472.80,
    interesTotal: 673.60,
    totalPagar: 5673.60,
    dni: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    email: '',
    ingresos: 3500,
    motivo: 'Consolidación de Deudas',
    banco: 'BCP',
    numCuenta: '191-82739102-0-45',
    numOperacion: '',
    fechaHora: '',
    hashCloud: ''
};

// 3. Simulación de Base de Datos Cloud RDS
let cloudDbTransactions = [
    { op: 'OP-829101', titular: 'Carlos Mendoza (72819201)', monto: 5000, plazo: 12, cuota: 472.80, estado: 'DESEMBOLSADO' },
    { op: 'OP-829102', titular: 'Lucia Fernandez (45910283)', monto: 10000, plazo: 24, cuota: 518.74, estado: 'DESEMBOLSADO' },
    { op: 'OP-829103', titular: 'Jorge Salazar (70192834)', monto: 2000, plazo: 6, cuota: 363.02, estado: 'DESEMBOLSADO' },
    { op: 'OP-829104', titular: 'Elena Guerrero (41827394)', monto: 15000, plazo: 36, cuota: 602.40, estado: 'DESEMBOLSADO' }
];

// 4. Elementos del DOM
const rangeMonto = document.getElementById('rangeMonto');
const rangePlazo = document.getElementById('rangePlazo');
const txtMonto = document.getElementById('txtMonto');
const txtPlazo = document.getElementById('txtPlazo');
const txtCuota = document.getElementById('txtCuota');
const txtMesesTag = document.getElementById('txtMesesTag');
const bCapital = document.getElementById('bCapital');
const bInteres = document.getElementById('bInteres');
const bTotal = document.getElementById('bTotal');

const montoChips = document.querySelectorAll('#montoChips .chip');
const plazoChips = document.querySelectorAll('#plazoChips .chip');

const btnToggleCron = document.getElementById('btnToggleCron');
const cronDrawer = document.getElementById('cronDrawer');
const cronTableBody = document.getElementById('cronTableBody');

// Vistas
const viewPaso1 = document.getElementById('viewPaso1');
const viewPaso2 = document.getElementById('viewPaso2');
const viewPaso3 = document.getElementById('viewPaso3');
const viewPaso4 = document.getElementById('viewPaso4');
const viewVoucher = document.getElementById('viewVoucher');

// Botones de Navegación
const btnPaso1Siguiente = document.getElementById('btnPaso1Siguiente');
const btnVolver1 = document.getElementById('btnVolver1');
const formCliente = document.getElementById('formCliente');
const btnValidarOtp = document.getElementById('btnValidarOtp');
const btnDesembolsar = document.getElementById('btnDesembolsar');
const btnNuevoCredito = document.getElementById('btnNuevoCredito');

// Tema Claro / Oscuro
const btnThemeToggle = document.getElementById('btnThemeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const appBody = document.getElementById('appBody');

/**
 * Fórmula del Sistema Francés de Amortización:
 * C = P * [ r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
 */
function calcularCuotaFrancesa(p, r, n) {
    const factor = Math.pow(1 + r, n);
    return p * ((r * factor) / (factor - 1));
}

function formatearMoneda(val) {
    return 'S/ ' + val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Actualiza la cotización en vivo
 */
function actualizarCotizacion() {
    const monto = parseFloat(rangeMonto.value);
    const plazo = parseInt(rangePlazo.value);

    const cuota = calcularCuotaFrancesa(monto, TASA_MENSUAL, plazo);
    const total = cuota * plazo;
    const interes = total - monto;

    operacion.monto = monto;
    operacion.plazo = plazo;
    operacion.cuota = cuota;
    operacion.interesTotal = interes;
    operacion.totalPagar = total;

    txtMonto.textContent = formatearMoneda(monto);
    txtPlazo.textContent = `${plazo} meses`;
    txtCuota.textContent = formatearMoneda(cuota);
    txtMesesTag.textContent = plazo;
    bCapital.textContent = formatearMoneda(monto);
    bInteres.textContent = formatearMoneda(interes);
    bTotal.textContent = formatearMoneda(total);

    generarCronograma(monto, TASA_MENSUAL, plazo, cuota);
}

/**
 * Genera la tabla de amortización cuota por cuota
 */
function generarCronograma(principal, tasa, numCuotas, cuota) {
    let saldo = principal;
    let html = '';
    for (let i = 1; i <= numCuotas; i++) {
        const interesCuota = saldo * tasa;
        const amortizacion = cuota - interesCuota;
        saldo -= amortizacion;
        if (saldo < 0.05 || i === numCuotas) saldo = 0;

        html += `
            <tr>
                <td>${i}</td>
                <td>${formatearMoneda(cuota)}</td>
                <td>${formatearMoneda(amortizacion)}</td>
                <td>${formatearMoneda(interesCuota)}</td>
                <td>${formatearMoneda(saldo)}</td>
            </tr>
        `;
    }
    cronTableBody.innerHTML = html;
}

// Sliders y Chips
rangeMonto.addEventListener('input', () => {
    montoChips.forEach(chip => {
        if (parseFloat(chip.dataset.val) === parseFloat(rangeMonto.value)) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    actualizarCotizacion();
});

rangePlazo.addEventListener('input', () => {
    plazoChips.forEach(chip => {
        if (parseInt(chip.dataset.term) === parseInt(rangePlazo.value)) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    actualizarCotizacion();
});

montoChips.forEach(chip => {
    chip.addEventListener('click', () => {
        montoChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        rangeMonto.value = chip.dataset.val;
        actualizarCotizacion();
    });
});

plazoChips.forEach(chip => {
    chip.addEventListener('click', () => {
        plazoChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        rangePlazo.value = chip.dataset.term;
        actualizarCotizacion();
    });
});

// Desplegar / Ocultar Cronograma
btnToggleCron.addEventListener('click', () => {
    const visible = cronDrawer.style.display === 'block';
    cronDrawer.style.display = visible ? 'none' : 'block';
    btnToggleCron.textContent = visible 
        ? '📊 Ver Tabla de Cuotas Detallada' 
        : '▲ Ocultar Tabla de Cuotas';
});

/**
 * Control del flujo de pasos
 */
function cambiarPaso(paso) {
    viewPaso1.style.display = 'none';
    viewPaso2.style.display = 'none';
    viewPaso3.style.display = 'none';
    viewPaso4.style.display = 'none';
    viewVoucher.style.display = 'none';

    // Actualizar badges
    for (let i = 1; i <= 4; i++) {
        const pill = document.getElementById(`stepPill${i}`);
        if (!pill) continue;
        if (i < paso) {
            pill.className = 'step-badge completed';
            pill.querySelector('.step-num').textContent = '✓';
        } else if (i === paso) {
            pill.className = 'step-badge active';
            pill.querySelector('.step-num').textContent = i;
        } else {
            pill.className = 'step-badge';
            pill.querySelector('.step-num').textContent = i;
        }
    }

    if (paso === 1) {
        viewPaso1.style.display = 'flex';
    } else if (paso === 2) {
        viewPaso2.style.display = 'flex';
    } else if (paso === 3) {
        viewPaso3.style.display = 'flex';
        iniciarTimer();
        document.getElementById('c1').focus();
    } else if (paso === 4) {
        viewPaso4.style.display = 'flex';
        // Rellenar datos del contrato
        document.getElementById('cntNombre').textContent = `${operacion.nombres} ${operacion.apellidos}`;
        document.getElementById('cntDni').textContent = operacion.dni;
        document.getElementById('cntMonto').textContent = formatearMoneda(operacion.monto);
        document.getElementById('cntPlazo').textContent = `${operacion.plazo} cuotas fijas`;
        document.getElementById('cntCuota').textContent = formatearMoneda(operacion.cuota);
    } else if (paso === 5) {
        viewVoucher.style.display = 'flex';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navegación de pasos
btnPaso1Siguiente.addEventListener('click', () => cambiarPaso(2));
btnVolver1.addEventListener('click', () => cambiarPaso(1));

// Paso 2: Envío de formulario y evaluación crediticia
formCliente.addEventListener('submit', (e) => {
    e.preventDefault();

    operacion.dni = document.getElementById('inpDni').value;
    operacion.telefono = document.getElementById('inpTelefono').value;
    operacion.nombres = document.getElementById('inpNombres').value;
    operacion.apellidos = document.getElementById('inpApellidos').value;
    operacion.email = document.getElementById('inpEmail').value;
    operacion.ingresos = parseFloat(document.getElementById('inpIngresos').value);
    operacion.motivo = document.getElementById('inpMotivo').value;

    const btnEval = document.getElementById('btnEvaluar');
    const txtBtn = document.getElementById('txtBtnEval');
    const spin = document.getElementById('spinEval');

    txtBtn.style.display = 'none';
    spin.style.display = 'block';
    btnEval.disabled = true;

    mostrarToast('Evaluando Scoring', 'Consultando buró de crédito en AWS Cloud...');

    setTimeout(() => {
        txtBtn.style.display = 'inline';
        spin.style.display = 'none';
        btnEval.disabled = false;

        document.getElementById('otpTarget').textContent = `+51 ${operacion.telefono}`;
        cambiarPaso(3);
    }, 1000);
});

// Paso 3: Manejo de inputs OTP
const cells = [
    document.getElementById('c1'),
    document.getElementById('c2'),
    document.getElementById('c3'),
    document.getElementById('c4')
];

cells.forEach((cell, idx) => {
    cell.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && idx < 3) {
            cells[idx + 1].focus();
        }
    });
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
            cells[idx - 1].focus();
        }
    });
});

let timer;
function iniciarTimer() {
    let t = 45;
    const timerVal = document.getElementById('timerVal');
    clearInterval(timer);
    timer = setInterval(() => {
        t--;
        if (t <= 0) {
            clearInterval(timer);
            timerVal.textContent = 'Disponible';
        } else {
            timerVal.textContent = `${t}s`;
        }
    }, 1000);
}

btnValidarOtp.addEventListener('click', () => {
    const btn = document.getElementById('btnValidarOtp');
    const txt = document.getElementById('txtBtnOtp');
    const spin = document.getElementById('spinOtp');

    txt.style.display = 'none';
    spin.style.display = 'block';
    btn.disabled = true;

    setTimeout(() => {
        txt.style.display = 'inline';
        spin.style.display = 'none';
        btn.disabled = false;

        mostrarToast('Código OTP Válido', 'Autenticación en 2 pasos completada.');
        cambiarPaso(4);
    }, 800);
});

// Paso 4: Selección de Banco
const bankPills = document.querySelectorAll('.bank-pill');
bankPills.forEach(pill => {
    pill.addEventListener('click', () => {
        bankPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        operacion.banco = pill.querySelector('input').value;
    });
});

// Desembolso Final
btnDesembolsar.addEventListener('click', () => {
    operacion.numCuenta = document.getElementById('inpNumCuenta').value;
    const btn = document.getElementById('btnDesembolsar');
    const txt = document.getElementById('txtBtnDes');
    const spin = document.getElementById('spinDes');

    txt.style.display = 'none';
    spin.style.display = 'block';
    btn.disabled = true;

    mostrarToast('Transfiriendo Fondos', 'Registrando transacción en AWS RDS PostgreSQL...');

    setTimeout(() => {
        txt.style.display = 'inline';
        spin.style.display = 'none';
        btn.disabled = false;

        const opId = `OP-${Math.floor(100000 + Math.random() * 900000)}`;
        const fecha = new Date().toLocaleString('es-PE');
        const hash = '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');

        operacion.numOperacion = opId;
        operacion.fechaHora = fecha;
        operacion.hashCloud = hash;

        // Renderizar Comprobante
        document.getElementById('vOp').textContent = opId;
        document.getElementById('vFecha').textContent = fecha;
        document.getElementById('vNombre').textContent = `${operacion.nombres} ${operacion.apellidos}`;
        document.getElementById('vDniVal').textContent = operacion.dni;
        document.getElementById('vDestino').textContent = `${operacion.banco} (${operacion.numCuenta})`;
        document.getElementById('vMontoVal').textContent = formatearMoneda(operacion.monto);
        document.getElementById('vPlanVal').textContent = `${operacion.plazo} cuotas fijas de ${formatearMoneda(operacion.cuota)}`;
        document.getElementById('vHashVal').textContent = hash;

        // Agregar a la BD Cloud
        cloudDbTransactions.unshift({
            op: opId,
            titular: `${operacion.nombres} ${operacion.apellidos} (${operacion.dni})`,
            monto: operacion.monto,
            plazo: operacion.plazo,
            cuota: operacion.cuota,
            estado: 'DESEMBOLSADO'
        });

        renderCloudTable();
        cambiarPaso(5);
        mostrarToast('¡Desembolso Exitoso!', 'Dinero acreditado en tu cuenta.');
    }, 1300);
});

// Nueva Solicitud
btnNuevoCredito.addEventListener('click', () => {
    formCliente.reset();
    cells.forEach(c => c.value = '');
    rangeMonto.value = 5000;
    rangePlazo.value = 12;
    actualizarCotizacion();
    cambiarPaso(1);
});

/**
 * Renderiza la tabla de monitoreo Cloud
 */
function renderCloudTable() {
    const tbody = document.getElementById('cloudLiveTbody');
    let html = '';
    cloudDbTransactions.forEach(t => {
        html += `
            <tr>
                <td><code>${t.op}</code></td>
                <td>${t.titular}</td>
                <td><strong>${formatearMoneda(t.monto)}</strong></td>
                <td>${t.plazo} m</td>
                <td>${formatearMoneda(t.cuota)}</td>
                <td><span class="badge-tag-ok">${t.estado}</span></td>
                <td><span class="badge-tag-cloud">AWS RDS</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
    document.getElementById('cntDbTrans').textContent = `${cloudDbTransactions.length} Registradas`;
    document.getElementById('cntDbClientes').textContent = `${cloudDbTransactions.length + 1} Clientes`;
}

/**
 * Toast flotante
 */
function mostrarToast(titulo, msg) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastTitle').textContent = titulo;
    document.getElementById('toastMsg').textContent = msg;
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3200);
}

/**
 * Control del Modo Claro y Oscuro
 */
btnThemeToggle.addEventListener('click', () => {
    const isLight = appBody.classList.toggle('theme-light');
    if (isLight) {
        appBody.classList.remove('theme-dark');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Oscuro';
        localStorage.setItem('prestafast_theme', 'light');
    } else {
        appBody.classList.add('theme-dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Claro';
        localStorage.setItem('prestafast_theme', 'dark');
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('prestafast_theme');
    if (savedTheme === 'light') {
        appBody.classList.add('theme-light');
        appBody.classList.remove('theme-dark');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Oscuro';
    }
    actualizarCotizacion();
    renderCloudTable();
});
