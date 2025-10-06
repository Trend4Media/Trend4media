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
Datenbank-Datei im Format:
```json
[
    ["Planetenname", "Koordinaten", Punktzahl, "Zerstörungsdatum", Wochennummer],
    ...
]
```

**Beispiel:**
```json
[
    ["Proxima 1-1", "123:456", 850, "2025-10-13T18:45:00Z", 1],
    ["Proxima 2-1", "111:222", 980, "2025-10-20T18:45:00Z", 2]
]
```

## 🔄 Daten aktualisieren

### Manuelle Aktualisierung:
1. Öffnen Sie `proxima_data.json`
2. Fügen Sie neue Planeten im Array-Format hinzu:
   ```json
   ["Name", "Koordinaten", Punkte, "Datum", Woche]
   ```
3. Speichern und committen Sie die Änderung

### Automatische Aktualisierung (TODO):
Das System ist vorbereitet für automatische Updates über die Spacenations API:

**Notiz:** Die offizielle API `https://beta1.game.spacenations.eu/api/proxima` gibt derzeit 404 zurück.

**Mögliche Lösungen:**
1. Kontaktieren Sie Spacenations für den korrekten API-Endpunkt
2. Erstellen Sie ein Skript zum automatischen Abrufen der Daten
3. Verwenden Sie GitHub Actions für wöchentliche Updates

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
1. **Name** (String): Planet-Name z.B. "Proxima 1-1"
2. **Koordinaten** (String): Galaktische Koordinaten z.B. "123:456"
3. **Punkte** (Number): Punktzahl des Planeten
4. **Zerstörungsdatum** (String): ISO 8601 Datum z.B. "2025-10-13T18:45:00Z"
5. **Wochennummer** (Number): Spielwoche z.B. 1, 2, 3

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
**Version:** 2.0  
**Status:** ✅ Funktionsfähig
