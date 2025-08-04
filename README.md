## 📜 Overview

**ZeroLeaks** is a highly secure, fully client-side password analysis and generation tool designed for developers, security researchers, and privacy-conscious users. It combines cryptographic best practices, entropy-based analysis, and data breach intelligence  to help users understand and improve their password hygiene.

Built with modern technologies including **React 19**, **TypeScript**, **TailwindCSS**, and **Vite**, it features a sleek, responsive UI, deep security insights, and real-time visualizations.

---

## ✨ Features

### 🔍 Password Analyzer

* Real-time strength evaluation (score 0–4)
* Entropy-based complexity measurement
* Crack time estimation for multiple attack scenarios
* Suggestions and warnings for weak passwords
* Checks if password appears in known data breaches via the Pwned Passwords API (SHA-1 k-Anonymity)

### 🔐 Secure Password Generator

* Generates military-grade random passwords (configurable length, symbols, digits, case)
* Passphrase mode using word-based memorable phrases
* Fisher-Yates shuffle for true randomness
* Auto-analyzes strongest password from the batch

### 📊 Security Visualization

* Radar chart displaying:

  * Password entropy
  * Unique characters
  * Crack resistance
  * Reuse risk
  * Overall score

### 🧠 Local Password History

* Non-reversible hashed history (SHA-1 hex digest simulation)
* Tracks past scores, entropy, timestamps
* Stored in memory for maximum privacy (not saved to disk)

---

## 🚀 Tech Stack

| Layer           | Stack / Library                  |
| --------------- | -------------------------------- |
| Frontend        | React 19 + TypeScript            |
| Styling         | TailwindCSS v4                   |
| Routing         | React Router DOM v7              |
| Icons           | React Icons (Remix, FontAwesome) |
| Dev Environment | Vite 7 + ESLint + TSConfig       |
| Password Check  | Native Web Crypto + Pwned API    |
| Visualization   | HTML5 Canvas API                 |

---

## 🔧 Project Structure

```
zeroleaks/
│
├── components/              # Reusable UI logic & visualization
├── hooks/                   # Custom hooks for state logic
├── utils/                   # Password analysis, entropy, hash
├── constants/               # Strength config mappings
├── types/                   # TypeScript interfaces & types
├── assets/                  # Static assets (if any)
├── App.tsx                  # Main app logic & routing
├── index.tsx                # Entry point
└── styles/                  # Tailwind configuration
```

---

## 🧪 How It Works

### 🔎 Entropy Calculation

Entropy is computed based on character set size and password length:

```ts
entropy = log2(charsetSize ^ passwordLength)
```

Character sets include lowercase, uppercase, digits, and symbols.

### 🛡️ Score Mapping

A simple scoring model evaluates passwords across:

* Length ≥ 12 and ≥ 16
* Mixed character types
* High entropy
* Low character repetition

Mapped to 5 categories: `Critical`, `Weak`, `Moderate`, `Strong`, `Fortress`.

### ☠️ Pwned Check (Privacy-Preserving)

Your password is hashed with SHA-1 and only the first 5 characters of the hash are sent to the API. This ensures:

* **Zero exposure** of the full password
* **Client-side only** execution
* **Full anonymity**

---

## 🖥️ Development

### 📦 Install dependencies

```bash
npm install
```

### 🔧 Development server

```bash
npm run dev
```

### ⚙️ Production build

```bash
npm run build
```

### 🔍 Preview production

```bash
npm run preview
```

### 🧹 Lint your code

```bash
npm run lint
```

---

## 📦 Dependencies

* `react`, `react-dom` — UI logic
* `react-router-dom` — Page navigation
* `react-icons` — Iconography
* `tailwindcss` — CSS utility engine
* `@vitejs/plugin-react`, `vite` — Fast bundler
* `typescript`, `eslint`, `typescript-eslint` — Type safety & linting
* `@types/*` — Full IntelliSense and TS support

---

## 🔐 Privacy & Security

* **Zero backend** — All logic is local in-browser
* **No telemetry** — No analytics or tracking
* **Ephemeral state** — No passwords or history saved to disk
* **Quantum-resilient generation** (passphrase mode)

---

## 🧠 Ideal For

* Developers creating secure login systems
* Students learning about password security
* Privacy-focused users wanting leak-free credentials
* InfoSec professionals analyzing password health
