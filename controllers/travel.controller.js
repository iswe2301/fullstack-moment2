"use strict";

// Inkludera modellen för resor
const Travel = require("../models/travel.model.js");

// Metod för att hämta alla resor, exporteras för att användas i routes
exports.getAllTravels = async (request, h) => {
    try {
        // Hämta alla resor från databasen
        const travels = await Travel.find();
        if (travels.length === 0) {
            return h.response("Inga resor hittades").code(404);
        }
        // Returnera resorna med statuskod 200
        return h.response(travels).code(200);
    } catch (error) {
        // Fånga upp eventuella fel
        console.log("Fel vid hämtning av resor: ", error);
        return h.response("Något gick fel vid hämtning av resor").code(500);
    }
}

// Metod för att hämta en resa baserat på ID
exports.getTravelById = async (request, h) => {
    try {
        // Hämta resan baserat på ID
        const travel = await Travel.findById(request.params.id);
        // Kontrollera om resan inte hittades och returnera 404
        if (!travel) {
            return h.response("Resan hittades inte").code(404);
        }
        // Returnera resan med statuskod 200
        return h.response(travel).code(200);
    } catch (error) {
        // Fånga upp eventuella fel
        console.log("Fel vid hämtning av resa: ", error);
        return h.response("Något gick fel vid hämtning av resa").code(500);
    }
}

// Metod för att skapa en resa
exports.createTravel = async (request, h) => {
    try {
        // Skapa en ny resa baserat på datan i request.payload
        const travel = new Travel(request.payload);
        const savedTravel = await travel.save();
        // Returnera den sparade resan med statuskod 201
        return h.response({
            message: "Resa skapad",
            travel: savedTravel
        }).code(201);
    } catch (error) {
        // Fånga upp eventuella valideringsfel
        if (error.name === "ValidationError") {
            const errors = {};
            // Loopa igenom valideringsfelen och lägg till dem i errors-objektet
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            // Returnera felmeddelanden med statuskod 400
            return h.response({
                message: "Fel vid skapande av resa",
                errors: errors
            }).code(400);
        }
        // Fånga upp eventuella andra fel
        console.log("Fel vid skapande av resa: ", error);
        return h.response("Något gick fel vid skapande av resa").code(500);
    }
}

// Metod för att uppdatera en resa
exports.updateTravel = async (request, h) => {
    try {
        // Kontrollera om resan finns och returnera 404 om den inte hittas
        const travel = await Travel.findById(request.params.id);
        if (!travel) {
            return h.response("Resan hittades inte").code(404);
        }
        // Uppdatera resan baserat på ID och request.payload
        const updatedTravel = await Travel.findByIdAndUpdate(
            request.params.id,
            request.payload,
            { new: true, runValidators: true } // Kör validering 
        );
        // Returnera den uppdaterade resan med statuskod 200
        return h.response({
            message: "Resa uppdaterad",
            travel: updatedTravel
        }).code(200);
    } catch (error) {
        // Fånga upp eventuella valideringsfel
        if (error.name === "ValidationError") {
            const errors = {};
            // Loopa igenom valideringsfelen och lägg till dem i errors-objektet
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            // Returnera felmeddelanden med statuskod 400
            return h.response({
                message: "Fel vid uppdatering av resa",
                errors: errors
            }).code(400);
        }
        // Fånga upp eventuella andra fel
        console.log("Fel vid uppdatering av resa: ", error);
        return h.response("Något gick fel vid uppdatering av resa").code(500);
    }
}

// Metod för att ta bort en resa
exports.deleteTravel = async (request, h) => {
    try {
        // Kontrollera om resan finns och returnera 404 om den inte hittas
        const travel = await Travel.findById(request.params.id);
        if (!travel) {
            return h.response("Resan hittades inte").code(404);
        }
        // Ta bort resan baserat på ID och returnera meddelande och ID med statuskod 200 om borttagningen lyckas
        await Travel.findByIdAndDelete(request.params.id);
        return h.response({
            message: "Resan har tagits bort",
            id: request.params.id
        }).code(200);
    } catch (error) {
        // Fånga upp eventuella fel
        console.log("Fel vid borttagning av resa: ", error);
        return h.response("Något gick fel vid borttagning av resa").code(500);
    }
}