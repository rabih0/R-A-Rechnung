# Umzugsmanagement System (Moving Management System)

Ein vollständiges, integriertes System zur Verwaltung von Umzügen, Kunden, Verträgen, Rechnungen und Terminen. Das System verfügt über einen Laravel-Backend und einen React-Frontend mit dynamischer Preiskalkulation.

## 🎯 Features

- ✅ **Kundenverwaltung**: Verwaltung von Kundendaten, Adressen und Kontaktinformationen
- ✅ **Vertragsverwaltung**: Erstellung und Verwaltung von Umzugsverträgen
- ✅ **Rechnungssystem**: Automatische Rechnungserstellung und -verwaltung
- ✅ **Terminplanung**: Kalenderansicht mit Terminverwaltung
- ✅ **Dynamische Preiskalkulation**: Intelligente Preisberechnung basierend auf Möbeln, Entfernung und anderen Faktoren
- ✅ **Benutzerverandung**: Authentifizierung und Benutzerverwaltung
- ✅ **Einstellungen**: Konfigurierbare Preisebenen und Unternehmenseinstellungen
- ✅ **Dashboard**: Echtzeit-Statistiken und Übersicht

## 🏗️ Architektur

```
rech/
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Models/         # Eloquent Modelle
│   │   ├── Http/
│   │   │   └── Controllers/ # API Controller
│   │   └── Services/        # Geschäftslogik
│   ├── database/
│   │   └── migrations/      # Datenbankmigrations
│   ├── routes/
│   │   └── api.php          # API Routen
│   ├── composer.json        # PHP Dependencies
│   └── .env.example         # Umgebungsvariablen
│
└── frontend/                # React Frontend
    ├── src/
    │   ├── pages/           # React Pages
    │   ├── components/      # React Komponenten
    │   ├── services/        # API Services
    │   ├── store/           # Zustand State Management
    │   └── App.jsx          # Hauptanwendung
    ├── package.json         # Node Dependencies
    ├── vite.config.js       # Vite Konfiguration
    └── tailwind.config.js   # Tailwind CSS Konfiguration
```

## 📋 Anforderungen

### Backend
- PHP >= 8.2
- Composer
- MySQL >= 5.7

### Frontend
- Node.js >= 16
- npm oder yarn

## 🚀 Installation

### 1. Backend Setup

```bash
# In das backend Verzeichnis navigieren
cd backend

# Composer Dependencies installieren
composer install

# .env Datei erstellen
cp .env.example .env

# Application Key generieren
php artisan key:generate

# Datenbankmigrationen ausführen
php artisan migrate

# (Optional) Datenbank mit Testdaten füllen
php artisan db:seed

# Development Server starten
php artisan serve
```

Die API läuft dann auf: http://localhost:8000/api

### 2. Frontend Setup

```bash
# In das frontend Verzeichnis navigieren
cd frontend

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Anwendung läuft dann auf: http://localhost:3000

## 🔐 Authentifizierung

### Registrierung
```
POST /api/register
{
  "name": "Benutzer Name",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

### Anmeldung
```
POST /api/login
{
  "email": "user@example.com",
  "password": "password"
}
```

Die Antwort enthält einen `access_token`, der für alle weiteren Anfragen verwendet wird.

## 📚 API Endpoints

### Kunden
- `GET /api/customers` - Alle Kunden abrufen
- `POST /api/customers` - Neuen Kunden erstellen
- `GET /api/customers/{id}` - Einzelnen Kunden abrufen
- `PUT /api/customers/{id}` - Kunden aktualisieren
- `DELETE /api/customers/{id}` - Kunden löschen

### Verträge
- `GET /api/contracts` - Alle Verträge abrufen
- `POST /api/contracts` - Neuen Vertrag erstellen
- `GET /api/contracts/{id}` - Einzelnen Vertrag abrufen
- `PUT /api/contracts/{id}` - Vertrag aktualisieren
- `DELETE /api/contracts/{id}` - Vertrag löschen
- `POST /api/contracts/calculate-price` - Preis berechnen

### Rechnungen
- `GET /api/invoices` - Alle Rechnungen abrufen
- `POST /api/invoices` - Neue Rechnung erstellen
- `GET /api/invoices/{id}` - Einzelne Rechnung abrufen
- `PUT /api/invoices/{id}` - Rechnung aktualisieren
- `DELETE /api/invoices/{id}` - Rechnung löschen
- `POST /api/invoices/{id}/items` - Rechnungsposition hinzufügen

### Termine
- `GET /api/appointments` - Alle Termine abrufen
- `POST /api/appointments` - Neuen Termin erstellen
- `GET /api/appointments/{id}` - Einzelnen Termin abrufen
- `PUT /api/appointments/{id}` - Termin aktualisieren
- `DELETE /api/appointments/{id}` - Termin löschen
- `GET /api/appointments/calendar-events` - Termine für Kalender

### Einstellungen
- `GET /api/settings/pricing` - Preiseinstellungen abrufen
- `POST /api/settings/pricing` - Preiseinstellungen aktualisieren
- `GET /api/settings/company` - Unternehmenseinstellungen abrufen
- `POST /api/settings/company` - Unternehmenseinstellungen aktualisieren
- `GET /api/settings/dashboard-stats` - Dashboard Statistiken

## 💰 Preiskalkulationsmodul

Das System verwendet einen erweiterten Preiskalkulationsmotor, der folgende Faktoren berücksichtigt:

- **Grundpreis**: Basisbetrag pro Umzug
- **Fahrtkosten**: Berechnet basierend auf Entfernung in km
- **Etagekosten**: Aufschlag pro Etage (Von- und Bis-Adresse)
- **Möbelpreise**: Unterschiedliche Preise für verschiedene Möbeltypen und Größen
- **Preisebenen**: Mittel, Über Mittel, Hoch
- **Montage/Demontage**: Zusätzliche Kosten für Auf- und Abbau

### Konfigurierbare Möbeltypen
- Bett (M, L, XL, XXL)
- Sofa (M, L, XL, XXL)
- Küchenschrank (M, L, XL, XXL)
- Waschmaschine (M, L, XL, XXL)
- Kartons (M, L, XL, XXL)
- Heavy Item (M, L, XL, XXL)
- Fahrdienst
- Etagenaufschlag
- Arbeitsstunde
- Und weitere spezielle Kategorien

## 🗄️ Datenbankschema

### Haupttabellen
- `users` - Systembenutzer
- `customers` - Kundendaten
- `contracts` - Umzugsverträge
- `contract_items` - Möbelitems in Verträgen
- `invoices` - Rechnungen
- `invoice_items` - Rechnungspositionen
- `appointments` - Termine und Ereignisse
- `pricing_settings` - Konfigurierbare Preiseinstellungen

## 📱 Frontend Technologien

- **React 18**: UI Framework
- **React Router**: Navigation
- **Axios**: HTTP Client
- **Zustand**: State Management
- **Tailwind CSS**: Styling
- **React Calendar**: Kalenderkomponente
- **React Hot Toast**: Benachrichtigungen

## 🔧 Backend Technologien

- **Laravel 11**: Web Framework
- **MySQL**: Datenbank
- **Sanctum**: API Authentication
- **Eloquent ORM**: Datenbankabstraktion

## 📦 Deployment

### Backend Deployment (Heroku/Production)

```bash
# .env Datei mit Produktionseinstellungen erstellen
cp .env.example .env

# Produktionsparameter setzen
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Migrationen ausführen
php artisan migrate --force

# Cache konfiguration
php artisan config:cache
php artisan route:cache
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Production Build erstellen
npm run build

# Zu Vercel/Netlify deployen
# oder in dist/ Ordner enthaltenen Code manuell uploaden
```

## 🛠️ Entwicklung

### Lokale Entwicklung starten

Terminal 1 - Backend:
```bash
cd backend
php artisan serve
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Code Linting

**Backend:**
```bash
# PHP Code Style Prüfung
composer run-script lint
```

**Frontend:**
```bash
npm run lint
npm run lint:fix
```

## 📝 Lizenz

Dieses Projekt ist lizenziert unter der MIT Lizenz.

## 👤 Autor

Umzugsmanagement System - Ein vollständiges Verwaltungssystem für Umzugsunternehmen.

## 📞 Support

Für Probleme oder Fragen bitte ein Issue erstellen oder den Support kontaktieren.

---

**Version**: 1.0.0  
**Letztes Update**: November 2024
# R-A-Rechnung
