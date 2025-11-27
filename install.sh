#!/bin/bash

# Umzugsmanagement System - Installation Script
# Automatische Einrichtung des gesamten Systems

set -e

echo "🚀 Umzugsmanagement System - Installation starten..."
echo ""

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funktion für Erfolgsmeldung
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Funktion für Info
info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Funktion für Fehler
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Phase 1: Prüfung der Voraussetzungen
echo "📋 Phase 1: Prüfung der Voraussetzungen..."
echo ""

# PHP Prüfung
if ! command -v php &> /dev/null; then
    error "PHP ist nicht installiert"
    echo "Installieren Sie PHP 8.2 oder höher: brew install php"
    exit 1
fi
success "PHP $(php -v | head -n 1 | awk '{print $2}')"

# Composer Prüfung
if ! command -v composer &> /dev/null; then
    error "Composer ist nicht installiert"
    echo "Installieren Sie Composer: brew install composer"
    exit 1
fi
success "Composer ist installiert"

# Node.js Prüfung
if ! command -v node &> /dev/null; then
    error "Node.js ist nicht installiert"
    echo "Installieren Sie Node.js: brew install node"
    exit 1
fi
success "Node.js $(node --version)"

# npm Prüfung
if ! command -v npm &> /dev/null; then
    error "npm ist nicht installiert"
    exit 1
fi
success "npm $(npm --version)"

echo ""
echo "✅ Alle Voraussetzungen erfüllt!"
echo ""

# Phase 2: Backend Setup
echo "🔧 Phase 2: Backend-Setup..."
echo ""

cd backend

info "Installing PHP dependencies..."
composer install --prefer-dist

info "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    success ".env datei erstellt"
else
    success ".env datei existiert bereits"
fi

info "Generating application key..."
php artisan key:generate

success "Backend-Setup abgeschlossen"
echo ""

cd ..

# Phase 3: Frontend Setup
echo "📱 Phase 3: Frontend-Setup..."
echo ""

cd frontend

info "Installing Node dependencies..."
npm install

info "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    success ".env datei erstellt"
else
    success ".env datei existiert bereits"
fi

success "Frontend-Setup abgeschlossen"
echo ""

cd ..

# Phase 4: Abschluss
echo "================================"
echo "✅ Installation abgeschlossen!"
echo "================================"
echo ""
echo "📝 Nächste Schritte:"
echo ""
echo "1. 🗄️  Datenbank konfigurieren:"
echo "   - Öffne: backend/.env"
echo "   - Setze DB_DATABASE, DB_USERNAME, DB_PASSWORD"
echo ""
echo "2. 🚀 Backend starten (Terminal 1):"
echo "   cd backend && php artisan serve"
echo ""
echo "3. 🌐 Frontend starten (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. 📊 Im Browser öffnen:"
echo "   http://localhost:3000"
echo ""
echo "5. 🔐 Benutzer registrieren und anmelden"
echo ""
echo "📚 Für weitere Informationen siehe:"
echo "   - README.md"
echo "   - SETUP_GUIDE.md"
echo ""
