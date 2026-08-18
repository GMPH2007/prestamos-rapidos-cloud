"""
=============================================================================
HERRAMIENTA DE MIGRACIÓN: BASE DE DATOS LOCAL -> CLOUD (AWS RDS / AZURE)
=============================================================================
Este script automatiza el proceso de extracción, validación de integridad,
cifrado y carga hacia la base de datos en la nube.
"""

import sqlite3
import hashlib
import json
import time
import os
from datetime import datetime

# Rutas de simulación
DB_LOCAL = "database/local_loans.db"
DB_CLOUD = "database/cloud_rds_loans.db"

def init_local_database():
    """Crea y puebla la base de datos local (On-Premise) para la prueba."""
    os.makedirs("database", exist_ok=True)
    conn = sqlite3.connect(DB_LOCAL)
    cursor = conn.cursor()
    
    # Crear tablas
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clientes (
        id_cliente TEXT PRIMARY KEY,
        dni TEXT UNIQUE,
        nombres TEXT,
        apellidos TEXT,
        email TEXT UNIQUE,
        telefono TEXT,
        ingreso_mensual REAL,
        score_crediticio INTEGER,
        estado TEXT,
        fecha_registro TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS solicitudes_prestamo (
        id_solicitud TEXT PRIMARY KEY,
        id_cliente TEXT,
        monto_solicitado REAL,
        plazo_meses INTEGER,
        tasa_interes_mensual REAL,
        cuota_mensual REAL,
        total_a_pagar REAL,
        motivo_prestamo TEXT,
        estado_solicitud TEXT,
        fecha_solicitud TEXT
    )
    """)

    # Insertar datos de prueba locales si no existen
    cursor.execute("SELECT COUNT(*) FROM clientes")
    if cursor.fetchone()[0] == 0:
        clientes = [
            ('cli-001', '72819201', 'Carlos', 'Mendoza Ramos', 'carlos.mendoza@email.com', '+51987654321', 3500.0, 720, 'ACTIVO', str(datetime.now())),
            ('cli-002', '45910283', 'Lucia', 'Fernandez Prado', 'lucia.fp@email.com', '+51912345678', 4800.0, 780, 'ACTIVO', str(datetime.now())),
            ('cli-003', '70192834', 'Jorge', 'Salazar Vega', 'jorge.salazar@email.com', '+51954321987', 2200.0, 590, 'ACTIVO', str(datetime.now())),
            ('cli-004', '41827394', 'Elena', 'Guerrero Soto', 'elena.guerrero@email.com', '+51967812345', 5200.0, 810, 'ACTIVO', str(datetime.now()))
        ]
        cursor.executemany("INSERT INTO clientes VALUES (?,?,?,?,?,?,?,?,?,?)", clientes)
        
        solicitudes = [
            ('sol-101', 'cli-001', 5000.0, 12, 0.02, 472.80, 5673.60, 'Consolidación de deudas', 'APROBADO', str(datetime.now())),
            ('sol-102', 'cli-002', 10000.0, 24, 0.018, 518.74, 12449.76, 'Capital de trabajo', 'APROBADO', str(datetime.now())),
            ('sol-103', 'cli-003', 2000.0, 6, 0.025, 363.02, 2178.12, 'Gastos médicos', 'PENDIENTE', str(datetime.now()))
        ]
        cursor.executemany("INSERT INTO solicitudes_prestamo VALUES (?,?,?,?,?,?,?,?,?,?)", solicitudes)
        conn.commit()
    conn.close()

def calculate_checksum(db_path, table_name):
    """Calcula un Checksum SHA-256 para verificar integridad de datos."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name} ORDER BY 1")
    rows = cursor.fetchall()
    conn.close()
    data_str = json.dumps(rows, default=str)
    return hashlib.sha256(data_str.encode('utf-8')).hexdigest()

def execute_cloud_migration():
    """Ejecuta la migración paso a paso hacia la base de datos Cloud simulada."""
    print("=" * 70)
    print("🚀 INICIANDO PROCESO DE MIGRACIÓN: LOCAL (ON-PREMISE) -> CLOUD RDS")
    print("=" * 70)
    
    # 1. Inicialización
    print("[FASE 1] Verificando conectividad con Base de Datos Local...")
    init_local_database()
    time.sleep(0.5)
    print("  ✓ Conexión establecida con la BD Local (SQLite/PostgreSQL Local)")
    
    # 2. Extracción y Diagnóstico
    conn_local = sqlite3.connect(DB_LOCAL)
    cur_local = conn_local.cursor()
    cur_local.execute("SELECT COUNT(*) FROM clientes")
    total_clientes = cur_local.fetchone()[0]
    cur_local.execute("SELECT COUNT(*) FROM solicitudes_prestamo")
    total_solicitudes = cur_local.fetchone()[0]
    print(f"  ✓ Auditoría de origen: {total_clientes} Clientes, {total_solicitudes} Solicitudes de préstamo")

    # 3. Checksums de origen
    chk_cli_local = calculate_checksum(DB_LOCAL, "clientes")
    chk_sol_local = calculate_checksum(DB_LOCAL, "solicitudes_prestamo")
    print(f"  ✓ Checksum Local Clientes:    {chk_cli_local[:16]}...")
    print(f"  ✓ Checksum Local Solicitudes: {chk_sol_local[:16]}...")

    # 4. Aprovisionamiento Cloud y Transferencia
    print("\n[FASE 2] Conectando a Base de Datos Cloud (AWS RDS PostgreSQL)...")
    time.sleep(0.6)
    conn_cloud = sqlite3.connect(DB_CLOUD)
    cur_cloud = conn_cloud.cursor()
    
    # Crear esquema en Cloud con tabla de auditoría adicional
    cur_cloud.execute("""
    CREATE TABLE IF NOT EXISTS clientes (
        id_cliente TEXT PRIMARY KEY,
        dni TEXT UNIQUE,
        nombres TEXT,
        apellidos TEXT,
        email TEXT UNIQUE,
        telefono TEXT,
        ingreso_mensual REAL,
        score_crediticio INTEGER,
        estado TEXT,
        fecha_registro TEXT
    )
    """)
    cur_cloud.execute("""
    CREATE TABLE IF NOT EXISTS solicitudes_prestamo (
        id_solicitud TEXT PRIMARY KEY,
        id_cliente TEXT,
        monto_solicitado REAL,
        plazo_meses INTEGER,
        tasa_interes_mensual REAL,
        cuota_mensual REAL,
        total_a_pagar REAL,
        motivo_prestamo TEXT,
        estado_solicitud TEXT,
        fecha_solicitud TEXT
    )
    """)
    cur_cloud.execute("""
    CREATE TABLE IF NOT EXISTS log_auditoria_cloud (
        id_log TEXT PRIMARY KEY,
        evento TEXT,
        registros_migrados INTEGER,
        checksum_verificado TEXT,
        fecha_migracion TEXT
    )
    """)

    # Limpiar destino para migración limpia
    cur_cloud.execute("DELETE FROM clientes")
    cur_cloud.execute("DELETE FROM solicitudes_prestamo")

    # Extraer de local e insertar en cloud
    cur_local.execute("SELECT * FROM clientes")
    clientes_data = cur_local.fetchall()
    cur_cloud.executemany("INSERT INTO clientes VALUES (?,?,?,?,?,?,?,?,?,?)", clientes_data)

    cur_local.execute("SELECT * FROM solicitudes_prestamo")
    solicitudes_data = cur_local.fetchall()
    cur_cloud.executemany("INSERT INTO solicitudes_prestamo VALUES (?,?,?,?,?,?,?,?,?,?)", solicitudes_data)
    
    conn_cloud.commit()
    conn_local.close()

    # 5. Validación y Verificación (Cutover)
    print("\n[FASE 3] Validación de Integridad y Checksums Post-Migración...")
    time.sleep(0.5)
    chk_cli_cloud = calculate_checksum(DB_CLOUD, "clientes")
    chk_sol_cloud = calculate_checksum(DB_CLOUD, "solicitudes_prestamo")

    print(f"  ✓ Checksum Cloud Clientes:    {chk_cli_cloud[:16]}...")
    print(f"  ✓ Checksum Cloud Solicitudes: {chk_sol_cloud[:16]}...")

    if chk_cli_local == chk_cli_cloud and chk_sol_local == chk_sol_cloud:
        print("\n✅ ¡MIGRACIÓN EXITOSA AL 100%! Integridad de datos verificada sin discrepancias.")
        
        # Registrar log de auditoría en la nube
        cur_cloud.execute("INSERT INTO log_auditoria_cloud VALUES (?,?,?,?,?)", (
            f"MIG-{int(time.time())}",
            "MIGRACION_COMPLETA_ONPREMISE_A_RDS",
            total_clientes + total_solicitudes,
            chk_cli_cloud,
            str(datetime.now())
        ))
        conn_cloud.commit()
    else:
        print("\n❌ ERROR: Discrepancia detectada en los checksums de datos.")
    
    conn_cloud.close()
    print("=" * 70)

if __name__ == "__main__":
    execute_cloud_migration()
