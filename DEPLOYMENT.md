# Huzefa Airlines — Cross-Platform Web & Android Deployment Guide

This repository contains the single shared codebase for **Huzefa Airlines**, working across:
- **Desktop Web Browsers**
- **Mobile Web Browsers (PWA)**
- **Android Smartphones (Native APK via Capacitor)**

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Local Setup & Execution](#2-local-setup--execution)
3. [MySQL Database Configuration](#3-mysql-database-configuration)
4. [Environment Variables](#4-environment-variables)
5. [Progressive Web App (PWA) Build & Install](#5-progressive-web-app-pwa-build--install)
6. [Android App Packaging (Capacitor APK)](#6-android-app-packaging-capacitor-apk)
7. [Google Play Store Publishing](#7-google-play-store-publishing)
8. [Web Deployment (Vercel / Netlify / Hostinger)](#8-web-deployment-vercel--netlify--hostinger)

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MySQL**: v8.0 or higher
- **Android Studio**: Installed with Android SDK 33+ (for Android APK generation)

---

## 2. Local Setup & Execution

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm run dev
```

The application will launch at: `http://localhost:5000`

---

## 3. MySQL Database Configuration

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or CLI).
2. Execute the full SQL schema file provided in `sql/huzefa_airlines.sql`:

```sql
SOURCE sql/huzefa_airlines.sql;
```

This creates:
- Database: `huzefa_airlines`
- Table: `users` (with seeded admin `huzefaairline@gmail.com` and customer `guest@huzefaairlines.com`)
- Table: `bookings` (with initial flight bookings)

---

## 4. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=huzefa_airlines
JWT_SECRET=huzefa_airlines_jwt_secret_key_2026_super_secure
NODE_ENV=development
```

---

## 5. Progressive Web App (PWA) Build & Install

The application includes `manifest.json` and `service-worker.js` out of the box.

### Testing PWA on Mobile Chrome:
1. Host the website or access via local network IP (`http://<your-ip>:5000`).
2. Open Chrome on Android.
3. Tap the **Install App** button or Chrome Menu `⋮` → **Add to Home Screen**.
4. The app will install as a native standalone PWA on the home screen.

---

## 6. Android App Packaging (Capacitor APK)

To build a native Android APK using Capacitor:

### Step 1: Install Capacitor Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Initialize Capacitor Project
```bash
npx cap init "Huzefa Airlines" com.huzefa.airlines --web-dir .
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Sync Assets to Android Platform
```bash
npx cap sync
```

### Step 5: Open Project in Android Studio
```bash
npx cap open android
```

### Step 6: Generate Signed APK in Android Studio
1. In Android Studio, select **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
2. The generated `.apk` file will be located in: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 7. Google Play Store Publishing

1. In Android Studio, go to **Build** → **Generate Signed Bundle / APK**.
2. Select **Android App Bundle (.aab)**.
3. Create or select your `.jks` keystore file.
4. Build the release `.aab` file.
5. Log in to [Google Play Console](https://play.google.com/console).
6. Create a new app under Package Name: `com.huzefa.airlines`.
7. Upload the `.aab` file under Production Release and complete store listings.

---

## 8. Web Deployment (Vercel / Netlify / Hostinger)

### Deploying Node.js Backend & API to Railway / Render:
1. Connect your GitHub repository to Railway or Render.
2. Set Environment Variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `JWT_SECRET`).
3. Set start command: `node server.js`.

### Deploying Static Frontend to Vercel / Netlify:
1. Connect repo to Vercel/Netlify.
2. Set Root Directory: `./`.
3. Set Build Command: `echo "Build Ready"`.

---

© 2026 Huzefa Airlines Engineering. All Rights Reserved.
