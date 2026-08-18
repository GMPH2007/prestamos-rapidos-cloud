"""
=============================================================================
CONSULTA DE MOVIMIENTOS Y TRANSACCIONES EN BASE DE DATOS (LOCAL Y CLOUD)
=============================================================================
Este script lista todos los movimientos, préstamos y clientes registrados en
las bases de datos del proyecto (carpeta database/).
"""

import sqlite3
import os

def consultar_movimientos():
    db_path = 'database/cloud_rds_loans.db'
    if not os.path.exists(db_path):
        db_path = 'database/local_loans.db'

    if not os.path.exists(db_path):
        # Si aún no existe, ejecutamos la inicialización
        from migrate_to_cloud import init_local_database, migrate_data
        init_local_database()
        migrate_data()
        db_path = 'database/cloud_rds_loans.db'

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("\n" + "="*85)
    print(f" 📊 REPORTE DE MOVIMIENTOS Y PRÉSTAMOS REGISTRADOS EN: {db_path}")
    print("="*85)

    # Consulta de solicitudes de préstamo
    query = """
    SELECT 
        s.id_solicitud,
        c.nombres || ' ' || c.apellidos AS titular,
        c.dni,
        s.monto_solicitado,
        s.plazo_meses,
        s.cuota_mensual,
        s.estado_solicitud,
        s.fecha_solicitud
    FROM solicitudes_prestamo s
    JOIN clientes c ON s.id_cliente = c.id_cliente
    ORDER BY s.fecha_solicitud DESC;
    """

    cursor.execute(query)
    rows = cursor.fetchall()

    print(f"\nTotal de Préstamos Registrados: {len(rows)}\n")
    print(f"{'N° OP':<12} | {'TITULAR (DNI)':<32} | {'MONTO':<12} | {'PLAZO':<6} | {'CUOTA':<10} | {'ESTADO'}")
    print("-" * 95)

    for r in rows:
        op, titular, dni, monto, plazo, cuota, estado, fecha = r
        titular_dni = f"{titular} ({dni})"
        monto_fmt = f"S/ {monto:,.2f}"
        cuota_fmt = f"S/ {cuota:,.2f}"
        print(f"{op:<12} | {titular_dni:<32} | {monto_fmt:<12} | {plazo} m   | {cuota_fmt:<10} | {estado}")

    print("\n" + "="*85)

    # Consulta de Clientes
    print(" 👥 CLIENTES EN BASE DE DATOS")
    print("="*85)
    cursor.execute("SELECT id_cliente, dni, nombres || ' ' || apellidos, ingreso_mensual, score_crediticio, estado FROM clientes;")
    clientes = cursor.fetchall()
    for cl in clientes:
        cid, dni, nom, ing, score, est = cl
        print(f" • [{cid}] {nom:<25} DNI: {dni} | Ingresos: S/ {ing:,.2f} | Score: {score}/850 ({est})")

    print("="*85 + "\n")
    conn.close()

if __name__ == "__main__":
    consultar_movimientos()
