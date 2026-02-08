#!/bin/bash

# 🚀 Scripts Útiles para Pet History

echo "======================================"
echo "   Pet History - Setup Automático"
echo "======================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo "1️⃣  Verificando Node.js..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js instalado: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js no está instalado"
    echo "   Por favor instala Node.js desde https://nodejs.org"
    exit 1
fi

# 2. Verificar npm
echo ""
echo "2️⃣  Verificando npm..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm instalado: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm no está instalado"
    exit 1
fi

# 3. Instalar dependencias
echo ""
echo "3️⃣  Instalando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  node_modules ya existe. ¿Reinstalar? (s/n)"
    read -r response
    if [[ "$response" == "s" ]]; then
        rm -rf node_modules package-lock.json
        npm install
    else
        echo "   Saltando instalación..."
    fi
else
    npm install
fi

# 4. Verificar archivo .env
echo ""
echo "4️⃣  Verificando archivo .env..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Archivo .env encontrado"
    
    # Verificar que tenga las variables necesarias
    if grep -q "REACT_APP_GOOGLE_CLIENT_ID" .env && \
       grep -q "REACT_APP_SPREADSHEET_ID" .env && \
       grep -q "REACT_APP_DRIVE_FOLDER_ID" .env; then
        echo -e "${GREEN}✓${NC} Variables de entorno configuradas"
    else
        echo -e "${YELLOW}⚠${NC}  Faltan algunas variables en .env"
        echo "   Por favor revisa .env.example"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Archivo .env no encontrado"
    echo "   Creando desde .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC}  Por favor edita .env con tus credenciales"
fi

# 5. Resumen
echo ""
echo "======================================"
echo "          Resumen del Setup"
echo "======================================"
echo ""
echo -e "${GREEN}✓${NC} Node.js: OK"
echo -e "${GREEN}✓${NC} npm: OK"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencias: OK"
else
    echo -e "${RED}✗${NC} Dependencias: FALTA INSTALAR"
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env: OK"
else
    echo -e "${RED}✗${NC} .env: FALTA CONFIGURAR"
fi

echo ""
echo "======================================"
echo "        Próximos Pasos"
echo "======================================"
echo ""
echo "1. Configurar Google Cloud Console"
echo "   Ver: README.md (sección Configuración Inicial)"
echo ""
echo "2. Editar archivo .env con tus credenciales"
echo ""
echo "3. Iniciar la aplicación:"
echo "   ${GREEN}npm start${NC}"
echo ""
echo "======================================"
echo ""

# Preguntar si quiere abrir documentación
echo "¿Abrir README.md? (s/n)"
read -r open_readme
if [[ "$open_readme" == "s" ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open README.md
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open README.md
    else
        echo "Por favor abre README.md manualmente"
    fi
fi

echo ""
echo "¡Setup completado! 🎉"
