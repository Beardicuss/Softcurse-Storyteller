---

# Welcome to Dante Berezinsky's App

## About This Project

This is a cross-platform native mobile application developed by **Dante Berezinsky** using modern mobile technologies.

**Platform:** Native iOS & Android (with Web support)
**Framework:** Expo Router + React Native

This app is built with a production-ready mobile stack used by many of the top apps on the App Store and Google Play.

---

## Developer

**Dante Berezinsky** is a developer focused on building high-quality, scalable, cross-platform mobile applications using React Native and Expo.

---

## Technologies Used

This project is built with:

* **React Native** – Cross-platform mobile framework
* **Expo** – Development platform for React Native
* **Expo Router** – File-based routing system
* **TypeScript** – Type-safe JavaScript
* **React Query** – Server state management
* **Lucide React Native** – Modern icon system

---

## Project Structure

```
├── app/                 # Application screens (Expo Router)
│   ├── (tabs)/          # Tab navigation
│   ├── _layout.tsx      # Root layout
│   └── +not-found.tsx   # 404 screen
├── assets/              # Images & static assets
├── constants/           # App configuration
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

---

## Development Setup

To run this project locally:

### 1. Install dependencies

```bash
bun install
```

### 2. Start development server

```bash
bun run start
```

### 3. Run on Web

```bash
bun run start-web
```

---

## Building for Production

### Android Build

```bash
eas build --platform android
```

### iOS Build

```bash
eas build --platform ios
```

---

## Features

* Cross-platform (iOS, Android, Web)
* Modern mobile UI
* TypeScript support
* Scalable architecture
* Production-ready setup

---

## Author

**Dante Berezinsky**
Mobile Application Developer

---