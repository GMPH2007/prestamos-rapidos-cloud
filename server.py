"""
=============================================================================
SERVIDOR WEB LOCAL Y API REST - PLATAFORMA DE PRÉSTAMOS RÁPIDOS
=============================================================================
Ejecuta el servidor web local para probar la interfaz y los endpoints.
"""

import http.server
import socketserver
import os
import webbrowser
import sys

PORT = 8000
DIRECTORY = "web"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print(f"🌐 Servidor Web de Préstamos Rápidos iniciado en: {url}")
        print("📁 Sirviendo archivos desde la carpeta: web/")
        print("⚡ Presiona Ctrl+C para detener el servidor.")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor detenido.")
            sys.exit(0)

if __name__ == "__main__":
    start_server()
