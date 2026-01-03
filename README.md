# 🎮 Asteroid Shooter - Elite Edition

Ein modernes, hochperformantes **Asteroid Shooter Spiel** mit beeindruckender Grafik, flüssigen Animationen und professionellem Design - gebaut mit **Electron** und **Canvas**.

## 🌟 Features

- **Modernes Futuristic Design** mit Neon-Effekten und Glows
- **Hochwertige Partikeleffekte** und Explosionsanimationen
- **Hohe Performance** - 60 FPS auf allen Systemen
- **Gradient Hintergrund** mit twitternden Sternen
- **Combo-System** für aufeinanderfolgende Treffer
- **Health-System** mit visueller Anzeige
- **Progressive Schwierigkeit** - wird immer spannender
- **Statistik-Anzeige** - Score, Accuracy, Zerstörte Asteroiden
- **Keyboard Controls** mit Boost-Funktion
- **Cross-Platform** - Windows, macOS, Linux

## 🎮 Steuerung

| Taste | Aktion |
|-------|--------|
| `←` / `A` | Nach links bewegen |
| `→` / `D` | Nach rechts bewegen |
| `SPACE` | Schießen |
| `SHIFT` | Boost (schneller) |

## 🚀 Installation

### Voraussetzungen
- Node.js (v16 oder höher)
- npm oder yarn

### Setup

```bash
# Repository klonen
git clone https://github.com/deinname/asteroid-shooter.git
cd asteroid-shooter

# Dependencies installieren
npm install

# Im Entwicklungsmodus starten
npm start

# .EXE bauen
npm run build
```

## 📦 Build für Windows

Nach dem Build-Prozess findest du die `.exe` Datei in:
```
dist/Asteroid-Shooter-Elite-Setup-1.0.0.exe
```

Doppelklick zum Installieren und starten!

## 🎨 Technologie-Stack

- **Electron** - Cross-Platform Desktop App
- **Canvas 2D** - High-Performance Graphics
- **Vanilla JavaScript** - Keine Heavy Frameworks
- **CSS3** - Moderne Animationen & Effekte
- **electron-builder** - Für Windows .exe Erstellung

## 📊 Gameplay Features

### Scoring System
- Jeden zerstörten Asteroid: Punkte basierend auf Größe
- Combo-Multiplikator bei schnellen Treffern
- Statistik: Accuracy (Trefferquote)

### Difficulty Scaling
- Schwierigkeit steigt alle 500 Punkte
- Schnellere Asteroiden
- Mehr Asteroiden
- Bis zu 6 Schwierigkeitsstufen

### Health System
- 100 HP zu Spielstart
- Jeden verpassten Asteroid: 15-30 Schaden
- Game Over bei 0 HP
- Visueller Health-Bar

## 🔧 Konfiguration

In `script.js` kannst du folgende Parameter anpassen:

```javascript
// Spielgeschwindigkeit
let asteroidSpeed = 2;

// Spawn-Rate (niedriger = mehr Asteroiden)
let spawnRate = 80;

// Player-Geschwindigkeit
player.speed = 6;
player.boostSpeed = 11;
```

## 📝 Lizenz

MIT License - Frei verwendbar für persönliche und kommerzielle Projekte.

## 🤝 Beitragen

Verbesserungsvorschläge sind willkommen!

### Ideen für Erweiterungen
- [ ] Power-ups System
- [ ] verschiedene Waffen
- [ ] Multiplayer-Mode
- [ ] Sound Effects & Musik
- [ ] Leaderboard mit Highscores
- [ ] Level/Wave System
- [ ] Mobile-Version

## 📧 Kontakt

Hast du Fragen oder Vorschläge? Erstelle ein Issue auf GitHub!

---

**Viel Spaß beim Spielen! 🎮✨**
