# Neon Tetris

A sleek, modern, web-based Tetris clone built with React, TypeScript, and Tailwind CSS. This project features a polished "Neon" dark mode aesthetic, customizable controls, and a persistent local leaderboard.

## ✨ Features

* **Classic Gameplay:** Authentic Tetris mechanics including wall kicks, hard drops, and progressive difficulty.
* **Modern Aesthetic:** A gorgeous dark-themed UI with neon glowing block effects.
* **Customizable Controls:** Rebind your keyboard controls easily through the settings menu.
* **Local Leaderboard:** Saves your highest scores locally so you can compete against yourself.
* **Pause & Resume:** Never lose your progress if you need to step away.
* **Fully Responsive:** Playable and optimized for different screen sizes (keyboard required).
* **Docker Ready:** Includes a multi-stage `Dockerfile` using Nginx for effortless deployment.

## 🚀 Tech Stack

* **Frontend:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS (v4)
* **Icons:** Lucide React
* **Containerization:** Docker & Nginx

## 🛠️ Quick Start

### Running Locally (Node.js)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t neon-tetris .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:80 neon-tetris
   ```
3. Open `http://localhost:8080` in your browser.

## 🎮 Default Controls

* **Left / Right Arrow:** Move tetromino
* **Up Arrow:** Rotate
* **Down Arrow:** Soft Drop
* **Spacebar:** Hard Drop
* **Escape:** Pause / Resume

*(All controls can be remapped in the Settings menu)*
