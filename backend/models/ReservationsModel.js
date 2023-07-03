const mongoose = require("mongoose")

const ReservationsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, "Please add an user"]
    },
    price: {
        type: Number,
        required: [true, "Please add the price of the reservation."]
    },
    adults: {
        type: Number,
        required: [true, "Please add the number of adults."]
    },
    children: {
        type: Number,
        default: 0
    },
    roomNumber: {
        type: Number,
        required: [true, "Please add the room's number."]
    },
    rooms: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: [true, "Please add the main room ID."]
    },
    startDate: {
        type: Date,
        required: [true, "Please add the starting date."]
    },
    endDate: {
        type: Date,
        required: [true, "Please add the ending date."]
    },
    status: {
        type: String,
        enum: ['new', 'completed', 'canceled'],
        default: 'new'
    }

}, {timestamps: true})

module.exports = mongoose.model("Reservations", ReservationsSchema)