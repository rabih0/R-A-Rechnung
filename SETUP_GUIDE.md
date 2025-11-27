# Umzugsmanagement System - Setup Guide

Komplette Schritt-für-Schritt Anleitung zum Einrichten der Umzugsmanagement-Anwendung.

## 📋 Voraussetzungen

### Für Backend:
- PHP >= 8.2 (überprüfen: `php -v`)
- Composer (überprüfen: `composer --version`)
- MySQL >= 5.7 oder MariaDB (überprüfen: `mysql --version`)

### Für Frontend:
- Node.js >= 16 (überprüfen: `node -v`)
- npm >= 8 (überprüfen: `npm -v`)

## 🔧 Installation - Schritt für Schritt

### Phase 1: Backend Einrichtung

#### 1.1 PHP und Composer installieren (macOS)
```bash
# Homebrew verwenden (falls nicht installiert: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)")

# PHP installieren
brew install php

# Composer installieren
brew install composer
```

#### 1.2 Backend Setup
```bash
# In backend Verzeichnis navigieren
cd backend

# Abhängigkeiten installieren
composer install

# .env Datei erstellen
cp .env.example .env

# Anwendungsschlüssel generieren
php artisan key:generate
```

#### 1.3 Datenbank konfigurieren

Öffnen Sie `backend/.env` und passen Sie folgende Werte an:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=umzugs_app
DB_USERNAME=root
DB_PASSWORD=

# JWT Authentifizierung
JWT_SECRET=ChangeMe!
JWT_ALGORITHM=HS256
```

#### 1.4 Datenbankmigration
```bash
# Migrations ausführen
php artisan migrate

# (Optional) Test-Daten einfügen
php artisan db:seed
```

#### 1.5 Backend Server starten
```bash
# Development Server auf Port 8000 starten
php artisan serve

# Alternativ auf anderen Port:
php artisan serve --port=8001
```

✅ Backend läuft jetzt auf: http://localhost:8000

---

### Phase 2: Frontend Einrichtung

#### 2.1 Node.js und npm installieren (macOS)
```bash
# Homebrew verwenden
brew install node
```

#### 2.2 Frontend Setup
```bash
# In frontend Verzeichnis navigieren
cd frontend

# Dependencies installieren
npm install
```

#### 2.3 Umgebungsvariablen konfigurieren

Erstellen Sie `frontend/.env` Datei basierend auf `.env.example`:

```env
VITE_API_URL=http://localhost:8000/api
```

#### 2.4 Frontend Dev Server starten
```bash
# Development Server auf Port 3000 starten
npm run dev
```

✅ Frontend läuft jetzt auf: http://localhost:3000

---

## 🧪 Testing der Installation

### 1. Backend API Test
```bash
# Health Check
curl http://localhost:8000/api

# Registrierung
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Benutzer",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### 2. Frontend Zugang
Öffnen Sie im Browser: http://localhost:3000

**Standard-Login Daten (nach Registrierung):**
- E-Mail: test@example.com
- Passwort: password123

---

## 🎯 Erstes Projekt einrichten

### 1. Kunde erstellen
- Navigiere zu "Kunden"
- Klick auf "+ Neuer Kunde"
- Fülle die Formulardaten aus
- Speichere

### 2. Vertrag erstellen
- Navigiere zu "Verträge"
- Klick auf "+ Neuer Vertrag"
- Wähle einen Kunden
- Fülle Adresse, Entfernung, Etagen ein
- Klick "Preis berechnen"
- Speichere

### 3. Rechnung erstellen
- Navigiere zu "Rechnungen"
- Klick auf "+ Neue Rechnung"
- Wähle einen Kunden
- Füge Rechnungspositionen hinzu
- Speichere

### 4. Termine planen
- Navigiere zu "Termine"
- Klick auf "+ Neuer Termin"
- Wähle einen Kunden
- Fülle Datum und Uhrzeit ein
- Speichere

---

## 🐛 Häufige Probleme und Lösungen

### Problem: "php: command not found"
**Lösung:**
```bash
# PHP Pfad überprüfen
which php

# Falls nicht installiert:
brew install php@8.2
```

### Problem: "composer: command not found"
**Lösung:**
```bash
# Composer neu installieren
brew install composer

# Oder manuell:
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

### Problem: "npm: command not found"
**Lösung:**
```bash
# Node.js neu installieren
brew install node

# oder via nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### Problem: "CORS Error" im Frontend
**Lösung:** Stelle sicher, dass in `backend/.env`:
```env
APP_URL=http://localhost:8000
```

Und dass der CORS Middleware aktiviert ist.

### Problem: "Database Connection Error"
**Lösung:**
```bash
# MySQL starten
brew services start mysql

# Datenbank erstellen
mysql -u root -e "CREATE DATABASE umzugs_app;"

# Migration erneut ausführen
php artisan migrate:fresh
```

---

## 📦 Production Deployment

### Backend Deployment (Beispiel: Heroku)

```bash
# 1. Heroku CLI installieren
brew tap heroku/brew && brew install heroku

# 2. Heroku App erstellen
heroku create your-app-name

# 3. Umgebungsvariablen setzen
heroku config:set APP_KEY="$(php artisan key:generate --show)"
heroku config:set APP_ENV=production
heroku config:set APP_DEBUG=false

# 4. Database Add-On hinzufügen
heroku addons:create cleardb:ignite

# 5. Migrations ausführen
heroku run php artisan migrate

# 6. Deployen
git push heroku main
```

### Frontend Deployment (Beispiel: Vercel)

```bash
# 1. Vercel CLI installieren
npm install -g vercel

# 2. Production Build erstellen
npm run build

# 3. Zu Vercel deployen
vercel

# 4. Umgebungsvariablen setzen
vercel env add VITE_API_URL https://your-backend-url.herokuapp.com/api
```

---

## 📚 Zusätzliche Ressourcen

- [Laravel Dokumentation](https://laravel.com/docs)
- [React Dokumentation](https://react.dev)
- [Tailwind CSS Dokumentation](https://tailwindcss.com)
- [MySQL Dokumentation](https://dev.mysql.com/doc/)

---

## ✅ Checkliste vor Production

- [ ] Alle Environment Variablen gesetzt
- [ ] Datenbank Backups konfiguriert
- [ ] HTTPS aktiviert
- [ ] CORS korrekt konfiguriert
- [ ] API Rate Limiting aktiviert
- [ ] Error Logging aktiviert
- [ ] Tests durchgeführt
- [ ] Performance optimiert

---

## 🆘 Support

Bei Problemen:
1. Überprüfe die Logs: `php artisan tail`
2. Leere den Cache: `php artisan cache:clear`
3. Führe Migrations erneut aus: `php artisan migrate:fresh --seed`

---

**Viel Erfolg mit dem Umzugsmanagement System! 🚀**
