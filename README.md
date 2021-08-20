# Kiosk mode traffic information for Swedish trains and train stations
_Information will follow in Swedish for the rest of this README_

Detta är en lekstuga med React för att bygga en trafikinformationstjänst för järnväg anpassad för visning i olika former av statiska skärmar. Navigation och anpassning av sker via URL, för att enkelt kunna visas i kioskklienter.

Tjänsten använder sig av stationsförkortningar utifrån Trafikverkets databas, Stockholm C har exempelvis 'Cst', Göteborg har 'G' och Malmö har 'M'. Komplett lista går att få ut från Trafikverkets öppna API vid behov.

## Funktionalitet
* Visa tågs tidtabell och aktuella position.
* Visa ankomster och avgångar vid särskild station.
* Visa antingen ankomster eller avgångar vid särskild station, för separat visning på flera skärmar.
* Visa aktuella trafikmeddelanden som berör en särskild station.

## URL endpoints
* /train/12345 - visar tidtabell och position
* /station/Abc - visar ankomster och avgångar vid stationssignatur Abc
* /station/Abc/arrivals - visar ankomster vid stationssignatur Abc
* /station/Abc/departures - visar avgångar vid stationssignatur Abc
* /msg/Abc - visar trafikmeddelanden vid stationssignatur Abc

## Krav för att köra applikationen
För att få tillgång till Trafikverkets öppna API krävs en API-nyckel som du kan få via https://api.trafikinfo.trafikverket.se. Denna placeras sedan i variabeln _REACT_APP_TRV_APIKEY_ i en .env-fil eller i miljövariablerna på systemet som skall köra applikationen.
