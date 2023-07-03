const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Rooms = require("../models/RoomsModel");
const Reservations = require("../models/ReservationsModel");
const {getDatesInRange} = require("../utils/getDatesInRange")

const UsersSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please add your first name."],
    },
    lastname: {
        type: String, 
        required: [true, "Please add your last name."],
    },
    email: {
        type: String,
        required: [true, "Please add an email address."],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email address.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please add a password."],
        select: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
        select: false
    }
},
    {timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}}
)

// Encrypting password using bcrypt
UsersSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        next();
    const salt = await bcrypt.genSalt(10);
// We have access to the password from the body
    this.password = await bcrypt.hash(this.password, salt);
} )

// Sign JWT and return
UsersSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered password to hashed password in the database
UsersSchema.methods.matchPassword = async function (enteredPassword) {
// this.password is the hashed password saved in the database
    return await bcrypt.compare(enteredPassword, this.password)
}

// Cascade delete reviews when an user is deleted
UsersSchema.pre('deleteOne',  {document: true, query: false}, async function(next) {
    console.log("Review being deleted.")
    await this.model('Reviews').deleteOne({user: this._id})
    
    const reservations = await Reservations.find({user: this._id})
    
    let i = 0;
    while (i < reservations.length) {

        let start = reservations[i].startDate;
        let end = reservations[i].endDate;
        let number = reservations[i].roomNumber;

        const allDates = getDatesInRange(start, end);
        await Rooms.findOneAndUpdate({ "roomNumbers.number": number },
      { $pullAll: { "roomNumbers.$.unavailableDates": allDates } }, { new: true }
    );
        i = i + 1;
    }   
        await Reservations.deleteMany({user: this._id})
        
    next();
})

// Reverse populate with virtuals i.e. for every User we will show the review
UsersSchema.virtual('review', {
    ref: 'Reviews',
    localField: "_id",
    foreignField: "user",
})

UsersSchema.virtual("reservations", {
    ref: 'Reservations',
    localField: "_id",
    foreignField: "user",
    justOne: false
})

module.exports = mongoose.model("Users", UsersSchema);