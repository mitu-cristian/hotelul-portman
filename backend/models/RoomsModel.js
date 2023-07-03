const mongoose = require('mongoose');

const RoomsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title."],
        unique: true
    },
    price: {
        type: Number,
        required: [true, "Please add a price."]
    },
    maxPeople: {
        type: Number,
        required: [true, "Please add the maximum people."]
    },
    roomNumbers: [{
        number: Number,
        unavailableDates: { type: [Date] }
    }]
},
    {timestamps: true}
);

module.exports = mongoose.model("Rooms", RoomsSchema);