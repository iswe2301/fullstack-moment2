"use strict";

// Inkludera Hapi, Mongoose och dotenv
const Hapi = require("@hapi/hapi");
const Mongoose = require("mongoose");
require("dotenv").config();

// Funktion för att starta servern
const init = async () => {

    // Skapa en ny server och använd port och host från .env eller standardvärden
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: process.env.HOST || "localhost",
        routes: {
            cors: {
                origin: ["*"] // Tillåt alla CORS-anrop
            }
        }
    });

    // Anslut till MongoDB
    Mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB");
    }).catch(error => {
        console.error("Fel vid anslutning till MongoDB: ", error);
    });

    // Inkludera och registrera alla routes för resor och skicka med servern
    require("./routes/travel.route")(server);

    await server.start();
    console.log("Server körs på %s", server.info.uri);
};

// Fånga upp eventuella fel
process.on("unhandledRejection", (err) => {

    console.log(err);
    process.exit(1);
});

// Starta servern
init();