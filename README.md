
# DT193G Fullstack-utveckling med ramverk - Moment 2.2

## Projektbeskrivning - REST-webbtjänst med valfritt Backend-ramverk
Denna webbtjänst har tagits fram som ett projekt i kursen DT193G Fullstack-utveckling med ramverk i Webbutvecklingsprogrammet på Mittuniversitetet. Uppgiften gick ut på att skapa en webbtjänst för att hantera data i form av något fritidsintresse. En webbtjänst har tagits fram för att hantera resor. Det går att lägga till, uppdatera, hämta och ta bort resor i databasen. Varje resa har information om land, plats, beskrivning, betyg, besökt-status och besöksdatum.

## Installation

### Klona projektet

För att klona projektet, använd följande kommando:

```bash
git clone https://github.com/Webbutvecklings-programmet/moment-2-backend-ramverk-iswe2301.git
```

### Projektberoenden

Följande beroendena används i projektet:

- **Hapi.js**: För att skapa RESTful API:er.
- **Mongoose**: För att interagera med MongoDB-databasen.
- **dotenv**: För att hantera miljövariabler och konfigurationer.
- **Nodemon**: För att automatiskt starta om servern vid kodändringar under utveckling.

Projektet är ett NodeJS-projekt. Se till att du har detta installerat och kör följande kommando för att installera alla projektberoenden:

```bash
npm install
```

### Konfiguration

I projektet finns en `.env.example`-fil. Kopiera denna och döp om till `.env` samt följ instruktionerna för att anpassa konfigurationen för databasanslutning till din egen.

### Starta servern

För att starta servern, kör:

```bash
npm run start
```

Detta startar servern på http://localhost:5000, alternativt enligt de inställningar du angivit i `.env`-filen.

## API Endpoints

### Hämta alla resor

**GET** `/travels`

Hämtar alla resor från databasen.

**Exempel på anrop:**

```bash
GET https://iswe2301-fullstack-moment2.onrender.com/travels
```

**Svar:**

- **200 OK**: Lista över alla resor i databasen.
- **404 Not Found**: Om inga resor finns i databasen.
- **500 Internal Server Error**: Om något går fel vid hämtning av data.

### Hämta en resa

**GET** `/travels/{id}`

Hämtar en specifik resa baserat på resans ID.

**Exempel på anrop:**

```bash
GET https://iswe2301-fullstack-moment2.onrender.com/travels/6740cbb28ad23575da8cf23a
```

**Svar:**

- **200 OK**: Information om den specifika resan.
- **404 Not Found**: Om resan med det angivna ID:t inte finns.
- **500 Internal Server Error**: Om något går fel vid hämtning av data.

### Skapa en resa

**POST** `/travels`

Skapar en ny resa. Skickar med data i body.

**Exempel på anrop:**

```bash
POST https://iswe2301-fullstack-moment2.onrender.com/travels
Content-Type: application/json

{
    "country": "Norge",
    "place": "Lofoten",
    "rating": 9,
    "visited": true,
    "visitDate": "2023-06-01"
}
```

**Svar:**

- **201 Created**: Resan skapades framgångsrikt.
- **400 Bad Request**: Om obligatoriska fält saknas eller inte är korrekt ifyllda.
- **500 Internal Server Error**: Om något går fel vid skapande av resan.

Felmeddelande-exempel vid 400:

```json
{
  "message": "Fel vid skapande av resa",
  "errors": {
    "country": "Du måste ange ett land",
    "place": "Du måste ange en plats"
  }
}
```

### Uppdatera en resa

**PUT** `/travels/{id}`

Uppdaterar en resa baserat på resans ID. Skickar med data i body.

**Exempel på anrop:**

```bash
PUT https://iswe2301-fullstack-moment2.onrender.com/travels/6740cbb28ad23575da8cf23a
Content-Type: application/json

{
    "country": "Norge",
    "place": "Lofoten",
    "rating": 10,
    "visited": true,
    "visitDate": "2023-07-01"
}
```

**Svar:**

- **200 OK**: Resan har uppdaterats framgångsrikt.
- **404 Not Found**: Om resan med det angivna ID:t inte finns.
- **500 Internal Server Error**: Om något går fel vid uppdatering av resan.

### Ta bort en resa

**DELETE** `/travels/{id}`

Tar bort en resa baserat på resans ID.

**Exempel på anrop:**

```bash
DELETE https://iswe2301-fullstack-moment2.onrender.com/travels/6740cbb28ad23575da8cf23a
```

**Svar:**

- **200 OK**: Resan har tagits bort.
- **404 Not Found**: Om resan med det angivna ID:t inte finns.
- **500 Internal Server Error**: Om något går fel vid borttagning av resan.

## Felhantering

API:et kommer att returnera HTTP-statuskoder för att visa på resultatet av förfrågningarna:

- **200 OK**: För framgångsrika GET-, PUT- och DELETE-förfrågningar.
- **201 Created**: För en lyckad POST-förfrågan (skapad resurs).
- **400 Bad Request**: När data inte är korrekt eller saknas vid POST- eller PUT-förfrågningar.
- **404 Not Found**: När resursen inte kan hittas.
- **500 Internal Server Error**: Om ett oväntat fel inträffar på servern.

## Mongoose-Schema

För att skapa eller uppdatera resor i API:et, används följande **Mongoose-schema**. Här definieras fälten för resorna:

- **country**: Landet där resan ägde rum (string, obligatorisk).
- **place**: Platsen (stad eller område) för resan (string, obligatorisk).
- **description**: En beskrivning av resan (string, max 500 tecken, valfri).
- **rating**: Ett valfritt betyg för resan (number, mellan 1-10, valfri).
- **visited**: Om resan har genomförts eller inte (boolean, obligatorisk).
- **visitDate**: Datum för när resan genomfördes (date, måste vara giltigt datum och får ej ligga i framtiden, valfri).
- **timestamps**: Datum som sätts automatiskt när en post skapas/uppdateras (createdAt och updatedAt).

Exempel på schema-koden:

```javascript
const travelSchema = Mongoose.Schema({
    country: {
        type: String,
        required: [true, "Du måste ange ett land"]
    },
    place: {
        type: String,
        required: [true, "Du måste ange en plats"]
    },
    description: {
        type: String,
        maxlength: [500, "Beskrivningen får max vara 500 tecken"],
        required: false
    },
    rating: {
        type: Number,
        required: false,
        min: [1, "Lägsta betyg är 1"],
        max: [10, "Högsta betyg är 10"],
        validate: {
            validator: function (value) {
                return Number.isInteger(value) && value >= 1 && value <= 10;
            },
            message: "Betyget måste vara ett heltal mellan 1 och 10"
        }
    },
    visited: {
        type: Boolean,
        required: [true, "Du måste ange om du har besökt platsen eller inte"]
    },
    visitDate: {
        type: Date,
        required: false,
        validate: {
            validator: function (value) {
                return !isNaN(Date.parse(value)) && value <= Date.now();
            },
            message: "Du måste ange ett giltigt datum som inte är i framtiden"
        }
    }
}, { timestamps: true });
```

## Om

* **Av:** Isa Westling
* **Kurs:** DT209G Webbutveckling för WordPress
* **Program:** Webbutvecklingsprogrammet
* **År:** 2024
* **Termin:** 3 (HT)
* **Skola:** Mittuniversitetet