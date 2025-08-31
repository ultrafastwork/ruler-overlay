# Ruler Overlay

A minimal transparent overlay tool that creates a grid with Photoshop-like ruler lines.
Useful for measuring, aligning, or comparing UI elements on screen.

---

## ✨ Features
- Transparent, frameless, always-on-top overlay window
- Semi-transparent grid lines using pure CSS gradients
- Configurable grid size (10px, 20px, 50px)
- **Global Hotkeys**:
  - `Ctrl+Alt+G` → Toggle overlay visibility
  - `Ctrl+Alt+C` → Toggle click-through mode (mouse clicks pass through)
- Adjustable grid size in overlay:
  - Press **1** → 10px grid
  - Press **2** → 20px grid
  - Press **3** → 50px grid
  - `Ctrl + Mouse Wheel` → fine-tune size
- Press **Esc** → Exit application
- Works on **Windows 10/11**

---

## 📂 Project Structure
```
electron-grid-overlay/
├─ .vscode/
│  ├─ launch.json     # VS Code debug config
│  └─ tasks.json      # npm tasks (install/start)
├─ main.js            # Electron main process
├─ index.html         # Overlay UI
├─ renderer.js        # Renderer logic (grid control)
├─ package.json       # NPM config (entry = main.js)
├─ tsconfig.json      # TypeScript config (optional)
├─ .gitignore
└─ node_modules/
```

---

## 🚀 Getting Started

### 1. Install dependencies
```
pnpm install
```

### 2. Run app
```
pnpm start
```

Or debug in VS Code with **F5** (uses `.vscode/launch.json`).

---

## 🔧 Development Notes
- Electron entry point: `index.js`  
- Overlay UI: `index.html` + `renderer.js`  
- Global shortcuts handled in main process (`main.js`)  
- Grid config stored in `localStorage`

---

## 🛠 Packaging (optional)
To build a distributable `.exe`:

```
pnpm install --save-dev electron-builder
```

Add to `package.json`:
```
"scripts": {
  "start": "electron .",
  "dist": "electron-builder"
}
```

Then run:
```
pnpm dist
```

---

## 📜 License
MIT
