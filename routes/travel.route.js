"use strict";

// Inkludera controllern för resor
const travelController = require("../controllers/travel.controller.js");

// Routes som exporteras
module.exports = (server) => {
    // Definiera routes
    server.route([
        {
            method: "GET", // HTTP-metod
            path: "/travels", // URL (sökväg) för API-endpoint
            handler: travelController.getAllTravels // Controllermetod som körs vid anrop
        },
        {
            method: "GET",
            path: "/travels/{id}",
            handler: travelController.getTravelById
        },
        {
            method: "POST",
            path: "/travels",
            handler: travelController.createTravel
        },
        {
            method: "PUT",
            path: "/travels/{id}",
            handler: travelController.updateTravel
        },
        {
            method: "DELETE",
            path: "/travels/{id}",
            handler: travelController.deleteTravel
        }]
    );
}