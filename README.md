# ⬡ ShadowClient

Een Minecraft Launcher met Modrinth mod-integratie.

## Functies
- 🔍 Zoek mods via Modrinth API
- ⬇️ Download mods direct naar `.minecraft/mods`
- 🎮 Filter op Minecraft versie & mod loader (Fabric, Forge, etc.)
- 🗂️ Open je mods map met één klik
- 🖥️ Strak donker UI met venstercontrols

---

## 🚀 Installatie & Bouwen

### Vereisten
- [Node.js](https://nodejs.org) (v18 of hoger)
- Windows 10/11

### Stap 1 — Afhankelijkheden installeren
```bash
npm install
```

### Stap 2 — Testen (zonder bouwen)
```bash
npm start
```

### Stap 3 — .exe bouwen
```bash
npm run build
```

De `.exe` installer verschijnt in de `dist/` map.

---

## 📁 Projectstructuur

```
ShadowClient/
├── main.js          ← Electron main process (API calls, downloads)
├── index.html       ← UI (HTML/CSS/JS)
├── package.json     ← Config + build instellingen
├── assets/
│   └── icon.ico     ← App icoon (voeg zelf toe)
└── dist/            ← Gebouwde .exe (na npm run build)
```

---

## 📝 Notities

- Mods worden gedownload naar `%AppData%\.minecraft\mods`
- Internettoegang vereist voor Modrinth API
- Voeg een `assets/icon.ico` toe voor een eigen app-icoon
