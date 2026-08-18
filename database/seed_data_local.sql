-- ============================================================================
-- DATOS SEMILLA DE PRUEBA: BASE DE DATOS LOCAL (ON-PREMISE)
-- ============================================================================

INSERT INTO clientes (id_cliente, dni, nombres, apellidos, email, telefono, ingreso_mensual, score_crediticio, estado) VALUES
('cli-001', '72819201', 'Carlos', 'Mendoza Ramos', 'carlos.mendoza@email.com', '+51987654321', 3500.00, 720, 'ACTIVO'),
('cli-002', '45910283', 'Lucia', 'Fernandez Prado', 'lucia.fp@email.com', '+51912345678', 4800.00, 780, 'ACTIVO'),
('cli-003', '70192834', 'Jorge', 'Salazar Vega', 'jorge.salazar@email.com', '+51954321987', 2200.00, 590, 'ACTIVO'),
('cli-004', '41827394', 'Elena', 'Guerrero Soto', 'elena.guerrero@email.com', '+51967812345', 5200.00, 810, 'ACTIVO');

INSERT INTO solicitudes_prestamo (id_solicitud, id_cliente, monto_solicitado, plazo_meses, tasa_interes_mensual, cuota_mensual, total_a_pagar, motivo_prestamo, estado_solicitud, fecha_aprobacion) VALUES
('sol-101', 'cli-001', 5000.00, 12, 0.0200, 472.80, 5673.60, 'Consolidación de deudas', 'APROBADO', CURRENT_TIMESTAMP),
('sol-102', 'cli-002', 10000.00, 24, 0.0180, 518.74, 12449.76, 'Capital de trabajo', 'APROBADO', CURRENT_TIMESTAMP),
('sol-103', 'cli-003', 2000.00, 6, 0.0250, 363.02, 2178.12, 'Gastos médicos', 'PENDIENTE', NULL);
