"""
=============================================================================
GENERADOR DE IMÁGENES Y DIAGRAMAS VISUALES DE ALTA RESOLUCIÓN
=============================================================================
Crea gráficos visuales profesionales para insertar en la documentación Word y PDF.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_rounded_rectangle(draw, xy, radius, fill=None, outline=None, width=1):
    """Dibuja un rectángulo con bordes redondeados."""
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def generate_architecture_diagram():
    """Genera el diagrama visual de Arquitectura Cloud AWS."""
    w, h = 1000, 520
    img = Image.new("RGB", (w, h), color="#0F172A")
    draw = ImageDraw.Draw(img)

    # Título Principal
    create_rounded_rectangle(draw, (30, 20, 970, 70), 10, fill="#1E293B", outline="#3B82F6", width=2)
    draw.text((360, 32), "ARQUITECTURA CLOUD SEGURA - AWS MULTI-AZ", fill="#FFFFFF")

    # 1. Capa Cliente / Internet
    create_rounded_rectangle(draw, (50, 110, 240, 470), 12, fill="#1E293B", outline="#64748B", width=1)
    draw.text((70, 130), "🌐 CAPA CLIENTE", fill="#93C5FD")
    create_rounded_rectangle(draw, (70, 180, 220, 260), 8, fill="#0F172A", outline="#3B82F6")
    draw.text((90, 205), "📱 Móvil (App Web)", fill="#FFFFFF")
    draw.text((90, 225), "💻 PC / Laptop", fill="#94A3B8")

    create_rounded_rectangle(draw, (70, 300, 220, 420), 8, fill="#0F172A", outline="#10B981")
    draw.text((85, 320), "🔒 Protocolo HTTPS", fill="#34D399")
    draw.text((85, 350), "• Certificado TLS 1.3", fill="#CBD5E1")
    draw.text((85, 375), "• Cifrado de Extremo", fill="#CBD5E1")

    # Flecha 1
    draw.line([(240, 290), (310, 290)], fill="#3B82F6", width=4)
    draw.polygon([(310, 285), (325, 290), (310, 295)], fill="#3B82F6")

    # 2. VPC Pública (WAF + ALB)
    create_rounded_rectangle(draw, (330, 110, 610, 470), 12, fill="#1E293B", outline="#3B82F6", width=2)
    draw.text((350, 130), "🛡️ SUBRED PÚBLICA & WAF", fill="#60A5FA")
    
    create_rounded_rectangle(draw, (350, 180, 590, 280), 8, fill="#0F172A", outline="#3B82F6")
    draw.text((370, 200), "🔥 AWS WAF (Firewall Web)", fill="#F59E0B")
    draw.text((370, 230), "• Filtro Anti-DDoS y Botnet", fill="#CBD5E1")
    draw.text((370, 250), "• Bloqueo SQLi y XSS", fill="#CBD5E1")

    create_rounded_rectangle(draw, (350, 310, 590, 430), 8, fill="#0F172A", outline="#3B82F6")
    draw.text((370, 330), "⚖️ Application Load Balancer (ALB)", fill="#60A5FA")
    draw.text((370, 360), "• Terminación SSL/TLS", fill="#CBD5E1")
    draw.text((370, 385), "• Distribución Balanceada", fill="#CBD5E1")

    # Flecha 2
    draw.line([(610, 290), (680, 290)], fill="#10B981", width=4)
    draw.polygon([(680, 285), (695, 290), (680, 295)], fill="#10B981")

    # 3. VPC Privada Aislada (ECS Cómputo + RDS PostgreSQL)
    create_rounded_rectangle(draw, (700, 110, 960, 470), 12, fill="#1E293B", outline="#10B981", width=2)
    draw.text((720, 130), "🔐 SUBRED PRIVADA AISLADA", fill="#34D399")

    create_rounded_rectangle(draw, (720, 180, 940, 280), 8, fill="#0F172A", outline="#10B981")
    draw.text((740, 200), "⚡ AWS ECS Fargate", fill="#34D399")
    draw.text((740, 230), "• API REST de Créditos", fill="#CBD5E1")
    draw.text((740, 250), "• Auto-escalado Elástico", fill="#CBD5E1")

    create_rounded_rectangle(draw, (720, 310, 940, 440), 8, fill="#0F172A", outline="#10B981")
    draw.text((740, 325), "🗄️ AWS RDS PostgreSQL", fill="#34D399")
    draw.text((740, 350), "• Multi-AZ (Réplica Síncrona)", fill="#60A5FA")
    draw.text((740, 375), "• Cifrado KMS AES-256", fill="#F59E0B")
    draw.text((740, 400), "• Sin IP Pública Externa", fill="#CBD5E1")

    output_path = "diagrama_arquitectura_cloud.png"
    img.save(output_path)
    print(f"Diagrama 1 guardado: {output_path}")

def generate_lifecycle_diagram():
    """Genera el diagrama del Ciclo de Vida y Entregables."""
    w, h = 1000, 400
    img = Image.new("RGB", (w, h), color="#0F172A")
    draw = ImageDraw.Draw(img)

    # Título
    create_rounded_rectangle(draw, (30, 20, 970, 70), 10, fill="#1E293B", outline="#10B981", width=2)
    draw.text((330, 32), "CICLO DE VIDA DEL PROYECTO - 5 FASES Y ENTREGABLES", fill="#FFFFFF")

    fases = [
        ("FASE 1", "Inicio & Requerimientos", "Documento SRS & Project Charter", "#2563EB"),
        ("FASE 2", "Diseño & Arquitectura", "Plan Maestro Cloud & Migración BD", "#0D9488"),
        ("FASE 3", "Construcción & Migración", "Web Funcional & BD en Staging", "#16A34A"),
        ("FASE 4", "Pruebas & Seguridad", "Certificación QA & Auditoría OWASP", "#D97706"),
        ("FASE 5", "Despliegue & Cierre", "Acta Go-Live & Manual Operaciones", "#7C3AED")
    ]

    box_w = 165
    gap = 22
    start_x = 40

    for i, (num, title, entregable, color) in enumerate(fases):
        x1 = start_x + i * (box_w + gap)
        x2 = x1 + box_w
        
        # Tarjeta de fase
        create_rounded_rectangle(draw, (x1, 100, x2, 350), 10, fill="#1E293B", outline=color, width=2)
        
        # Header fase
        create_rounded_rectangle(draw, (x1+5, 105, x2-5, 140), 6, fill=color)
        draw.text((x1 + 55, 115), num, fill="#FFFFFF")
        
        # Título
        draw.text((x1 + 10, 160), title.replace(" & ", "\n& "), fill="#FFFFFF")
        
        # Separador
        draw.line([(x1 + 10, 220), (x2 - 10, 220)], fill="#475569", width=1)
        
        # Entregable
        draw.text((x1 + 10, 230), "📌 Entregable:", fill="#FBBF24")
        draw.text((x1 + 10, 260), entregable.replace(" & ", "\n& "), fill="#93C5FD")

        # Flecha conectora
        if i < 4:
            arrow_x = x2 + 5
            draw.text((arrow_x + 2, 210), "➔", fill="#64748B")

    output_path = "diagrama_ciclo_vida.png"
    img.save(output_path)
    print(f"Diagrama 2 guardado: {output_path}")

def generate_app_flow_diagram():
    """Genera el diagrama del flujo transaccional móvil."""
    w, h = 1000, 360
    img = Image.new("RGB", (w, h), color="#0F172A")
    draw = ImageDraw.Draw(img)

    create_rounded_rectangle(draw, (30, 20, 970, 70), 10, fill="#1E293B", outline="#3B82F6", width=2)
    draw.text((340, 32), "FLUJO TRANSACCIONAL DE LA APLICACIÓN MÓVIL", fill="#FFFFFF")

    pasos = [
        ("Paso 1", "Cotización Online", "• Monto y Plazo\n• Amortización Francesa\n• Desglose de Cuota", "#2563EB"),
        ("Paso 2", "Scoring & DNI", "• DNI del Solicitante\n• Ingresos y Motivo\n• Consulta Buró Cloud", "#0D9488"),
        ("Paso 3", "Seguridad OTP", "• Doble Factor (MFA)\n• Código SMS 4 Dígitos\n• Temporizador 45s", "#D97706"),
        ("Paso 4", "Desembolso", "• BCP / BBVA / Yape\n• Cuenta de Abono\n• Contrato Digital", "#16A34A"),
        ("Paso 5", "Comprobante", "• Ticket de Operación\n• Hash Criptográfico\n• Auditoría AWS RDS", "#7C3AED")
    ]

    box_w = 165
    gap = 22
    start_x = 40

    for i, (p_num, p_title, p_desc, color) in enumerate(pasos):
        x1 = start_x + i * (box_w + gap)
        x2 = x1 + box_w
        
        create_rounded_rectangle(draw, (x1, 100, x2, 320), 10, fill="#1E293B", outline=color, width=2)
        create_rounded_rectangle(draw, (x1+5, 105, x2-5, 140), 6, fill=color)
        draw.text((x1 + 55, 115), p_num, fill="#FFFFFF")
        
        draw.text((x1 + 15, 155), p_title, fill="#FFFFFF")
        draw.line([(x1 + 10, 185), (x2 - 10, 185)], fill="#475569", width=1)
        draw.text((x1 + 12, 200), p_desc, fill="#CBD5E1")

        if i < 4:
            arrow_x = x2 + 4
            draw.text((arrow_x + 2, 195), "➔", fill="#64748B")

    output_path = "diagrama_flujo_app.png"
    img.save(output_path)
    print(f"Diagrama 3 guardado: {output_path}")

def generate_migration_diagram():
    """Genera el diagrama de Migración de Base de Datos."""
    w, h = 1000, 360
    img = Image.new("RGB", (w, h), color="#0F172A")
    draw = ImageDraw.Draw(img)

    create_rounded_rectangle(draw, (30, 20, 970, 70), 10, fill="#1E293B", outline="#F59E0B", width=2)
    draw.text((320, 32), "ESTRATEGIA TÉCNICA DE MIGRACIÓN (REPLATFORM & CHECKSUMS)", fill="#FFFFFF")

    # Bloque 1: Local
    create_rounded_rectangle(draw, (50, 100, 280, 310), 10, fill="#1E293B", outline="#64748B", width=2)
    draw.text((70, 120), "🗄️ 1. BD LOCAL (ORIGEN)", fill="#94A3B8")
    draw.text((70, 150), "• Servidor On-Premise\n• Extracción de DDL\n• Volcado de Datos Sanitizado\n• Clientes & Préstamos", fill="#CBD5E1")
    create_rounded_rectangle(draw, (70, 240, 260, 290), 6, fill="#0F172A", outline="#64748B")
    draw.text((80, 255), "Hash SHA-256 Local", fill="#60A5FA")

    # Flecha 1
    draw.line([(280, 205), (370, 205)], fill="#F59E0B", width=4)
    draw.polygon([(370, 200), (385, 205), (370, 210)], fill="#F59E0B")

    # Bloque 2: Transmisión y Validación
    create_rounded_rectangle(draw, (390, 100, 630, 310), 10, fill="#1E293B", outline="#F59E0B", width=2)
    draw.text((410, 120), "⚡ 2. SCRIPT DE MIGRACIÓN", fill="#F59E0B")
    draw.text((410, 150), "• scripts/migrate_to_cloud.py\n• Túnel Cifrado SSL/TLS\n• Carga por Lotes\n• Verificación Checksums", fill="#CBD5E1")
    create_rounded_rectangle(draw, (410, 240, 610, 290), 6, fill="#0F172A", outline="#F59E0B")
    draw.text((420, 255), "Comparación de Checksum", fill="#FBBF24")

    # Flecha 2
    draw.line([(630, 205), (710, 205)], fill="#10B981", width=4)
    draw.polygon([(710, 200), (725, 205), (710, 210)], fill="#10B981")

    # Bloque 3: Cloud Destino
    create_rounded_rectangle(draw, (730, 100, 950, 310), 10, fill="#1E293B", outline="#10B981", width=2)
    draw.text((750, 120), "☁️ 3. AWS RDS (DESTINO)", fill="#34D399")
    draw.text((750, 150), "• PostgreSQL Multi-AZ\n• Subred Privada Aislada\n• Cifrado KMS AES-256\n• Integridad al 100%", fill="#CBD5E1")
    create_rounded_rectangle(draw, (750, 240, 930, 290), 6, fill="#0F172A", outline="#10B981")
    draw.text((760, 255), "Hash SHA-256 Coincidente ✅", fill="#34D399")

    output_path = "diagrama_migracion_bd.png"
    img.save(output_path)
    print(f"Diagrama 4 guardado: {output_path}")

if __name__ == "__main__":
    generate_architecture_diagram()
    generate_lifecycle_diagram()
    generate_app_flow_diagram()
    generate_migration_diagram()
    print("¡Todas las imágenes y diagramas fueron generados exitosamente!")
