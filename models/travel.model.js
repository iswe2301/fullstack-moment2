"use strict";

// Inkludera Mongoose
const Mongoose = require("mongoose");

// Skapa ett schema för resor och validera datan
const travelSchema = Mongoose.Schema({
    country: {
        type: String, // Datatyp
        required: [true, "Du måste ange ett land"], // Validering
    },
    place: {
        type: String,
        required: [true, "Du måste ange en plats"],
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
        // Validera att betyget är ett heltal mellan 1 och 10
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
            // Validera att datumet är ett giltigt datum och inte i framtiden
            validator: function (value) {
                return !isNaN(Date.parse(value)) && value <= Date.now();
            },
            message: "Du måste ange ett giltigt datum som inte är i framtiden"
        }
    }
}, { timestamps: true }); // Skapa fält för createdAt och updatedAt automatiskt

// Skapa en modell för resor
const Travel = Mongoose.model('Travel', travelSchema);

// Exportera modellen
module.exports = Travel;
