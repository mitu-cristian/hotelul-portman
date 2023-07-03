const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

// Load the config file
dotenv.config({path: "./config/config.env"})

// Load models
const Users = require("./models/UsersModel");
const Rooms = require("./models/RoomsModel");
const Reviews = require("./models/ReviewsModel");
const Reservations = require("./models/ReservationsModel");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const rooms = JSON.parse(fs.readFileSync(`${__dirname}/_data/rooms.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));

// Import into DB
const importData = async() => {
    try {
        await Users.create(users);
        await Rooms.create(rooms);
        await Reviews.create(reviews);
        console.log("Data imported...");
        process.exit();
    }
    catch(error) {
        console.error(error);}
}

// Delete data from DB
const deleteData = async() => {
    try {
        await Users.deleteMany();
        await Rooms.deleteMany();
        await Reviews.deleteMany();
        await Reservations.deleteMany();
        console.log("Data destroyed...");
        process.exit();
    }
    catch(error) {
        console.error(error);
    }
}

if(process.argv[2] === "-i")
    importData();
else if(process.argv[2] === "-d")
    deleteData();