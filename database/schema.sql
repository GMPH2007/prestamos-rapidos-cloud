-- ============================================================================
-- PROYECTO: PLATAFORMA DE PRÉSTAMOS RÁPIDOS
-- SCRIPT DDL: ESQUEMA DE BASE DE DATOS LOCAL Y DESTINO CLOUD (PostgreSQL / MySQL)
-- ============================================================================

-- 1. TABLA DE USUARIOS / CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente VARCHAR(36) PRIMARY KEY,
    dni VARCHAR(15) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    ingreso_mensual DECIMAL(12, 2) NOT NULL,
    score_crediticio INT DEFAULT 650,
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE SOLICITUDES DE PRÉSTAMOS
CREATE TABLE IF NOT EXISTS solicitudes_prestamo (
    id_solicitud VARCHAR(36) PRIMARY KEY,
    id_cliente VARCHAR(36) NOT NULL,
    monto_solicitado DECIMAL(12, 2) NOT NULL,
    plazo_meses INT NOT NULL,
    tasa_interes_mensual DECIMAL(5, 4) NOT NULL, -- Ej: 0.0250 para 2.5%
    cuota_mensual DECIMAL(12, 2) NOT NULL,
    total_a_pagar DECIMAL(12, 2) NOT NULL,
    motivo_prestamo VARCHAR(255),
    estado_solicitud VARCHAR(30) DEFAULT 'PENDIENTE', -- PENDIENTE, APROBADO, RECHAZADO, DESEMBOLSADO
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP NULL,
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

-- 3. TABLA DE CRONOGRAMA DE CUOTAS (SISTEMA FRANCÉS)
CREATE TABLE IF NOT EXISTS cuotas_prestamo (
    id_cuota VARCHAR(36) PRIMARY KEY,
    id_solicitud VARCHAR(36) NOT NULL,
    numero_cuota INT NOT NULL,
    monto_cuota DECIMAL(12, 2) NOT NULL,
    amortizacion_capital DECIMAL(12, 2) NOT NULL,
    interes_cuota DECIMAL(12, 2) NOT NULL,
    saldo_remanente DECIMAL(12, 2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado_pago VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, PAGADO, VENCIDO
    CONSTRAINT fk_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitudes_prestamo(id_solicitud) ON DELETE CASCADE
);

-- 4. TABLA DE LOGS DE AUDITORÍA Y SEGURIDAD CLOUD
CREATE TABLE IF NOT EXISTS log_auditoria_cloud (
    id_log VARCHAR(36) PRIMARY KEY,
    id_usuario VARCHAR(36),
    accion VARCHAR(100) NOT NULL,
    origen_ip VARCHAR(45) NOT NULL,
    detalles TEXT,
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES PARA OPTIMIZACIÓN EN LA NUBE
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_prestamo(estado_solicitud);
CREATE INDEX IF NOT EXISTS idx_cuotas_vencimiento ON cuotas_prestamo(fecha_vencimiento);
