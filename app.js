/**
 * ============================================================================
 * PRESTAFAST MÓVIL - SISTEMA TRANSACCIONAL FINTECH EN LA NUBE
 * Persistencia en LocalStorage, Amortización Francesa y AWS RDS
 * ============================================================================
 */

// 1. Constantes Financieras
const TASA_MENSUAL = 0.02; // 2.0% TEM (Tasa Efectiva Mensual)

// 2. Estado de la Operación en curso
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

// 3. Base de Datos Cloud Inicial (Prestamistas y Préstamos Otorgados)
const INITIAL_TRANSACTIONS = [
    { op: 'OP-829101', titular: 'Carlos Mendoza', dni: '72819201', monto: 5000, plazo: 12, cuota: 472.80, banco: 'BCP', estado: 'DESEMBOLSADO', fecha: '18/08/2026 10:15', esNuevo: false },
    { op: 'OP-829102', titular: 'Lucia Fernandez', dni: '45910283', monto: 10000, plazo: 24, cuota: 518.74, banco: 'BBVA', estado: 'DESEMBOLSADO', fecha: '18/08/2026 09:40', esNuevo: false },
    { op: 'OP-829103', titular: 'Jorge Salazar', dni: '70192834', monto: 2000, plazo: 6, cuota: 363.02, banco: 'Yape / Plin', estado: 'DESEMBOLSADO', fecha: '18/08/2026 09:10', esNuevo: false },
    { op: 'OP-829104', titular: 'Elena Guerrero', dni: '41827394', monto: 15000, plazo: 36, cuota: 602.40, banco: 'Interbank', estado: 'DESEMBOLSADO', fecha: '18/08/2026 08:30', esNuevo: false }
];

// Cargar transacciones desde localStorage para que NUNCA se borren al recargar
let cloudDbTransactions = [];
function cargarTransaccionesGuardadas() {
    const saved = localStorage.getItem('prestafast_db_transactions');
    if (saved) {
        try {
            cloudDbTransactions = JSON.parse(saved);
        } catch (e) {
            cloudDbTransactions = [...INITIAL_TRANSACTIONS];
        }
    } else {
        cloudDbTransactions = [...INITIAL_TRANSACTIONS];
        guardarTransacciones();
    }
}

function guardarTransacciones() {
    localStorage.setItem('prestafast_db_transactions', JSON.stringify(cloudDbTransactions));
}

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
const seccionMonitor = document.getElementById('seccionMonitor');
const flowStepperContainer = document.getElementById('flowStepperContainer');

// Pestañas
const tabSolicitar = document.getElementById('tabSolicitar');
const tabCartera = document.getElementById('tabCartera');

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

// Buscador y Modal
const inpBuscarPrestamo = document.getElementById('inpBuscarPrestamo');
const selectFiltroEstado = document.getElementById('selectFiltroEstado');
const modalDetallePrestamo = document.getElementById('modalDetallePrestamo');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnModalCerrar = document.getElementById('btnModalCerrar');

/**
 * Fórmula del Sistema Francés de Amortización:
 * C = P * [ r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
 */
function calcularCuotaFrancesa(p, r, n) {
    if (r <= 0) return p / n;
    const factor = Math.pow(1 + r, n);
    return p * ((r * factor) / (factor - 1));
}

function formatearMoneda(val) {
    if (isNaN(val)) val = 0;
    return 'S/ ' + val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Actualiza la cotización en vivo
 */
function actualizarCotizacion() {
    if (!rangeMonto || !rangePlazo) return;
    const monto = parseFloat(rangeMonto.value) || 5000;
    const plazo = parseInt(rangePlazo.value) || 12;

    const cuota = calcularCuotaFrancesa(monto, TASA_MENSUAL, plazo);
    const total = cuota * plazo;
    const interes = total - monto;

    operacion.monto = monto;
    operacion.plazo = plazo;
    operacion.cuota = cuota;
    operacion.interesTotal = interes;
    operacion.totalPagar = total;

    if (txtMonto) txtMonto.textContent = formatearMoneda(monto);
    if (txtPlazo) txtPlazo.textContent = `${plazo} meses`;
    if (txtCuota) txtCuota.textContent = formatearMoneda(cuota);
    if (txtMesesTag) txtMesesTag.textContent = plazo;
    if (bCapital) bCapital.textContent = formatearMoneda(monto);
    if (bInteres) bInteres.textContent = formatearMoneda(interes);
    if (bTotal) bTotal.textContent = formatearMoneda(total);

    generarCronograma(monto, TASA_MENSUAL, plazo, cuota);
}

/**
 * Genera la tabla de amortización cuota por cuota
 */
function generarCronograma(principal, tasa, numCuotas, cuota) {
    if (!cronTableBody) return;
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
if (rangeMonto) {
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
}

if (rangePlazo) {
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
}

montoChips.forEach(chip => {
    chip.addEventListener('click', () => {
        montoChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (rangeMonto) rangeMonto.value = chip.dataset.val;
        actualizarCotizacion();
    });
});

plazoChips.forEach(chip => {
    chip.addEventListener('click', () => {
        plazoChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (rangePlazo) rangePlazo.value = chip.dataset.term;
        actualizarCotizacion();
    });
});

// Desplegar / Ocultar Cronograma
if (btnToggleCron && cronDrawer) {
    btnToggleCron.addEventListener('click', () => {
        const visible = cronDrawer.style.display === 'block';
        cronDrawer.style.display = visible ? 'none' : 'block';
        btnToggleCron.textContent = visible 
            ? '📊 Ver Tabla de Cuotas Detallada' 
            : '▲ Ocultar Tabla de Cuotas';
    });
}

/**
 * Control del flujo de pasos
 */
function cambiarPaso(paso) {
    if (viewPaso1) viewPaso1.style.display = 'none';
    if (viewPaso2) viewPaso2.style.display = 'none';
    if (viewPaso3) viewPaso3.style.display = 'none';
    if (viewPaso4) viewPaso4.style.display = 'none';
    if (viewVoucher) viewVoucher.style.display = 'none';

    // Actualizar badges
    for (let i = 1; i <= 4; i++) {
        const pill = document.getElementById(`stepPill${i}`);
        if (!pill) continue;
        if (i < paso) {
            pill.className = 'step-badge completed';
            const numEl = pill.querySelector('.step-num');
            if (numEl) numEl.textContent = '✓';
        } else if (i === paso) {
            pill.className = 'step-badge active';
            const numEl = pill.querySelector('.step-num');
            if (numEl) numEl.textContent = i;
        } else {
            pill.className = 'step-badge';
            const numEl = pill.querySelector('.step-num');
            if (numEl) numEl.textContent = i;
        }
    }

    if (paso === 1 && viewPaso1) {
        viewPaso1.style.display = 'flex';
    } else if (paso === 2 && viewPaso2) {
        viewPaso2.style.display = 'flex';
    } else if (paso === 3 && viewPaso3) {
        viewPaso3.style.display = 'flex';
        iniciarTimer();
        const c1 = document.getElementById('c1');
        if (c1) c1.focus();
    } else if (paso === 4 && viewPaso4) {
        viewPaso4.style.display = 'flex';
        const cntNombre = document.getElementById('cntNombre');
        const cntDni = document.getElementById('cntDni');
        const cntMonto = document.getElementById('cntMonto');
        const cntPlazo = document.getElementById('cntPlazo');
        const cntCuota = document.getElementById('cntCuota');

        if (cntNombre) cntNombre.textContent = `${operacion.nombres} ${operacion.apellidos}`;
        if (cntDni) cntDni.textContent = operacion.dni;
        if (cntMonto) cntMonto.textContent = formatearMoneda(operacion.monto);
        if (cntPlazo) cntPlazo.textContent = `${operacion.plazo} cuotas fijas`;
        if (cntCuota) cntCuota.textContent = formatearMoneda(operacion.cuota);
    } else if (paso === 5 && viewVoucher) {
        viewVoucher.style.display = 'flex';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navegación entre Pestañas (Solicitar vs. Cartera)
if (tabSolicitar && tabCartera) {
    tabSolicitar.addEventListener('click', () => {
        tabSolicitar.classList.add('active');
        tabCartera.classList.remove('active');
        if (flowStepperContainer) flowStepperContainer.style.display = 'flex';
        cambiarPaso(1);
    });

    tabCartera.addEventListener('click', () => {
        tabCartera.classList.add('active');
        tabSolicitar.classList.remove('active');
        if (viewPaso1) viewPaso1.style.display = 'none';
        if (viewPaso2) viewPaso2.style.display = 'none';
        if (viewPaso3) viewPaso3.style.display = 'none';
        if (viewPaso4) viewPaso4.style.display = 'none';
        if (viewVoucher) viewVoucher.style.display = 'none';
        if (flowStepperContainer) flowStepperContainer.style.display = 'none';

        if (seccionMonitor) {
            seccionMonitor.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Navegación de pasos
if (btnPaso1Siguiente) btnPaso1Siguiente.addEventListener('click', () => cambiarPaso(2));
if (btnVolver1) btnVolver1.addEventListener('click', () => cambiarPaso(1));

// Paso 2: Envío de formulario y evaluación crediticia
if (formCliente) {
    formCliente.addEventListener('submit', (e) => {
        e.preventDefault();

        const inpDni = document.getElementById('inpDni');
        const inpTelefono = document.getElementById('inpTelefono');
        const inpNombres = document.getElementById('inpNombres');
        const inpApellidos = document.getElementById('inpApellidos');
        const inpEmail = document.getElementById('inpEmail');
        const inpIngresos = document.getElementById('inpIngresos');
        const inpMotivo = document.getElementById('inpMotivo');

        operacion.dni = inpDni ? inpDni.value.trim() : '72819201';
        operacion.telefono = inpTelefono ? inpTelefono.value.trim() : '987654321';
        operacion.nombres = inpNombres ? inpNombres.value.trim() : 'Carlos Alberto';
        operacion.apellidos = inpApellidos ? inpApellidos.value.trim() : 'Mendoza Ramos';
        operacion.email = inpEmail ? inpEmail.value.trim() : 'carlos.mendoza@email.com';
        operacion.ingresos = inpIngresos ? parseFloat(inpIngresos.value) : 3500;
        operacion.motivo = inpMotivo ? inpMotivo.value : 'Consolidación de Deudas';

        const btnEval = document.getElementById('btnEvaluar');
        const txtBtn = document.getElementById('txtBtnEval');
        const spin = document.getElementById('spinEval');

        if (txtBtn) txtBtn.style.display = 'none';
        if (spin) spin.style.display = 'block';
        if (btnEval) btnEval.disabled = true;

        mostrarToast('Evaluando Scoring', 'Consultando buró de crédito en AWS Cloud...');

        setTimeout(() => {
            if (txtBtn) txtBtn.style.display = 'inline';
            if (spin) spin.style.display = 'none';
            if (btnEval) btnEval.disabled = false;

            const otpTarget = document.getElementById('otpTarget');
            if (otpTarget) otpTarget.textContent = `+51 ${operacion.telefono}`;
            cambiarPaso(3);
        }, 1000);
    });
}

// Paso 3: Manejo de inputs OTP y soporte para pegar código
const cells = [
    document.getElementById('c1'),
    document.getElementById('c2'),
    document.getElementById('c3'),
    document.getElementById('c4')
].filter(Boolean);

cells.forEach((cell, idx) => {
    cell.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length >= 1 && idx < cells.length - 1) {
            cells[idx + 1].focus();
        }
    });
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
            cells[idx - 1].focus();
        } else if (e.key === 'Enter') {
            if (btnValidarOtp) btnValidarOtp.click();
        }
    });
    cell.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (pasteData.length >= 4) {
            for (let i = 0; i < 4; i++) {
                if (cells[i]) cells[i].value = pasteData[i];
            }
            if (cells[3]) cells[3].focus();
        }
    });
});

// Auto-completar al hacer clic en el código de ayuda
const codeTag = document.querySelector('.code-tag');
if (codeTag) {
    codeTag.style.cursor = 'pointer';
    codeTag.title = 'Haz clic para autocompletar';
    codeTag.addEventListener('click', () => {
        const demoCode = '8520';
        for (let i = 0; i < 4; i++) {
            if (cells[i]) cells[i].value = demoCode[i];
        }
        mostrarToast('Código Autocompletado', 'Código 8520 cargado exitosamente.');
    });
}

let timer;
function iniciarTimer() {
    let t = 45;
    const timerVal = document.getElementById('timerVal');
    clearInterval(timer);
    timer = setInterval(() => {
        t--;
        if (t <= 0) {
            clearInterval(timer);
            if (timerVal) timerVal.textContent = 'Disponible';
        } else {
            if (timerVal) timerVal.textContent = `${t}s`;
        }
    }, 1000);
}

if (btnValidarOtp) {
    btnValidarOtp.addEventListener('click', () => {
        const btn = document.getElementById('btnValidarOtp');
        const txt = document.getElementById('txtBtnOtp');
        const spin = document.getElementById('spinOtp');

        if (txt) txt.style.display = 'none';
        if (spin) spin.style.display = 'block';
        if (btn) btn.disabled = true;

        setTimeout(() => {
            if (txt) txt.style.display = 'inline';
            if (spin) spin.style.display = 'none';
            if (btn) btn.disabled = false;

            mostrarToast('Código OTP Válido', 'Autenticación en 2 pasos completada.');
            cambiarPaso(4);
        }, 800);
    });
}

// Paso 4: Selección de Banco
const bankPills = document.querySelectorAll('.bank-pill');
bankPills.forEach(pill => {
    pill.addEventListener('click', () => {
        bankPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const r = pill.querySelector('input');
        if (r) operacion.banco = r.value;
    });
});

// Desembolso Final y Registro Persistente en Base de Datos Cloud
if (btnDesembolsar) {
    btnDesembolsar.addEventListener('click', () => {
        const inpNumCuenta = document.getElementById('inpNumCuenta');
        operacion.numCuenta = inpNumCuenta ? inpNumCuenta.value.trim() : '191-82739102-0-45';

        const btn = document.getElementById('btnDesembolsar');
        const txt = document.getElementById('txtBtnDes');
        const spin = document.getElementById('spinDes');

        if (txt) txt.style.display = 'none';
        if (spin) spin.style.display = 'block';
        if (btn) btn.disabled = true;

        mostrarToast('Transfiriendo Fondos', 'Registrando transacción en AWS RDS PostgreSQL...');

        setTimeout(() => {
            if (txt) txt.style.display = 'inline';
            if (spin) spin.style.display = 'none';
            if (btn) btn.disabled = false;

            const opId = `OP-${Math.floor(100000 + Math.random() * 900000)}`;
            const fecha = new Date().toLocaleString('es-PE');
            const hash = '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');

            operacion.numOperacion = opId;
            operacion.fechaHora = fecha;
            operacion.hashCloud = hash;

            // Renderizar Comprobante
            const vOp = document.getElementById('vOp');
            const vFecha = document.getElementById('vFecha');
            const vNombre = document.getElementById('vNombre');
            const vDniVal = document.getElementById('vDniVal');
            const vDestino = document.getElementById('vDestino');
            const vMontoVal = document.getElementById('vMontoVal');
            const vPlanVal = document.getElementById('vPlanVal');
            const vHashVal = document.getElementById('vHashVal');

            if (vOp) vOp.textContent = opId;
            if (vFecha) vFecha.textContent = fecha;
            if (vNombre) vNombre.textContent = `${operacion.nombres} ${operacion.apellidos}`;
            if (vDniVal) vDniVal.textContent = operacion.dni;
            if (vDestino) vDestino.textContent = `${operacion.banco} (${operacion.numCuenta})`;
            if (vMontoVal) vMontoVal.textContent = formatearMoneda(operacion.monto);
            if (vPlanVal) vPlanVal.textContent = `${operacion.plazo} cuotas fijas de ${formatearMoneda(operacion.cuota)}`;
            if (vHashVal) vHashVal.textContent = hash;

            // Quitar marca de 'esNuevo' a los anteriores
            cloudDbTransactions.forEach(t => t.esNuevo = false);

            // AGREGAR EL NUEVO PRÉSTAMO EN LA CIMA CON PERSISTENCIA
            cloudDbTransactions.unshift({
                op: opId,
                titular: `${operacion.nombres} ${operacion.apellidos}`,
                dni: operacion.dni,
                monto: operacion.monto,
                plazo: operacion.plazo,
                cuota: operacion.cuota,
                banco: operacion.banco,
                estado: 'DESEMBOLSADO',
                fecha: fecha,
                esNuevo: true
            });

            // Guardar en LocalStorage para que se mantenga permanentemente
            guardarTransacciones();

            // Actualizar tabla en vivo
            renderCloudTable();
            cambiarPaso(5);
            mostrarToast('¡Desembolso Exitoso!', 'Préstamo guardado y registrado en la base de datos Cloud.');
        }, 1300);
    });
}

// Nueva Solicitud
if (btnNuevoCredito) {
    btnNuevoCredito.addEventListener('click', () => {
        if (formCliente) formCliente.reset();
        cells.forEach(c => c.value = '');
        if (rangeMonto) rangeMonto.value = 5000;
        if (rangePlazo) rangePlazo.value = 12;
        actualizarCotizacion();
        cambiarPaso(1);
    });
}

/**
 * Renderiza la tabla de monitoreo Cloud con soporte de búsqueda, filtrado y resaltado de últimos préstamos
 */
function renderCloudTable() {
    const tbody = document.getElementById('cloudLiveTbody');
    if (!tbody) return;

    const query = inpBuscarPrestamo ? inpBuscarPrestamo.value.toLowerCase().trim() : '';
    const estadoFiltro = selectFiltroEstado ? selectFiltroEstado.value : 'TODOS';

    const filtrados = cloudDbTransactions.filter(item => {
        const matchesQuery = item.op.toLowerCase().includes(query) ||
                             item.titular.toLowerCase().includes(query) ||
                             item.dni.toLowerCase().includes(query);
        const matchesEstado = (estadoFiltro === 'TODOS') || (item.estado === estadoFiltro);
        return matchesQuery && matchesEstado;
    });

    let html = '';
    if (filtrados.length === 0) {
        html = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:15px;">No se encontraron préstamos coincidentes.</td></tr>`;
    } else {
        filtrados.forEach((t) => {
            const rowClass = t.esNuevo ? 'highlight-new-row' : '';
            const newBadge = t.esNuevo ? '<span class="new-tag-blink">✨ NUEVO</span> ' : '';
            
            html += `
                <tr class="${rowClass}">
                    <td><code>${t.op}</code></td>
                    <td>${newBadge}<strong>${t.titular}</strong> (${t.dni})</td>
                    <td><strong class="color-accent">${formatearMoneda(t.monto)}</strong></td>
                    <td>${t.plazo} m</td>
                    <td>${formatearMoneda(t.cuota)}</td>
                    <td><span class="badge-tag-ok">${t.estado}</span></td>
                    <td><button type="button" class="btn-detail-sm" onclick="abrirModalDetalle('${t.op}')">🔍 Ver</button></td>
                </tr>
            `;
        });
    }
    tbody.innerHTML = html;

    // Calcular estadísticas dinámicas reales
    const cntDbTrans = document.getElementById('cntDbTrans');
    const cntDbClientes = document.getElementById('cntDbClientes');
    
    // Contar DNIs únicos
    const clientesUnicos = new Set(cloudDbTransactions.map(t => t.dni)).size;
    
    if (cntDbTrans) cntDbTrans.textContent = `${cloudDbTransactions.length} Registradas`;
    if (cntDbClientes) cntDbClientes.textContent = `${clientesUnicos} Clientes`;
}

// Búsqueda y filtrado en tiempo real
if (inpBuscarPrestamo) inpBuscarPrestamo.addEventListener('input', renderCloudTable);
if (selectFiltroEstado) selectFiltroEstado.addEventListener('change', renderCloudTable);

/**
 * Abre el modal con el detalle completo del préstamo
 */
window.abrirModalDetalle = function(opId) {
    const item = cloudDbTransactions.find(t => t.op === opId);
    if (!item) return;

    document.getElementById('mIdOp').textContent = item.op;
    document.getElementById('mCliente').textContent = item.titular;
    document.getElementById('mDni').textContent = item.dni;
    document.getElementById('mMonto').textContent = formatearMoneda(item.monto);
    document.getElementById('mPlazoCuota').textContent = `${item.plazo} cuotas fijas de ${formatearMoneda(item.cuota)}`;
    document.getElementById('mBanco').textContent = item.banco || 'BCP';
    document.getElementById('mEstado').textContent = item.estado;

    if (modalDetallePrestamo) modalDetallePrestamo.style.display = 'flex';
};

// Cerrar Modal
if (btnCloseModal) btnCloseModal.addEventListener('click', () => { if (modalDetallePrestamo) modalDetallePrestamo.style.display = 'none'; });
if (btnModalCerrar) btnModalCerrar.addEventListener('click', () => { if (modalDetallePrestamo) modalDetallePrestamo.style.display = 'none'; });

/**
 * Toast flotante
 */
function mostrarToast(titulo, msg) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMsg');
    if (toastTitle) toastTitle.textContent = titulo;
    if (toastMsg) toastMsg.textContent = msg;
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3200);
}

/**
 * Control del Modo Claro y Oscuro
 */
if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
        if (!appBody) return;
        const isLight = appBody.classList.toggle('theme-light');
        if (isLight) {
            appBody.classList.remove('theme-dark');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Oscuro';
            localStorage.setItem('prestafast_theme', 'light');
        } else {
            appBody.classList.add('theme-dark');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Claro';
            localStorage.setItem('prestafast_theme', 'dark');
        }
    });
}

// Inicialización y carga de anuncios Google AdMob / AdSense
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('prestafast_theme');
    if (savedTheme === 'light' && appBody) {
        appBody.classList.add('theme-light');
        appBody.classList.remove('theme-dark');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Oscuro';
    }
    cargarTransaccionesGuardadas();
    actualizarCotizacion();
    renderCloudTable();

    // Inicializar anuncios automáticos de Google AdMob / AdSense
    try {
        const adSlots = document.querySelectorAll('.adsbygoogle');
        adSlots.forEach(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        });
    } catch (e) {
        // En espera de conexión con los servidores de Google AdMob
    }
});



