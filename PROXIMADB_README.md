# ProximaDB - Dokumentation

## 🌌 Übersicht

ProximaDB ist ein System zur Verfolgung von Proxima-Planeten im Spacenations-Spiel. Es zeigt wichtige Informationen wie Koordinaten, Punktzahl und Zerstörungsdatum an.

## 🔧 Behobene Probleme

### Ursprüngliche Probleme:
1. ❌ **Fehlende Datendatei**: `proxima_data.json` existierte nicht
2. ❌ **API-Endpunkt defekt**: Spacenations API gab 404-Fehler zurück
3. ❌ **Datei nicht im Repository**: ProximaDB.html war nur auf Production

### Lösungen:
1. ✅ **ProximaDB.html erstellt**: Datei ist jetzt im Repository mit verbesserter Fehlerbehandlung
2. ✅ **proxima_data.json erstellt**: Beispieldaten für Planeten hinzugefügt
3. ✅ **Mehrere Datenquellen**: System versucht automatisch verschiedene Endpunkte
4. ✅ **Bessere Fehlermeldungen**: Klare Hinweise wenn Daten nicht verfügbar sind

## 📁 Dateien

### `ProximaDB.html`
Die Hauptseite für die Anzeige der Proxima-Daten mit:
- Modernes Razer-Gaming-Design
- Responsive Layout für Mobile & Desktop
- Statistik-Dashboard
- Sortierbare Tabelle mit Planetendaten
- Automatische Fehlerbehandlung

### `proxima_data.json`
Datenbank-Datei im JSON-Objekt-Format (Spacenations API Format):
```json
[
    {
        "name": "Proxima 0-1",
        "coordinates": "555:161:2",
        "score": 186,
        "deleteOn": "2025-10-11T11:00:00.000000Z"
    },
    ...
]
```

**Hinweis:** Die Wochennummer wird automatisch aus dem Planetennamen extrahiert (z.B. "Proxima 0-1" → Woche 0)

## 🔄 Daten aktualisieren

**Wichtig:** Das System lädt Daten automatisch von der Live-API. Die lokale `proxima_data.json` dient nur als Backup!

### Automatische Aktualisierung:
✅ **Das System ist jetzt vollständig funktionsfähig!**

Die ProximaDB lädt Daten automatisch von der Spacenations API:
- **Live-API**: `https://beta2.game.spacenations.eu/api/proxima`
- **Backup**: Lokale `proxima_data.json` Datei
- **Updates**: Automatisch bei jedem Seitenaufruf

### Manuelle Backup-Aktualisierung:
```bash
# Daten von der API abrufen und speichern
curl -s "https://beta2.game.spacenations.eu/api/proxima" -o proxima_data.json

# Änderungen committen
git add proxima_data.json
git commit -m "Update Proxima-Daten"
git push
```

### Beispiel GitHub Action (proxima-update.yml):
```yaml
name: Update ProximaDB
on:
  schedule:
    - cron: '45 18 * * 3'  # Jeden Mittwoch um 18:45 Uhr
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch Proxima Data
        run: |
          # Hier Ihr Skript zum Abrufen der Daten
          curl -o proxima_data.json https://IHRE-API-URL/proxima
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add proxima_data.json
          git commit -m "Update ProximaDB data" || exit 0
          git push
```

## 🎯 Datenformat Details

### Feld-Beschreibungen:
1. **name** (String): Planet-Name z.B. "Proxima 0-1"
2. **coordinates** (String): Galaktische Koordinaten z.B. "555:161:2"
3. **score** (Number): Punktzahl des Planeten
4. **deleteOn** (String): ISO 8601 Datum z.B. "2025-10-11T11:00:00.000000Z"
5. **Wochennummer**: Wird automatisch aus dem Namen extrahiert (z.B. "Proxima 0-1" → Woche 0)

### Punktzahl-Klassifizierung:
- 🟢 **Hoch** (≥500): Grün mit Glow-Effekt
- 🟡 **Mittel** (200-499): Gold mit Glow-Effekt  
- 🔴 **Niedrig** (<200): Rot mit Glow-Effekt

## 🚀 Deployment

### Railway (Production):
Die Dateien werden automatisch auf Railway deployed:
- URL: https://spacenations-tools-production.up.railway.app/ProximaDB.html

### Lokale Entwicklung:
```bash
# Einfacher HTTP-Server
python3 -m http.server 8000

# Oder mit Node.js
npx http-server
```

Dann öffnen: `http://localhost:8000/ProximaDB.html`

## ⚙️ Konfiguration

### API-Endpunkte anpassen:
In `ProximaDB.html`, Zeile ~490:
```javascript
const API_ENDPOINTS = [
    './proxima_data.json',  // Lokale Datei zuerst
    'proxima_data.json',    // Alternative lokaler Pfad
    'https://IHRE-URL/proxima_data.json'  // Production Fallback
];
```

## 🐛 Fehlerbehebung

### "Fehler beim Laden der Daten"
**Ursachen:**
- `proxima_data.json` fehlt oder ist ungültig
- Netzwerkfehler
- Falsches Datenformat

**Lösungen:**
1. Überprüfen Sie, ob `proxima_data.json` existiert
2. Validieren Sie das JSON-Format
3. Prüfen Sie die Browser-Konsole für Details

### Leere Tabelle
**Ursachen:**
- Leeres Array in `proxima_data.json`
- Falsches Datenformat

**Lösungen:**
1. Fügen Sie mindestens einen Planeten hinzu
2. Überprüfen Sie das Array-Format

### API 404-Fehler
**Ursachen:**
- Spacenations API-Endpunkt nicht verfügbar
- Ungültige URL

**Lösungen:**
1. Kontaktieren Sie Spacenations für korrekte API-URL
2. Verwenden Sie die lokale `proxima_data.json` als Fallback

## 📝 Wartung

### Wöchentliche Aufgaben:
- [ ] Neue Proxima-Planeten zur JSON-Datei hinzufügen
- [ ] Alte/zerstörte Planeten entfernen
- [ ] Punktzahlen aktualisieren
- [ ] Deployment überprüfen

### Monatliche Aufgaben:
- [ ] Logs überprüfen
- [ ] Performance-Metriken analysieren
- [ ] Backup der Daten erstellen

## 🔗 Ressourcen

- Spacenations Spiel: https://spacenations.eu
- GitHub Repository: https://github.com/Trend4Media/Spacenations-Tools
- Production URL: https://spacenations-tools-production.up.railway.app

## 📞 Support

Bei Problemen oder Fragen:
1. Öffnen Sie ein GitHub Issue
2. Überprüfen Sie die Browser-Konsole für Fehlerdetails
3. Kontaktieren Sie das Entwicklungsteam

---

**Letzte Aktualisierung:** 2025-10-06  
**Version:** 2.1  
**Status:** ✅ Voll funktionsfähig mit Live-API  
**Aktuelle Daten:** 60 Proxima-Planeten (Woche 0)
