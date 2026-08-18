# ⚡ PrestaFast Cloud - Plataforma Web de Préstamos Rápidos & Migración a la Nube

![Status](https://img.shields.io/badge/Status-Producci%C3%B3n%20Cloud-success)
![Architecture](https://img.shields.io/badge/Architecture-AWS%20VPC%20%7C%20RDS%20Multi--AZ%20%7C%20ECS-blue)
![Security](https://img.shields.io/badge/Security-AES--256%20%7C%20TLS%201.3-emerald)
![Platform](https://img.shields.io/badge/Platform-Mobile%20First%20%7C%20Light%20%26%20Dark%20Theme-purple)

Proyecto integral de **Gestión de Proyectos de TI, Arquitectura de Software y Cloud Computing**. Desarrolla una plataforma transaccional Fintech para la colocación inmediata de créditos digitales y define la estrategia técnica de migración de la base de datos relacional local (*On-Premise*) hacia la nube (*AWS RDS PostgreSQL*).

---

## 📱 Demostración de la Plataforma Web Móvil

La plataforma cuenta con un diseño optimizado para dispositivos móviles (**Mobile-First**) e incluye:
- 🌓 **Selector de Modo Claro y Modo Oscuro (*Light / Dark Mode*)**.
- 💰 **Cotizador interactivo con Amortización Francesa cuota a cuota**.
- 👤 **Evaluación crediticia instantánea con consulta de DNI y Scoring**.
- 🔒 **Validación de seguridad en 2 Pasos (MFA / SMS OTP)**.
- 🏛️ **Selección de entidad bancaria de desembolso (BCP, BBVA, Interbank, Yape / Plin)**.
- 📜 **Pagaré digital con firma electrónica y comprobante descargable en PDF**.
- ☁️ **Consola de auditoría y monitoreo en tiempo real de transacciones en AWS RDS**.

---

## 📂 Estructura del Repositorio

```
prestamos-rapidos-cloud/
│
├── database/
│   ├── schema.sql                      # Esquema DDL de Base de Datos Cloud (PostgreSQL / MySQL)
│   └── seed_data_local.sql             # Datos semilla iniciales del entorno local
│
├── scripts/
│   └── migrate_to_cloud.py             # Script de migración automatizada con Checksums SHA-256
│
├── web/
│   ├── index.html                      # Aplicación Web Fintech Mobile-First
│   ├── style.css                       # Sistema de diseño con temas Claro y Oscuro
│   └── app.js                          # Motor financiero, validación OTP y sincronización Cloud
│
├── TRABAJO_ENCARGADO_DOCUMENTACION.md  # Informe técnico y académico completo
├── server.py                           # Servidor HTTP local en Python
├── .gitignore                          # Exclusión de binarios y temporales
└── README.md                           # Documentación principal del repositorio
```

---

## 🚀 Guía de Instalación y Ejecución Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/GMPH2007/prestamos-rapidos-cloud.git
cd prestamos-rapidos-cloud
```

### 2. Ejecutar la Migración de Base de Datos a la Nube
Para validar el proceso de extracción, hash de verificación y carga hacia la base de datos Cloud:
```bash
python scripts/migrate_to_cloud.py
```

### 3. Iniciar la Aplicación Web
Para levantar el servidor local y probar la plataforma en tu PC o celular:
```bash
python server.py
```
Abre tu navegador en: **`http://localhost:8000`**

---

## 📋 Resumen del Marco Teórico y Académico

| Componente | Descripción Técnica |
| :--- | :--- |
| **Clasificación de Proyectos TI** | 1. Desarrollo de Software Web, 2. Migración Cloud & DevOps, 3. Ciberseguridad & Cumplimiento Fintech, 4. Integración de APIs. |
| **3 Componentes de Infraestructura** | 1. AWS RDS PostgreSQL (Multi-AZ), 2. AWS ECS Fargate (Cómputo Elástico), 3. AWS VPC + WAF + ALB (Red Privada y Seguridad). |
| **Matriz RACI & Roles** | Project Manager, Cloud Architect/DevOps, DBA/Data Engineer, Desarrollador Full Stack, Especialista en Seguridad/QA. |
| **Ciclo de Vida del Proyecto** | 5 Fases con 1 entregable formal por fase (SRS, Plan Maestro Cloud, Staging App, Certificación QA, Acta Go-Live). |
| **Estrategia de Migración** | Replatform (Lift, Tinker and Shift) con validación de integridad por Checksums criptográficos. |

> Para consultar el informe académico detallado con diagramas Mermaid y matrices completas, revisa el archivo [TRABAJO_ENCARGADO_DOCUMENTACION.md](TRABAJO_ENCARGADO_DOCUMENTACION.md).

---
*Desarrollado con estándares de Ciberseguridad Financiera y Cloud Computing.*
