# BunkMeter 📊 - Safe Bunk Calculator & Attendance Companion

![BunkMeter Banner](https://img.shields.io/badge/Platform-Android%20%7C%20Web-emerald?style=for-the-badge)
![Flutter](https://img.shields.io/badge/Framework-Flutter%20%2F%20React-blue?style=for-the-badge)
![Package ID](https://img.shields.io/badge/Package-com.blazenxt.bunkmeter-teal?style=for-the-badge)

**BunkMeter** is a sleek, modern, offline-first attendance manager and safe bunk predictor app built specifically for college & university students.

---

## ✨ Features

- 🧮 **Safe Bunk Engine:** Calculates exact number of upcoming classes you can safely skip while staying above your minimum target (e.g. 75%).
- 🚨 **Shortage Recovery Alert:** Calculates exact number of consecutive classes required to get back above target.
- 🗓️ **Weekly Timetable Schedule:** Track daily lectures and room locations.
- 📊 **SGPA & CGPA Calculator:** Real-time grade point calculation with course credit scales.
- 📁 **Notes & PYQ Vault:** Organize subject-wise notes and previous year question paper links.
- 💾 **100% Offline & Private:** Zero cloud server costs, data stored safely on device with JSON export/import backup.

---

## 🛠️ Project Structure

```
bunkmeter/
├── src/                    # Web App / PWA Source Code (React + Vite + Tailwind)
├── mobile_flutter/         # Complete Flutter Android App Code
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   ├── providers/
│   │   └── screens/
│   └── pubspec.yaml
└── README.md
```

---

## 🚀 How to Build & Run

### 1. Web Version (React / Vite)
```bash
npm install
npm run dev
```

### 2. Android App (Flutter)
Package Name: `com.blazenxt.bunkmeter`

```bash
cd mobile_flutter
flutter pub get
flutter build appbundle
```

The output `.aab` file will be generated in `build/app/outputs/bundle/release/app-release.aab`.

---

## 📄 License
MIT License - Created by [BlazeNXT](https://github.com/blazenxt)
