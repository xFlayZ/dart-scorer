# Changelog

## [1.2.2] - 2024-04-13
- Hinzugefügt: In den Gamemodes "Single Out" und "Double Out" kann zum 1. vorherigen Spieler zurückgekehrt werden.
- Hinzugefügt: In den Gamemodes "Single Out" und "Double Out" ist es nun möglich den Aktivitätsstatus des Spielers am Ende einer Runde zu setzen.
- Fix: Berechnung des Tabellenfeldes "Höchster Wurf" innerhalb der Gamemodes "Single Out" und "Double Out" kann nun nicht mehr größer als 180 sein.
- Fix: Einige Checkouts wurden korregiert und hinzugefügt, da Sie entweder nicht möglich waren oder fehlten. 

## [1.2.1] - 2024-04-12
- Hinzugefügt: In den Gamemodes "Single Out" und "Double Out" wurde die Tabelle um "Höchster Wurf" erweitert.
- Hinzugefügt: "Reset"-Button innerhalb der "Preset" Komponente um Lokal-Storage Daten einfach zu verwerfen.
- Hinzugefügt: "Zurück"-Button innerhalb des Spieles um wieder zur "Preset" Komponente zurückzukehren.
- Änderung: "Runden Avarage" heißt nun "Runden Durchschnitt"
- Änderung: Wenn die Seite neulädt soll ein setupGame erfolgen, um Fehler zu vermeiden.


## [1.2.0] - 2024-04-11
- Hinzugefügt: Changelogs
- Hinzugefügt: Erster Prototyp für eine Lokal-Storage variante um Daten innerhalb des Computers zu speichern.
- Hinzugefügt: Neue Dart Korregierungsvariante für die Gamemodes "Single Out" und "Double Out".
- Änderung: Eigener Pfad für alle Gamemodes 
- Entfernt: "DartComponent"

## [>1.1.0] - 2024-04-01
- Preset Komponente mit 3 Gamemodes. (Single Out, Double Out, Around the Clock)
- Klickbare Dartscheibe mit Zählfunktion.
- Basis Komponenten für alle Gamemodes.
- Allgemeine Funktionen für Dart Scorer.